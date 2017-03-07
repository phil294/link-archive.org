package phil294.ls.api.auth;

import org.springframework.http.HttpStatus;
import org.springframework.web.servlet.handler.HandlerInterceptorAdapter;

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
	
	@Override
	public boolean preHandle(
			HttpServletRequest req, HttpServletResponse resp, Object handler)
	{
		String auth = req.getHeader("Authorization");
		if(auth == null) {
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
			req.setAttribute("userId", id);
			return true;
		} else {
			resp.setStatus(HttpStatus.UNAUTHORIZED.value());
			return false;
		}
	}
}
