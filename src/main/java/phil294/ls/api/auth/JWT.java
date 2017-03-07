package phil294.ls.api.auth;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;

import javax.crypto.spec.SecretKeySpec;
import javax.xml.bind.DatatypeConverter;
import java.security.Key;
import java.util.HashMap;
import java.util.Map;

/**
 * User: phi
 * Date: 17.02.17
 * .  .___.
 * .  {o,o}
 * . /)___)
 * . --"-"--
 */
public class JWT
{
	private static Key getSecretKey()
	{
		byte[] apiKeySecretBytes = DatatypeConverter.parseBase64Binary(
				"3GTNWUZZZo63N67jjj64rh6r6drrQ'QBwdrfi98h!?3494T8U398Gl"
		);
		Key key = new SecretKeySpec(apiKeySecretBytes, SignatureAlgorithm.HS512.getJcaName());
		return key;
	}
	
	public static String create(long id)
	{
		
		Map<String, Object> claims = new HashMap<>();
		claims.put("id", id);
		
		String compactJws = Jwts.builder()
				.setClaims(claims)
				.signWith(
						SignatureAlgorithm.HS512,
						getSecretKey())
				.compact();
		return compactJws;
	}
	
	public static long getId(String compactJws) throws Exception
	{ // throws: make unchecked checked
		Jws<Claims> claims = Jwts.parser()
				.setSigningKey(getSecretKey())
				.parseClaimsJws(compactJws);
		
		long id = Long.parseLong(claims.getBody().get("id").toString());
		return id;
	}
}
