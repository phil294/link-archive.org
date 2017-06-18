package phil294.ls.api.model;

import java.sql.Timestamp;

/**
 * User: phi
 * Date: 13.06.17
 * .  .___.
 * .  {o,o}
 * . /)___)
 * . --"-"--
 */
public class ProductValue
{
	private String id;
	private Integer product;
	private Integer attribute;
	private Integer user = null;
	private Object value = null;
	private Timestamp submitted;
	private Integer interest;
	
	public ProductValue()
	{/*mongoKeep*/}
	
	//////////////////////
	
	
	public String getId()
	{
		return id;
	}
	
	public void setId(String id)
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
	
	public Object getValue()
	{
		return value;
	}
	
	public void setValue(Object value)
	{
		this.value = value;
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
