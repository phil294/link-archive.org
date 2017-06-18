package phil294.ls.api.product;

import com.mongodb.client.FindIterable;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import com.mongodb.client.model.Sorts;
import org.bson.Document;
import org.bson.conversions.Bson;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import phil294.ls.api.model.Filter;
import phil294.ls.api.model.MongoInstance;
import phil294.ls.api.model.SearchResponse;
import phil294.ls.api.model.User;

import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import static com.mongodb.client.model.Filters.*;

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
	)
	{
		// parse inputs into collections
		Map<Integer, Filter> filters = this.parseFilters(filterQ);
		Map<Integer, SortingOrder> sorters = this.parseSorters(sortingQ);
		Set<Integer> showers = this.parseShowers(showingQ);
		
		MongoDatabase db = MongoInstance.getDatabase();
		MongoCollection<Document> db_products = db.getCollection("products");
		
		// order matters: == view order on website: 1st sorters, 2nd showers, 3rd filters, 4th fillers
		Set<Integer> relevant_attrs_ids = Stream.concat(sorters.keySet().stream(), Stream.concat(showers.stream(), filters.keySet().stream()))
				.collect(Collectors.toCollection(LinkedHashSet::new));
		
		/*
		// COLUMNS: FILLERS
		int fillers_size = columns - relevant_attrs_ids.size();
		if(fillers_size > 0) {
			List<Integer> fillers = findByIdNotInOrderByInterestDesc(relevant_attrs_ids, fillers_size)
					.stream().map(Attribute::getId).collect(Collectors.toList());
			relevant_attrs_ids.addAll(fillers);
		}
		
		SELECT p.id,p.user,p.name,p.description,p.picture, values
			FROM ALL relevant_attrs_ids
*/
		
		// FILTERS
		List<Bson> db_filters = new ArrayList<>();
		for(Map.Entry<Integer, Filter> filterEntry : filters.entrySet()) {
			int filterAttr = filterEntry.getKey();
			Filter filter = filterEntry.getValue();
			if(filter.value.isEmpty()) {
				if(filter.range_from.isEmpty() || filter.range_to.isEmpty()) {
					throw new IllegalArgumentException("Invalid filter range.");
				}
				db_filters.add(and(
						gte("data." + filterAttr + ".value", Float.parseFloat(filter.range_from)), // may throw
						lte("data." + filterAttr + ".value", Float.parseFloat(filter.range_to))));
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
				db_filters.add(eq("data." + filterAttr + ".value", value));
			}
		}
		/*
		// SORTERS
		for(Map.Entry<Integer, SortingOrder> sorterEntry : sorters.entrySet()) {
			ORDER sorterEntry.getKey() BY sorterEntry.getValue()
		}
		// SHOWERS s. select relevant_attrs_ids
		// ROWS
		LIMIT rows;
		*/
		//criteria.add(new BasicDBObject("totalmarks", new BasicDBObject("$ne", 15)));
		
		
		FindIterable<Document> result = db_products.find(
				!db_filters.isEmpty() ? and(db_filters) : new Document()
		).sort(
				Sorts.ascending("data.4.value")
		);
		
		for(Document i : result) {
			System.out.println(i.toJson());
		}
		
		/*
		products = ;
		
		List<Integer> attributeOrder = new ArrayList<>();
		attributeOrder.addAll(relevant_attrs_ids); // todo
		
		SearchResponse response = new SearchResponse(products, attributeOrder);
		return new ResponseEntity<>(response, HttpStatus.OK);
		*/
		return null;
	}
}
