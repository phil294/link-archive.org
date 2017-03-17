package phil294.ls.api.model;

import javax.persistence.Column;
import javax.persistence.Embeddable;
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
@Embeddable
public class ProductValue
{
	@Size(min = 1, max = 64) // todo sizes usw mit frontend abgleichen
	private String value; // todo datentyp
	@Column(insertable = false)
	private Timestamp submitted;
	@Min(1)
	private Integer interest = 1;
	
	/////////////////
	
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
