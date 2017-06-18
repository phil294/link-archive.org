package phil294.ls.api.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.bson.Document;

import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import java.io.Serializable;
import java.util.LinkedHashMap;
import java.util.Map;

/**
 * User: phi
 * Date: 07.03.17
 * .  .___.
 * .  {o,o}
 * . /)___)
 * . --"-"--
 */
public class Product implements Serializable // todo seri notw?
{
	@Id
	@GeneratedValue
	private String _id;
	@JsonIgnore
	private Integer user;
	private String name;
	private String description = "";
	private String picture;
	// fixme 20170612 interest
	private LinkedHashMap<Integer, ProductValue> productData = new LinkedHashMap<>(); // <attributeId, value> // jackson bug 20170618 todo: LinkedHashMap wird wie TreeMap serialisiert. Daher workaround mit attributeOrder in SearchResponse.....
	
	public static Product fromDocument(Document doc)
	{
		Product p = new Product();
		p.set_id(doc.getObjectId("_id").toHexString());
		p.setUser(doc.getInteger("user"));
		p.setName(doc.getString("name"));
		p.setDescription(doc.getString("description"));
		p.setPicture(doc.getString("picture"));
		Map<Integer, Object> map = (Map<Integer, Object>) doc.get("productData");
		for(Map.Entry<Integer, Object> entry : map.entrySet()) {
			Document dat = (Document) entry.getValue();
			ProductValue pv = new ProductValue();
			pv.setProduct(dat.getInteger("product"));
			pv.setAttribute(dat.getInteger("attribute"));
			pv.setValue(dat.get("value"));
			pv.setSubmitted(dat.getDate("submitted"));
			pv.setInterest(dat.getInteger("interest"));
			p.getProductData().put(entry.getKey(), pv);
		}
		
		return p;
	}
	
	///////////////////////////////
	
	
	public LinkedHashMap<Integer, ProductValue> getProductData()
	{
		return productData;
	}
	
	public void setProductData(LinkedHashMap<Integer, ProductValue> productData)
	{
		this.productData = productData;
	}
	
	public void setUser(Integer user)
	{
		this.user = user;
	}
	
	public String get_id()
	{
		return _id;
	}
	
	public void set_id(String _id)
	{
		this._id = _id;
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
