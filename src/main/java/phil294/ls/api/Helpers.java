package phil294.ls.api;

import java.io.UnsupportedEncodingException;
import java.math.BigInteger;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

/**
 * User: phi
 * Date: 17.02.17
 * .  .___.
 * .  {o,o}
 * . /)___)
 * . --"-"--
 */
public class Helpers
{
	public static String md5(String s)
	{
		if(s.isEmpty()) {
			return "";
		}
		byte[] b;
		try {
			b = s.getBytes("UTF-8");
		} catch(UnsupportedEncodingException e) {
			e.printStackTrace();
			return "";
		}
		MessageDigest md;
		try {
			md = MessageDigest.getInstance("MD5");
		} catch(NoSuchAlgorithmException e) {
			e.printStackTrace();
			return "";
		}
		byte[] d = md.digest(b);
		BigInteger bigInt = new BigInteger(1, d);
		String md5 = bigInt.toString(16);
		while(md5.length() < 32) {
			md5 = "0" + md5;
		}
		return md5;
	}
}
