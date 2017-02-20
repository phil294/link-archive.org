package phil294.ls.api.product;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

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
	@GetMapping
	public ResponseEntity<List<Integer>> getIrgnedwas(
			//@RequestAttribute("userId") long userId
	)
	{
		List<Integer> ret = new ArrayList<>();
		ret.add(2);
		ret.add(4);
		ret.add(6);
		return new ResponseEntity<>(ret, HttpStatus.OK);
	}
}
