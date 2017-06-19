package phil294.ls.api.auth;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.servlet.handler.HandlerInterceptorAdapter;
import phil294.ls.api.model.User;
import phil294.ls.api.model.UserRepository;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * User: phi
 * Date: 17.02.17
 * .  .___.
 * .  {o,o}
 * . /)___)
 * . --"-"--
 */
public class AuthenticatorInterceptor extends HandlerInterceptorAdapter
{
	@Autowired private UserRepository userRepository;
	
	/**
	 * Authentificate with token, else deny access
	 * @param req
	 * @param resp
	 * @param handler
	 * @return
	 */
	@Override
	public boolean preHandle(
			HttpServletRequest req, HttpServletResponse resp, Object handler)
	{
		String auth = req.getHeader("Authorization");
		if(auth == null) {
			resp.setStatus(HttpStatus.UNAUTHORIZED.value());
			return false;
		}
		if(auth.length() < 7) {
			resp.setStatus(HttpStatus.UNAUTHORIZED.value());
			return false;
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
			return true;
		} else {
			resp.setStatus(HttpStatus.UNAUTHORIZED.value());
			return false;
		}
	}
}
