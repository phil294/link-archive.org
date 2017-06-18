package phil294.ls.api.attribute;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import phil294.ls.api.model.Attribute;
import phil294.ls.api.model.AttributeRepository;
import phil294.ls.api.model.Product;
import phil294.ls.api.model.User;

import javax.validation.Valid;

/**
 * User: phi
 * Date: 17.03.17
 * .  .___.
 * .  {o,o}
 * . /)___)
 * . --"-"--
 */
@RestController
@RequestMapping("/attribute")
public class AttributeController
{
	@Autowired
	private AttributeRepository attributeRepository;
	
	@GetMapping
	public ResponseEntity<Iterable<Attribute>> getAttributes(
			@RequestAttribute("user") User optionalUser
	)
	{
		return new ResponseEntity<>(attributeRepository.findAllByOrderByInterestDesc(), HttpStatus.OK);
	}
	
	///////////////////////////////////////////
	//////////////// ADMIN FUNCTIONS //////////
	///////////////////////////////////////////
	
	@PostMapping
	public ResponseEntity<Attribute> addAttribute(
			@RequestAttribute("user") User user,
			@RequestBody @Valid Attribute input
	)
	{
		if( ! user.getAdmin()) {
			return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
		}
		Attribute attribute = new Attribute();
		attribute.setDescription(input.getDescription());
		attribute.setName(input.getName());
		attribute.setUnit(input.getUnit());
		attribute.setType(input.getType());
		
		attribute.setUser(user.getId());
		attributeRepository.save(attribute);
		return new ResponseEntity<>(attribute, HttpStatus.OK);
	}
	
	@PutMapping("/{attributeId}")
	public ResponseEntity<Attribute> updateAttribute(
			@RequestAttribute("user") User user,
			@PathVariable("attributeId") Integer attributeId,
			@RequestBody @Valid Attribute input
	)
	{
		if( ! user.getAdmin()) {
			return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
		}
		Attribute attribute = new Attribute();
		attribute.setDescription(input.getDescription()); // todo duplicate code
		attribute.setName(input.getName());
		attribute.setUnit(input.getUnit());
		
		attribute.setId(attributeId);
		attribute.setUser(user.getId());
		attributeRepository.save(attribute);
		return new ResponseEntity<>(attribute, HttpStatus.OK);
	}
	
	@DeleteMapping("/{attributeId}")
	public ResponseEntity deleteAttribute(
			@RequestAttribute("user") User user,
			@PathVariable("attributeId") Integer attributeId
	)
	{
		if( ! user.getAdmin()) {
			return new ResponseEntity<Product>(HttpStatus.UNAUTHORIZED);
		}
		attributeRepository.delete(attributeId);
		return new ResponseEntity(HttpStatus.OK);
	}
}
