package phil294.ls.api.product;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import phil294.ls.api.model.*;

import java.util.Arrays;
import java.util.Map;
import java.util.Set;
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
		Map<Integer, String> filters = Arrays.stream(filterQ.split(","))
				.map(s -> s.split(":"))
				.collect(Collectors.toMap(s -> Integer.parseInt(s[0]), s -> s[1]));
		Map<Integer, SortingOrder> sorters = Arrays.stream(sortingQ.split(","))
				.map(s -> s.split(":"))
				.collect(Collectors.toMap(s -> Integer.parseInt(s[0]), s -> SortingOrder.values()[Integer.parseInt(s[1])]));
		Set<Integer> showers = Arrays.stream(sortingQ.split(","))
				.map(Integer::parseInt).collect(Collectors.toSet());
		
		Iterable<Product> products = productRepository.findAll();
		Iterable<Attribute> attributes = attributeRepository.findAll();
		SearchResponse response = new SearchResponse(products, attributes);
		return new ResponseEntity<>(response, HttpStatus.OK);
	}
}
