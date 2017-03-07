package phil294.ls.api.model;

/**
 * User: phi
 * Date: 07.03.17
 * .  .___.
 * .  {o,o}
 * . /)___)
 * . --"-"--
 */
public class SearchResponse
{
	public Iterable<Product> products;
	public Iterable<Attribute> attributes;
	
	public SearchResponse(Iterable<Product> products, Iterable<Attribute> attributes)
	{
		this.products = products;
		this.attributes = attributes;
	}
}
