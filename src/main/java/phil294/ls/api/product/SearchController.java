package phil294.ls.api.product;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import phil294.ls.api.model.*;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;
import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.Stream;

/**
 * User: phi
 * Date: 19.02.17
 * .  .___.
 * .  {o,o}
 * . /)___)
 * . --"-"--
 */
@RestController
@RequestMapping("/search")
public class SearchController
{
	@PersistenceContext
	private EntityManager entityManager;
	@Autowired
	private ProductRepository productRepository;
	@Autowired
	private AttributeRepository attributeRepository;
	
	private enum SortingOrder
	{
		ASC,
		DESC
	}
	
	/**
	 * todo docu überall
	 * http://localhost:8080/search?filter=8:2,5:Coupe&sorting=7:1&show=14,17&rows=4&columns=8 // todo veraltet
	 */
	@GetMapping
	public ResponseEntity<SearchResponse> search(
			@RequestAttribute("user") User opionalUser,
			// search(filterAttributes: Map<number,string>, sortingAttributes: Map<number, SortingOrder>, showAttributes: Set<number>, rows: number, columns: number) {
			// 	return this.http.get(`/search?filter=${filterQ}&sorting=${sortingQ}&show=${showingQ}&rows=${rows}&columns=${columns}`)
			@RequestParam("filter") String filterQ,
			@RequestParam("sorting") String sortingQ,
			@RequestParam("show") String showingQ,
			@RequestParam("rows") int rows,
			@RequestParam("columns") int columns
	)
	{
		// parse inputs into collections
		Map<Integer, Filter> filters = filterQ.isEmpty() ? new HashMap<>() :
				Arrays.stream(filterQ.split(",")) // 8:_3_7,11:3__
						.map(s -> s.split(":"))
						.collect(Collectors.toMap(
								s -> Integer.valueOf(s[0]), // filter attribute id
								s -> { // _y_z (value) or x__ (range)
									String[] conditions = s[1].split("_", -1);
									return new Filter(conditions[0], conditions[1], conditions[2]);
								}));
		Map<Integer, SortingOrder> sorters = sortingQ.isEmpty() ? new LinkedHashMap<>() :
				Arrays.stream(sortingQ.split(",")) // 9:0,10:0,11:1
						.map(s -> s.split(":"))
						.collect(Collectors.toMap(
								s -> Integer.parseInt(s[0]),
								s -> SortingOrder.values()[Integer.parseInt(s[1])],
								(v1, v2) -> v1,
								LinkedHashMap::new));
		Set<Integer> showers = showingQ.isEmpty() ? new LinkedHashSet<>() :
				Arrays.stream(showingQ.split(",")) // 5,7,2
						.map(Integer::parseInt)
						.collect(Collectors.toCollection(LinkedHashSet::new));
		// all attributes in the pivot table, from which to filter & sort afterwards, fillers etc
		// order matters: == view order on website: 1st sorters, 2nd showers, 3rd filters, 4th fillers
		Set<Integer> relevant_attrs_ids = Stream.concat(sorters.keySet().stream(), Stream.concat(showers.stream(), filters.keySet().stream()))
				.collect(Collectors.toCollection(LinkedHashSet::new));
		// COLUMNS: FILLERS
		int fillers_size = columns - relevant_attrs_ids.size();
		if(fillers_size > 0) {
			Set<Integer> dontFindMe = new HashSet<>();
			if(relevant_attrs_ids.isEmpty()) {
				dontFindMe.add(-1); // todo JPA bug?? "ByIdNotIn[emptySet]" returns 0
			} else {
				dontFindMe = relevant_attrs_ids;
			}
			List<Integer> fillers = attributeRepository.findByIdNotInOrderByInterestDesc(dontFindMe, new PageRequest(0, fillers_size))
					.stream().map(Attribute::getId).collect(Collectors.toList());
			relevant_attrs_ids.addAll(fillers);
		}
		// messes up ordering
		Iterable<Attribute> relevant_attrs_iter = attributeRepository.findAll(relevant_attrs_ids);
		// iterable to list
		List<Attribute> relevant_attrs_messy = new ArrayList<>();
		relevant_attrs_iter.forEach(relevant_attrs_messy::add);
		// restore ordering of messy list into relevant attrs
		final List<Attribute> relevant_attrs = relevant_attrs_ids.stream().map(attr ->
				relevant_attrs_messy.stream().filter(attribute -> attribute.getId() == attr)
						.findFirst().get()).collect(Collectors.toList());
		
		// MAIN QUERY JPQL
		String queryString = "" +
				"SELECT * FROM ( " +
				// pivot
				"SELECT p.id,p.user,p.name,p.description,p.picture,";
		Collection<String> pivot_snippets = new ArrayList<>();
		for(Attribute attr : relevant_attrs) {
			String value_col = attr.getType() == AttributeType.NUMBER ? "value_number" : "value_string";
			pivot_snippets.add("MAX( CASE WHEN attribute = " + attr.getId() + " THEN " + value_col + " END ) as attr" + attr.getId() + " ");
		}
		queryString += String.join(", ", pivot_snippets);
		queryString += "" +
				"FROM products p LEFT JOIN product_data pvs ON pvs.product = p.id " +
				"GROUP BY p.id " +
				") AS pivot ";
		// select from pivot table: FILTERS
		List<String> filter_snippets = new ArrayList<>();
		Map<Integer, String> filterStringValues = new LinkedHashMap<>();
		int i = 0;
		for(Map.Entry<Integer, Filter> filterEntry : filters.entrySet()) {
			int filterAttr = filterEntry.getKey();
			Filter filter = filterEntry.getValue();
			if(filter.value.isEmpty()) {
				// range filter: between
				if(filter.range_from.isEmpty() || filter.range_to.isEmpty()) {
					throw new IllegalArgumentException("Invalid filter range.");
				}
				Attribute matchingAttribute = relevant_attrs.stream().filter(attribute -> attribute.getId() == filterAttr).findFirst().get();
				if(matchingAttribute.getType() != AttributeType.NUMBER) {
					throw new IllegalArgumentException("Requested range for non-number-type attribute " + filterAttr);
				}
				filter_snippets.add("attr" + filterAttr + " BETWEEN " + filter.range_from + " AND " + filter.range_to + " ");
			} else {
				// value filter
				i++;
				filter_snippets.add("attr" + filterAttr + " = ?" + i + " "); // parameter placeholders
				filterStringValues.put(i, filter.value);
			}
		}
		if(!filter_snippets.isEmpty()) {
			queryString += "WHERE " + String.join(" AND ", filter_snippets);
		}
		// SORTERS
		List<String> order_snippets = new ArrayList<>();
		for(Map.Entry<Integer, SortingOrder> sorterEntry : sorters.entrySet()) {
			order_snippets.add("attr" + sorterEntry.getKey() + " " + sorterEntry.getValue().name() + " ");
		}
		if(!order_snippets.isEmpty()) {
			queryString += "ORDER BY " + String.join(", ", order_snippets);
		}
		// (SHOWERS): -> happens via relevant_attrs
		// ROWS
		queryString += "LIMIT " + rows + " ";
		Query query = entityManager.createNativeQuery(queryString);
		for(Map.Entry<Integer, String> filterEntry : filterStringValues.entrySet()) {
			query.setParameter(filterEntry.getKey(), filterEntry.getValue()); // fill parameter placeholders
		}
		// get result
		List<Product> products = new ArrayList<>();
		List<Object> objs = query.getResultList();
		i = 0;
		for(Object obj : objs) {
			Object[] o = (Object[]) obj;
			i = -1; Product product = new Product();
			// product infos: ...SELECT p.id,p.user,p.name,p.description,p.picture
			product.setId((int) o[++i]);
			product.setUser((int) o[++i]);
			product.setName((String) o[++i]);
			product.setDescription((String) o[++i]);
			product.setPicture((String) o[++i]);
			// product values
			for(Attribute attr : relevant_attrs) {
				product.getProductData().put(attr.getId(), o[++i]); // no casting, return as objs
			}
			products.add(product);
		}
		List<Integer> attributeOrder = relevant_attrs.stream().map(attribute -> attribute.getId()).collect(Collectors.toList());
		SearchResponse response = new SearchResponse(products, attributeOrder);
		return new ResponseEntity<>(response, HttpStatus.OK);
	}
}
