package phil294.ls.api.product;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import phil294.ls.api.model.*;

/**
 * User: phi
 * Date: 19.02.17
 * .  .___.
 * .  {o,o}
 * . /)___)
 * . --"-"--
 */
@RestController
@RequestMapping("/product")
public class ProductController
{
	@Autowired
	private ProductRepository productRepository;
	@Autowired
	private AttributeRepository attributeRepository;
	@GetMapping
	public ResponseEntity<SearchResponse> search(
			//@RequestAttribute("userId") int userId
	        //@RequestParam("order") int orderId // .. .. ... . .. attributes criteria .. .. show attributes .. ..
	)
	{
		Iterable<Product> products = productRepository.findAll();
		Iterable<Attribute> attributes = attributeRepository.findAll();
		SearchResponse response = new SearchResponse(products, attributes);
		return new ResponseEntity<>(response, HttpStatus.OK);
	}
}
