package phil294.ls.api.model;

import javax.persistence.Column;
import javax.persistence.Embeddable;
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
	private String value;
	@Column(insertable = false)
	private Timestamp submitted;
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
