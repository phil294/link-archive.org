package phil294.ls.api.model;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.validation.constraints.Min;
import javax.validation.constraints.Size;
import java.sql.Timestamp;

/**
 * User: phi
 * Date: 13.06.17
 * .  .___.
 * .  {o,o}
 * . /)___)
 * . --"-"--
 */
@Entity
@Table(name = "product_data")
public class ProductValue
{
	@Id
	@GeneratedValue
	private Integer id;
	@Min(1)
	private Integer product;
	@Min(1)
	private Integer attribute;
	private Integer user = null;
	@Size(min = 1, max = 255)
	private String value_string = null;
	private Integer value_number = null;
	private Timestamp submitted;
	private Integer interest;
	
	//////////////////////
	
	
	public Integer getId()
	{
		return id;
	}
	
	public void setId(Integer id)
	{
		this.id = id;
	}
	
	public Integer getProduct()
	{
		return product;
	}
	
	public void setProduct(Integer product)
	{
		this.product = product;
	}
	
	public Integer getAttribute()
	{
		return attribute;
	}
	
	public void setAttribute(Integer attribute)
	{
		this.attribute = attribute;
	}
	
	public Integer getUser()
	{
		return user;
	}
	
	public void setUser(Integer user)
	{
		this.user = user;
	}
	
	public String getValue_string()
	{
		return value_string;
	}
	
	public void setValue_string(String value_string)
	{
		this.value_string = value_string;
	}
	
	public Integer getValue_number()
	{
		return value_number;
	}
	
	public void setValue_number(Integer value_number)
	{
		this.value_number = value_number;
	}
	
	public Timestamp getSubmitted()
	{
		return submitted;
	}
	
	public void setSubmitted(Timestamp submitted)
	{
		this.submitted = submitted;
	}
	
	public Integer getInterest()
	{
		return interest;
	}
	
	public void setInterest(Integer interest)
	{
		this.interest = interest;
	}
}
