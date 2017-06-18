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
	@Autowired
	private ProductValueRepository productValueRepository;
	
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
	
	@PutMapping("/{productId}")
	public ResponseEntity<Product> updateProduct(
			@RequestAttribute("user") User user,
			@RequestBody @Valid Product input,
			@PathVariable("productId") Integer productId
	)
	{
		if( ! user.getAdmin()) {
			return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
		}
		Product product = new Product();
		product.setName(input.getName()); // todo duplicate code
		product.setDescription(input.getDescription());
		product.setPicture(input.getPicture());
		//product.setProductData(input.getProductData());
		
		product.setId(productId);
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
		if(newValue.isEmpty()) {
			throw new IllegalArgumentException("New value cannot be empty."); // (s. deleteProductValue)
		}
		Product product = productRepository.findOne(productId);
		Attribute attribute = attributeRepository.findOne(attributeId);
		if(product == null || attribute == null) {
			throw new IllegalArgumentException("Argument or product could not be found.");
		}
		ProductValue productValue;
		productValue = productValueRepository.findOneByProductAndAttribute(product.getId(), attribute.getId());
		if(productValue == null) {
			// new
			productValue = new ProductValue();
			productValue.setAttribute(attribute.getId());
			productValue.setProduct(product.getId());
			productValue.setUser(user.getId());
		} else {
			// existing, update. id is set.
		}
		if(attribute.getType() == AttributeType.NUMBER) {
			int value_number = Integer.parseInt(newValue); // may throw on invalid input
			productValue.setValue_number(value_number);
		} else {
			productValue.setValue_string(newValue);
		}
		//product.getProductData().put(attributeId, productValue);
		//productRepository.save(product);
		productValueRepository.save(productValue);
		return new ResponseEntity<>(product, HttpStatus.OK);
	}
	
	@DeleteMapping("/{productId}/attribute/{attributeId}")
	public ResponseEntity deleteProductValue(
			@RequestAttribute("user") User user,
			@PathVariable("productId") Integer productId,
			@PathVariable("attributeId") Integer attributeId
	)
	{
		if(!user.getAdmin()) {
			return new ResponseEntity<Product>(HttpStatus.UNAUTHORIZED);
		}
		ProductValue productValue = productValueRepository.findOneByProductAndAttribute(productId, attributeId);
		if(productValue == null) {
			throw new IllegalArgumentException("Product Value not found");
		}
		productValueRepository.delete(productValue);
		return new ResponseEntity(HttpStatus.OK);
	}
	
	@DeleteMapping("/{productId}")
	public ResponseEntity deleteProduct(
			@RequestAttribute("user") User user,
			@PathVariable("productId") Integer productId
	)
	{
		if( ! user.getAdmin()) {
			return new ResponseEntity<Product>(HttpStatus.UNAUTHORIZED);
		}
		productRepository.delete(productId);
		return new ResponseEntity(HttpStatus.OK);
	}
}
