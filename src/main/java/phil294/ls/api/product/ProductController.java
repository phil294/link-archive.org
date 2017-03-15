package phil294.ls.api.product;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import phil294.ls.api.model.*;

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
			return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
		}
		Product product = new Product();
		product.setName(input.getName()); // todo duplicate code
		product.setDescription(input.getDescription());
		product.setPicture(input.getPicture());
		product.setId(input.getId());
		product.setProductData(input.getProductData());
		
		product.setUser(user.getId());
		productRepository.save(product);
		return new ResponseEntity<>(product, HttpStatus.OK);
	}
	
	@PutMapping("/{productId}/attribute/{attributeId}") // notwendig weil nicht komplettes objekt übergeben da attributmenge lückenhaft und evlt sehr groß <-- widerspricht rest todo konflikt
	public ResponseEntity<Product> updateProductValue(
			@RequestAttribute("user") User user,
			@PathVariable("productId") Integer productId,
			@PathVariable("attributeId") Integer attributeId,
			@RequestBody String newValue
	)
	{
		if( ! user.getAdmin()) {
			return new ResponseEntity<Product>(HttpStatus.UNAUTHORIZED);
		}
		Product product = productRepository.findOne(productId);
		ProductValue productValue = new ProductValue();
		productValue.setValue(newValue);
		product.getProductData().put(attributeId, productValue);
		productRepository.save(product);
		return new ResponseEntity<>(product, HttpStatus.OK);
	}
}
