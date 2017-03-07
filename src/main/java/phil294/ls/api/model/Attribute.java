package phil294.ls.api.model;

import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.validation.constraints.Size;

/**
 * User: phi
 * Date: 07.03.17
 * .  .___.
 * .  {o,o}
 * . /)___)
 * . --"-"--
 */
@Entity
@Table(name="attributes")
public class Attribute
{
	@Id
	@GeneratedValue
	private Integer id;
	@JsonIgnore // geht enduser nichts an
	@Size(min = 1, max = 64)
	private Integer user;
	@Size(min = 1, max = 64)
	private String name;
	@Size(min = 1, max = 255)
	private String description;
	private Integer interest;
	@Size(min = 1, max = 64)
	private String unit;
	
	//////////////////////////
	
	public Integer getId()
	{
		return id;
	}
	
	public void setId(Integer id)
	{
		this.id = id;
	}
	
	public Integer getUser()
	{
		return user;
	}
	
	public void setUser(Integer user)
	{
		this.user = user;
	}
	
	public String getName()
	{
		return name;
	}
	
	public void setName(String name)
	{
		this.name = name;
	}
	
	public String getDescription()
	{
		return description;
	}
	
	public void setDescription(String description)
	{
		this.description = description;
	}
	
	public Integer getInterest()
	{
		return interest;
	}
	
	public void setInterest(Integer interest)
	{
		this.interest = interest;
	}
	
	public String getUnit()
	{
		return unit;
	}
	
	public void setUnit(String unit)
	{
		this.unit = unit;
	}
}
