package phil294.ls.api.model;

import java.util.List;

/**
 * Tupel Produkte und AttributeOrder
 * User: phi
 * Date: 14.06.17
 * .  .___.
 * .  {o,o}
 * . /)___)
 * . --"-"--
 */
public class SearchResponse
{
	private List<Product> products;
	private List<Integer> attributeOrder;
	
	public List<Product> getProducts()
	{
		return products;
	}
	
	public void setProducts(List<Product> products)
	{
		this.products = products;
	}
	
	public List<Integer> getAttributeOrder()
	{
		return attributeOrder;
	}
	
	public void setAttributeOrder(List<Integer> attributeOrder)
	{
		this.attributeOrder = attributeOrder;
	}
	
	public SearchResponse(List<Product> products, List<Integer> attributeOrder)
	{
		this.products = products;
		this.attributeOrder = attributeOrder;
	}
}
