package phil294.ls.api.login;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import phil294.ls.api.Helpers;
import phil294.ls.api.auth.JWT;
import phil294.ls.api.model.User;
import phil294.ls.api.model.UserRepository;

import java.io.UnsupportedEncodingException;
import java.security.NoSuchAlgorithmException;

/**
 * User: phi
 * Date: 18.02.17
 * .  .___.
 * .  {o,o}
 * . /)___)
 * . --"-"--
 */
@RestController
public class LoginController
{
	
	@Autowired
	private UserRepository userRepository;
	
	@PostMapping("/login")
	public ResponseEntity<User> login(
			@RequestBody User user
	) throws UnsupportedEncodingException, NoSuchAlgorithmException
	{
		
		User actualUser = userRepository.findByNameAndPassword(
				user.getName(),
				Helpers.md5(user.getPassword()));  //fixme md5
		if(actualUser == null) {
			return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
		}
		String token = JWT.create(actualUser.getId());
		actualUser.setToken(token);
		return new ResponseEntity<>(actualUser, HttpStatus.OK);
	}
}
