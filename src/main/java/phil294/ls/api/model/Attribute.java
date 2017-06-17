package phil294.ls.api.model;

import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.validation.constraints.Max;
import javax.validation.constraints.Min;
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
	@Min(1)
	private Integer user;
	@Size(min = 1, max = 64)
	private String name;
	@Size(min = 0, max = 255)
	private String description = "";
	@Min(1)
	private Integer interest = 1;
	@Size(min = 1, max = 64)
	private String unit = "";
	@Min(0) @Max(1)
	private AttributeType type;
	
	public String getUnit()
	{
		if(unit == null) {
			return "";
		}
		return unit;
	}
	
	//////////////////////////
	
	public AttributeType getType()
	{
		return type;
	}
	
	public void setType(AttributeType type)
	{
		this.type = type;
	}
	
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
	
	public void setUnit(String unit)
	{
		this.unit = unit;
	}
}
