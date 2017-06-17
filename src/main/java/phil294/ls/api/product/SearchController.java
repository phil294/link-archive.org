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
	 * http://localhost:8080/search?filter=8:2,5:Coupe&sorting=7:1&show=14,17&rows=4&columns=8
	 */
	@GetMapping
	public ResponseEntity<List<Product>> search(
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
		Map<Integer, String> filters = filterQ.isEmpty() ? new HashMap<>() :
				Arrays.stream(filterQ.split(","))
						.map(s -> s.split(":"))
						.collect(Collectors.toMap(s -> Integer.valueOf(s[0]), s -> s[1]));
		Map<Integer, SortingOrder> sorters = sortingQ.isEmpty() ? new LinkedHashMap<>() :
				Arrays.stream(sortingQ.split(","))
						.map(s -> s.split(":"))
						.collect(Collectors.toMap(
								s -> Integer.parseInt(s[0]),
								s -> SortingOrder.values()[Integer.parseInt(s[1])],
								(v1, v2) -> v1,
								LinkedHashMap::new));
		Set<Integer> showers = showingQ.isEmpty() ? new LinkedHashSet<>() :
				Arrays.stream(showingQ.split(","))
						.map(Integer::parseInt)
						.collect(Collectors.toCollection(LinkedHashSet::new));
		// all attributes in the pivot table, from which to filter & sort afterwards, fillers etc
		// order matters: == view order on website: 1st sorters, 2nd showers, 3rd filters, 4th fillers
		Set<Integer> relevant_attrs = Stream.concat(sorters.keySet().stream(), Stream.concat(showers.stream(), filters.keySet().stream()))
				.collect(Collectors.toSet());
		// COLUMNS: FILLERS
		int fillers_size = columns - relevant_attrs.size();
		if(fillers_size > 0) {
			Set<Integer> dontFindMe = new HashSet<>();
			if(relevant_attrs.isEmpty()) {
				dontFindMe.add(-1); // todo JPA bug?? "ByIdNotIn[emptySet]" returns 0
			} else {
				dontFindMe = relevant_attrs;
			}
			List<Integer> fillers = attributeRepository.findByIdNotInOrderByInterestDesc(dontFindMe, new PageRequest(0, fillers_size))
					.stream().map(Attribute::getId).collect(Collectors.toList());
			relevant_attrs.addAll(fillers);
		}
		
		// MAIN QUERY JPQL
		String queryString = "" +
				"SELECT * FROM ( " +
				// pivot
				"SELECT p.id,p.user,p.name,p.description,p.picture,";
		Collection<String> pivot_snippets = new ArrayList<>();
		for(int attr : relevant_attrs) {
			pivot_snippets.add("MAX( CASE WHEN attribute = " + attr + " THEN value END ) as attr" + attr + " ");
		}
		queryString += String.join(", ", pivot_snippets);
		queryString += "" +
				"FROM products p INNER JOIN product_data pvs ON pvs.product = p.id " +
				"GROUP BY p.id " +
				") AS pivot ";
		// select from pivot table: FILTERS
		List<String> filter_snippets = new ArrayList<>();
		int i = 0;
		for(int filterAttr : filters.keySet()) {
			filter_snippets.add("attr" + filterAttr + " = ?" + (++i) + " "); // parameter placeholders
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
		i = 0;
		for(String filterValue : filters.values()) {
			query.setParameter(++i, filterValue); // fill parameter placeholders
		}
		// get result
		List<Product> products = new ArrayList<>();
		List<Object> objs = query.getResultList();
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
			for(int attr : relevant_attrs) {
				product.getProductData().put(attr, (String) o[++i]);
			}
			products.add(product);
		}
		return new ResponseEntity<>(products, HttpStatus.OK);
	}
}
