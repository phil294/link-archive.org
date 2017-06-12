package phil294.ls.api.product;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import phil294.ls.api.model.*;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.TypedQuery;
import java.util.*;
import java.util.stream.Collectors;

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
		String queryString = "SELECT p from Product p join p.productValueList pvs " +
				" where ";
		// FILTERS
		// where conditions ors
		List<String> conditions = new ArrayList<>();
		int i = 0;
		for(int k = 0; k < filters.size(); k++) {
			conditions.add(" (pvs.attribute = ?" + (++ i) + " and pvs.value = ?" + (++ i) + ") "); // parameter placeholders
		}
		String or_conditions = String.join(" or ", conditions); // .. OR ... OR ..
		queryString += or_conditions;
		// having count = filters.size() ^= must have all conditions
		queryString += " group by p.id having count(*) = " + filters.size();
		// make query
		TypedQuery<Product> query = entityManager.createQuery(queryString, Product.class);
		// filters: set params
		i = 0;
		for(Map.Entry<Integer, String> filterEntry : filters.entrySet()) {
			query.setParameter(++ i, filterEntry.getKey()); // fill parameter placeholders
			query.setParameter(++ i, filterEntry.getValue());
		}
		/*
		SELECT p from Product p join p.productValueList pvs  where  (pvs.attribute = ?1 and pvs.value = ?2)  or  (pvs.attribute = ?3 and pvs.value = ?4)  group by p.id having count(*) = 2
		
SELECT p from products p inner join product_data pvs on pvs.product = p.id
where
	(pvs.attribute = 8 and pvs.value = "2") OR
	(pvs.attribute = 5 and pvs.value = "Coupe")
group by p.id having count(*) = 2
		 */
		// get result
		List<Product> results = query.getResultList();
		
		Iterable<Product> products = productRepository.findAll();
		Iterable<Attribute> attributes = attributeRepository.findAll();
		SearchResponse response = new SearchResponse(products, attributes);
		return new ResponseEntity<>(response, HttpStatus.OK);
	}
}
