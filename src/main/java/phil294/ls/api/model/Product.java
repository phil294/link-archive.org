package phil294.ls.api.model;

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
public class Product implements Serializable // toto seri notw?
{
	@Id
	@GeneratedValue
	private String id;
	private Integer user;
	private String name;
	private String description = "";
	private String picture;
	
	private LinkedHashMap<Integer, ProductValue> productData = new LinkedHashMap<>(); // <attributeId, value> // 20170618 todo jackson bug : LinkedHashMap wird wie TreeMap serialisiert. Daher workaround mit attributeOrder in SearchResponse.....
	
	/**
	 * Parse Product -> BSON Document für MongoDB Weiterverwendung
	 * @param doc
	 * @return Product
	 */
	public static Product fromDocument(Document doc)
	{
		Product p = new Product();
		p.setId(doc.getObjectId("_id").toHexString());
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
	
	/**
	 * Parse BSON-Document -> Product für POJO-Weiterverarbeitung von MongoDB-Dokumenten
	 * @param p
	 * @return
	 */
	public static Document toDocument(Product p)
	{
		Document d = new Document();
		if(p.getId() != null) { // mongo generates automatically
			// d.put("_id", p.getId());
		}
		d.put("user", p.getUser());
		d.put("name", p.getName());
		d.put("description", p.getDescription());
		d.put("picture", p.getPicture());
		Document dataDoc = new Document();
		
		d.put("productData", p.getProductData());
		
		return d;
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
	
	public String getId()
	{
		return id;
	}
	
	public void setId(String id)
	{
		this.id = id;
	}
	
	public Integer getUser()
	{
		return user;
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
