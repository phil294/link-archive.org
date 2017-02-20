package phil294.ls.api.profile;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import phil294.ls.api.model.User;
import phil294.ls.api.model.UserRepository;

/**
 * User: phi
 * Date: 20.02.17
 * .  .___.
 * .  {o,o}
 * . /)___)
 * . --"-"--
 * vorerst nur für auth tests
 */
@RestController
@RequestMapping("/profile")
public class ProfileController
{
	
	@Autowired private UserRepository userRepository;
	
	@GetMapping
	public ResponseEntity<String> getIrgnedwas(
			@RequestAttribute("userId") long userId)
	{
		User user = userRepository.findOne(userId);
		return new ResponseEntity<>("hi " + user.getName(), HttpStatus.OK);
	}
}
