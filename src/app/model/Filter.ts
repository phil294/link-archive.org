import {val} from "../helpers";
/**
 * User: phi
 * Date: 14.06.17
 * .  .___.
 * .  {o,o}
 * . /)___)
 * . --"-"--
 */
export class Filter
{
	value: any = "";
	range_from: any = "";
	range_to: any = "";

	/**
	 * angular 4 input doesnt have min/max support yet. this is a workaround. todo
	 */
	valid() {
		return (val(this.value) || (val(this.range_from) && val(this.range_to)))
			&& this.range_from <= this.range_to;
	}
}