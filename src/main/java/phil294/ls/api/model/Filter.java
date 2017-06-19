package phil294.ls.api.model;

/**
 * Ein Filter definiert entweder einen zu suchenden Wert oder einen numerischen Suchbereich.
 * User: phi
 * Date: 14.06.17
 * .  .___.
 * .  {o,o}
 * . /)___)
 * . --"-"--
 */
public class Filter
{
	public String value = "";
	public String range_from = "";
	public String range_to = "";
	
	public Filter(String value, String range_from, String range_to)
	{
		this.value = value;
		this.range_from = range_from;
		this.range_to = range_to;
	}
}
