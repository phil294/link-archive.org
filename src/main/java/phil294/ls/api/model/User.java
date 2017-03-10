package phil294.ls.api.model;

import javax.persistence.*;
import javax.validation.constraints.Size;
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
	@Id
	@GeneratedValue
	private Integer id;
	@Size(min = 1, max = 64)
	private String name;
	@Size(min = 1, max = 64)
	private String password;
	@Transient // /@JsonIgnore todo ?
	private String token;
	private Boolean admin = false;
	
	public User()
	{
	} // JPA // todo
	
	public User(int id)
	{ // todo
		this.id = id;
	}
	
	///////////////////////////
	
	
	public Boolean getAdmin()
	{
		return admin;
	}
	
	public void setAdmin(Boolean admin)
	{
		this.admin = admin;
	}
	
	public String getPassword()
	{
		return password;
	}
	
	public void setPassword(String password)
	{
		this.password = password;
	}
	
	public int getId()
	{
		return id;
	}
	
	public void setId(int id)
	{
		this.id = id;
	}
	
	public void setId(Integer id)
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
