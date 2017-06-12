package phil294.ls.api.model;

import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.*;
import javax.validation.constraints.Min;
import javax.validation.constraints.Size;
import java.io.Serializable;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * User: phi
 * Date: 07.03.17
 * .  .___.
 * .  {o,o}
 * . /)___)
 * . --"-"--
 */
@Entity
@Table(name="products")
public class Product implements Serializable // todo seri notw?
{
	@Id
	@GeneratedValue
	private Integer id;
	@JsonIgnore // geht den endnutzer nichts an
	@Min(1)
	private Integer user;
	@Size(min = 1, max = 64)
	private String name;
	@Size(min = 0, max = 255)
	private String description = "";
	@Size(min = 1, max = 64)
	private String picture;
	
	// a nice readable map
	@Transient
	private Map<Integer, ProductValue> productData = new HashMap<>(); // <attributeId, prodDat>
	
	// "all" values for joining (?todo)
	@OneToMany(mappedBy = "product")
	@JsonIgnore
	private List<ProductValue> productValueList;
	
	///////////////////////////////
	
	public Map<Integer, ProductValue> getProductData()
	{
		return productData;
	}
	
	public void setProductData(Map<Integer, ProductValue> productData)
	{
		this.productData = productData;
	}
	
	public List<ProductValue> getProductValueList()
	{
		return productValueList;
	}
	
	public void setProductValueList(List<ProductValue> productValueList)
	{
		this.productValueList = productValueList;
	}
	
	public void setUser(Integer user)
	{
		this.user = user;
	}
	
	public Integer getId()
	{
		return id;
	}
	
	public void setId(Integer id)
	{
		this.id = id;
	}
	
	public int getUser()
	{
		return user;
	}
	
	public void setUser(int user)
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
	
	public String getPicture()
	{
		return picture;
	}
	
	public void setPicture(String picture)
	{
		this.picture = picture;
	}
}
