package phil294.ls.api.model;

import com.fasterxml.jackson.annotation.JsonValue;

/**
 * User: phi
 * Date: 17.06.17
 * .  .___.
 * .  {o,o}
 * . /)___)
 * . --"-"--
 */
public enum AttributeType
{
	NUMBER,
	STRING;
	
	@JsonValue
	public int toValue()
	{
		// jackson: serialize as int (same enum in frontend)
		return ordinal();
	}
}
