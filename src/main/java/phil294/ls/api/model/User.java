package phil294.ls.api.model;

import javax.persistence.*;
import java.io.Serializable;

/**
 * User: phi
 * Date: 18.02.17
 * .  .___.
 * .  {o,o}
 * . /)___)
 * . --"-"--
 */
@Entity
@Table(name = "users")
public class User implements Serializable
{
	
	public static final long ADMIN_ID = 1;
	
	@Id
	@GeneratedValue
	private Long id;
	private String name;
	private String password;
	@Transient // /@JsonIgnore todo ?
	private String token;
	
	protected User()
	{
	} // JPA // todo
	
	public User(long id)
	{ // todo
		this.id = id;
	}
	
	///////////////////////////
	
	
	public String getPassword()
	{
		return password;
	}
	
	public void setPassword(String password)
	{
		this.password = password;
	}
	
	public long getId()
	{
		return id;
	}
	
	public void setId(Long id)
	{
		this.id = id;
	}
	
	public void setId(long id)
	{
		this.id = id;
	}
	
	public String getToken()
	{
		return token;
	}
	
	public void setToken(String token)
	{
		this.token = token;
	}
	
	public String getName()
	{
		return name;
	}
	
	public void setName(String name)
	{
		this.name = name;
	}
	
}
