package phil294.ls.api.product;

import org.springframework.beans.factory.annotation.Autowired;
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
	 * http://localhost:8080/search?filter=8:2,5:Coupe&sorting=7:1&show=14,17&limit=4&columns=8
	 */
	@GetMapping
	public ResponseEntity<SearchResponse> search(
			@RequestAttribute("user") User opionalUser,
			// search(filterAttributes: Map<number,string>, sortingAttributes: Map<number, SortingOrder>, showAttributes: Set<number>, limit: number, columns: number) {
			// 	return this.http.get(`/search?filter=${filterQ}&sorting=${sortingQ}&show=${showingQ}&limit=${limit}&columns=${columns}`)
			@RequestParam("filter") String filterQ,
			@RequestParam("sorting") String sortingQ,
			@RequestParam("show") String showingQ,
			@RequestParam("limit") int limit,
			@RequestParam("columns") int columns
	)
	{
		// parse inputs into collections
		Map<Integer, String> filters = Arrays.stream(filterQ.split(","))
				.map(s -> s.split(":"))
				.collect(Collectors.toMap(s -> Integer.parseInt(s[0]), s -> s[1]));
		Map<Integer, SortingOrder> sorters = Arrays.stream(sortingQ.split(","))
				.map(s -> s.split(":"))
				.collect(Collectors.toMap(s -> Integer.parseInt(s[0]), s -> SortingOrder.values()[Integer.parseInt(s[1])]));
		Set<Integer> showers = Arrays.stream(showingQ.split(","))
				.map(Integer::parseInt).collect(Collectors.toSet());
		
		// MAIN QUERY JPQL
		String queryString = "" +
				"SELECT * FROM ( " +
				// pivot
				"SELECT p.id,p.user,p.name,p.description,p.picture,";
		// all attributes in the pivot table, from which to filter & sort afterwards
		// order matters: == view order on website: 1st sorters, 2nd showers, 3rd filters
		Set<Integer> pivot_attrs = Stream.concat(sorters.keySet().stream(), Stream.concat(showers.stream(), filters.keySet().stream()))
				.collect(Collectors.toSet());
		Collection<String> pivot_snippets = new ArrayList<>();
		for(int attr : pivot_attrs) {
			pivot_snippets.add("MAX( CASE WHEN attribute = " + attr + " THEN value END ) as attr" + attr + " ");
		}
		queryString += String.join(", ", pivot_snippets);
		queryString += "" +
				"FROM products p INNER JOIN product_data pvs ON pvs.product = p.id " +
				"GROUP BY p.id " +
				") AS pivot " +
				"WHERE ";
		// select from pivot table: FILTERS
		List<String> filter_snippets = new ArrayList<>();
		int i = 0;
		for(int filterAttr : filters.keySet()) {
			filter_snippets.add("attr" + filterAttr + " = ?" + (++ i) + " "); // parameter placeholders
		}
		queryString += String.join(" AND ", filter_snippets);
		// SORTERS
		queryString += "ORDER BY ";
		for(Map.Entry<Integer, SortingOrder> sorterEntry : sorters.entrySet()) {
			queryString += "attr" + sorterEntry.getKey() + " " + sorterEntry.getValue().name() + " ";
		}
		// (SHOWERS): -> happens via pivot_attrs
		Query query = entityManager.createNativeQuery(queryString);
		i = 0;
		for(String filterValue : filters.values()) {
			query.setParameter(++ i, filterValue); // fill parameter placeholders
		}
		// get result
		List<Product> products = new ArrayList<>();
		List<Object> objs = query.getResultList();
		for(Object obj : objs) {
			Object[] o = (Object[]) obj;
			i = - 1; Product product = new Product();
			// product infos: ...SELECT p.id,p.user,p.name,p.description,p.picture
			product.setId((int) o[++ i]);
			product.setUser((int) o[++ i]);
			product.setName((String) o[++ i]);
			product.setDescription((String) o[++ i]);
			product.setPicture((String) o[++ i]);
			// product values
			for(int attr : pivot_attrs) {
				product.getProductData().put(attr, (String) o[++ i]);
			}
			products.add(product);
		}
		
		Iterable<Attribute> attributes = attributeRepository.findAll();
		SearchResponse response = new SearchResponse(products, attributes);
		return new ResponseEntity<>(response, HttpStatus.OK);
	}
}
