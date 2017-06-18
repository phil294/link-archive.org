package phil294.ls.api.product;

import com.mongodb.client.FindIterable;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.model.Sorts;
import org.bson.Document;
import org.bson.conversions.Bson;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import phil294.ls.api.model.*;

import java.io.IOException;
import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import static com.mongodb.client.model.Filters.*;
import static com.mongodb.client.model.Projections.fields;
import static com.mongodb.client.model.Projections.include;

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
	@Autowired
	AttributeRepository attributeRepository;
	
	private enum SortingOrder
	{
		ASC,
		DESC
	}
	
	private Map<Integer, Filter> parseFilters(String filterQ)
	{
		return filterQ.isEmpty() ? new HashMap<>() :
				Arrays.stream(filterQ.split(",")) // 8:_3_7,11:3__
						.map(s -> s.split(":"))
						.collect(Collectors.toMap(
								s -> Integer.valueOf(s[0]), // filter attribute id
								s -> { // _y_z (value) or x__ (range)
									String[] conditions = s[1].split("_", -1);
									return new Filter(conditions[0], conditions[1], conditions[2]);
								}));
	}
	
	private Map<Integer, SortingOrder> parseSorters(String sortingQ)
	{
		return sortingQ.isEmpty() ? new LinkedHashMap<>() :
				Arrays.stream(sortingQ.split(",")) // 9:0,10:0,11:1
						.map(s -> s.split(":"))
						.collect(Collectors.toMap(
								s -> Integer.parseInt(s[0]),
								s -> SortingOrder.values()[Integer.parseInt(s[1])],
								(v1, v2) -> v1,
								LinkedHashMap::new));
	}
	
	private Set<Integer> parseShowers(String showingQ)
	{
		return showingQ.isEmpty() ? new LinkedHashSet<>() :
				Arrays.stream(showingQ.split(",")) // 5,7,2
						.map(Integer::parseInt)
						.collect(Collectors.toCollection(LinkedHashSet::new));
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
	) throws IOException
	{
		// parse inputs into collections
		Map<Integer, Filter> filters = this.parseFilters(filterQ);
		Map<Integer, SortingOrder> sorters = this.parseSorters(sortingQ);
		Set<Integer> showers = this.parseShowers(showingQ);
		
		MongoCollection<Document> db_products = MongoInstance.getProductCollection();
		
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
		
		// FILTERS
		List<Bson> db_filters = new ArrayList<>();
		for(Map.Entry<Integer, Filter> filterEntry : filters.entrySet()) {
			int filterAttr = filterEntry.getKey();
			Filter filter = filterEntry.getValue();
			if(filter.value.isEmpty()) {
				if(filter.range_from.isEmpty() || filter.range_to.isEmpty()) {
					throw new IllegalArgumentException("Invalid filter range.");
				}
				// range filter: BETWEEEN
				db_filters.add(and(
						gte("productData." + filterAttr + ".value", Float.parseFloat(filter.range_from)), // may throw
						lte("productData." + filterAttr + ".value", Float.parseFloat(filter.range_to))));
			} else {
				// value filter: WHERE =
				Object value;
				try {
					// try number
					value = Float.parseFloat(filter.value);
				} catch(NumberFormatException nfe) {
					// else string
					value = value = filter.value;
				}
				db_filters.add(
						eq("productData." + filterAttr + ".value", value)
				);
			}
		}
		
		// SORTERS
		List<Bson> db_sorters = new ArrayList<>();
		for(Map.Entry<Integer, SortingOrder> sorterEntry : sorters.entrySet()) {
			int sorterAttr = sorterEntry.getKey();
			SortingOrder order = sorterEntry.getValue();
			// ORDER BY
			Bson db_order;
			if(order == SortingOrder.DESC) {
				db_order = Sorts.descending("productData." + sorterAttr + ".value");
			} else {
				db_order = Sorts.ascending("productData." + sorterAttr + ".value");
			}
			db_sorters.add(
					db_order
			);
		}
		
		// SHOWERS
		List<String> db_showers = new ArrayList<>();
		db_showers.addAll(Arrays.asList("name", "description", "picture"));
		for(int attr : relevant_attrs_ids) {
			db_showers.add("productData." + attr);
		} ;
		
		// QUERY
		FindIterable<Document> result = db_products.find(
				!db_filters.isEmpty() ? and(db_filters) : new Document()
		).sort(
				!sorters.isEmpty() ? and(db_sorters) : new Document()
		).projection(fields(
				include(db_showers)
		)).limit(
				rows
		);
		
		List<Product> products = new ArrayList<>();
		for(Document doc : result) {
			//Product product = gson.fromJson(doc.toJson(), Product.class); // gson
			// Product product = mapper.readValue(doc.toJson(), Product.class); // jackson objectmapper class
			Product product = Product.fromDocument(doc);
			products.add(product);
		}
		
		List<Integer> attributeOrder = new ArrayList<>();
		attributeOrder.addAll(relevant_attrs_ids);
		
		SearchResponse response = new SearchResponse(products, attributeOrder);
		return new ResponseEntity<>(response, HttpStatus.OK);
	}
}
