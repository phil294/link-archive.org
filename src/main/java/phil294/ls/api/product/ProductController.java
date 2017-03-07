package phil294.ls.api.product;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import phil294.ls.api.model.Product;
import phil294.ls.api.model.ProductRepository;

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
	@GetMapping
	public ResponseEntity getIrgnedwas(
			//@RequestAttribute("userId") int userId
	)
	{
		Iterable<Product> products = productRepository.findAll();
		return new ResponseEntity<>(products, HttpStatus.OK);
	}
}
