package phil294.ls.api.product;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import phil294.ls.api.model.AttributeRepository;
import phil294.ls.api.model.Product;
import phil294.ls.api.model.ProductRepository;
import phil294.ls.api.model.User;

import javax.validation.Valid;

/**
 * User: phi
 * Date: 10.03.17
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
	
	///////////////////////////////////////////
	//////////////// ADMIN FUNCTIONS //////////
	///////////////////////////////////////////
	
	@PostMapping
	public ResponseEntity<Product> addProduct(
			@RequestAttribute("user") User user,
			@RequestBody @Valid Product input
	)
	{
		if( ! user.getAdmin()) {
			return new ResponseEntity<Product>(HttpStatus.UNAUTHORIZED);
		}
		Product product = new Product();
		product.setName(input.getName());
		product.setDescription(input.getDescription());
		product.setPicture(input.getPicture());
		
		product.setUser(user.getId());
		productRepository.save(product);
		return new ResponseEntity<>(product, HttpStatus.OK);
	}
	
	@PutMapping
	public ResponseEntity<Product> updateProduct(
			@RequestAttribute("user") User user,
			@RequestBody @Valid Product input
	)
	{
		if( ! user.getAdmin()) {
			return new ResponseEntity<Product>(HttpStatus.UNAUTHORIZED);
		}
		Product product = new Product();
		product.setName(input.getName()); // todo duplicate code
		product.setDescription(input.getDescription());
		product.setPicture(input.getPicture());
		product.setId(input.getId());
		
		product.setUser(user.getId());
		productRepository.save(product);
		return new ResponseEntity<>(product, HttpStatus.OK);
	}
	/*
	@PutMapping("/{productId}/attribute/{attributeId}")
	public ResponseEntity<Product> updateProductValue(
			@RequestAttribute("user") User user,
			@PathParam("productId") int productId,
			@PathParam("attributeId") int attributeId,
			@RequestBody String newValue
	)
	{
		if( ! user.getAdmin()) {
			return new ResponseEntity<Product>(HttpStatus.UNAUTHORIZED);
		}
		productRepository.save(product);
		return new ResponseEntity<>(product, HttpStatus.OK);
	}
	*/
}
