package phil294.ls.api.model;

import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.*;
import javax.validation.constraints.Min;
import javax.validation.constraints.Size;
import java.sql.Timestamp;

/**
 * User: phi
 * Date: 07.03.17
 * .  .___.
 * .  {o,o}
 * . /)___)
 * . --"-"--
 */
@Table(name = "product_data")
@Entity
public class ProductValue
{
	@Id
	@GeneratedValue
	private Integer id;
	@Size(min = 1, max = 64) // todo sizes usw mit frontend abgleichen
	private String value; // todo datentyp
	@Column(insertable = false)
	private Timestamp submitted;
	@Min(1)
	private Integer interest = 1;
	
	@Min(1)
	private Integer attribute;
	
	@ManyToOne
	@JoinColumn(name = "product")
	@JsonIgnore
	private Product product;
	
	/////////////////
	
	
	public Integer getId()
	{
		return id;
	}
	
	public void setId(Integer id)
	{
		this.id = id;
	}
	
	public Product getProduct()
	{
		return product;
	}
	
	public void setProduct(Product product)
	{
		this.product = product;
	}
	
	public void setInterest(Integer interest)
	{
		this.interest = interest;
	}
	
	public Integer getAttribute()
	{
		return attribute;
	}
	
	public void setAttribute(Integer attribute)
	{
		this.attribute = attribute;
	}
	
	public String getValue()
	{
		return value;
	}
	
	public void setValue(String value)
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
	
	public int getInterest()
	{
		return interest;
	}
	
	public void setInterest(int interest)
	{
		this.interest = interest;
	}
}
