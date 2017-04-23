package phil294.ls.api.auth;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.servlet.handler.HandlerInterceptorAdapter;
import phil294.ls.api.model.User;
import phil294.ls.api.model.UserRepository;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * User: phi
 * Date: 10.03.2017
 * .  .___.
 * .  {o,o}
 * . /)___)
 * . --"-"--
 */
public class OptionalAuthenticationInterceptor extends HandlerInterceptorAdapter
{
	@Autowired
	private UserRepository userRepository;
	
	@Override
	public boolean preHandle(
			HttpServletRequest req, HttpServletResponse resp, Object handler)
	{
		String auth = req.getHeader("Authorization"); // todo duplicate code
		if(auth == null) {
			req.setAttribute("user", new User());
			return true;
		}
		if(auth.length() < 7) {
			req.setAttribute("user", new User());
			return true;
		}
		String bearer = auth.substring(7);
		int id = - 1;
		try {
			id = JWT.getId(bearer);
		} catch(Exception e) {
			id = - 1;
		}
		if(id > 0) {
			User user = userRepository.findOne(id);
			req.setAttribute("user", user);
		} else {
			req.setAttribute("user", new User());
		}
		return true;
	}
}
