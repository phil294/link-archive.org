/**
 * @return false when no "value" found or the value itself otherwise. Similar to PHPs empty() function.
 * User: phi
 *  .___.
 *  {o,o}
 * /)___)
 * --"-"--
 */
export function val(v) {
	let type = typeof v;
	if (type === 'undefined')
		return false;
	if (type === 'boolean')
		return v;
	if (v === null)
		return false;
	if (v == undefined)
		return false;
	if (v instanceof Array) {
		if (v.length < 1)
			return false;
	}
	else if (type === 'string') {
		if (v.length < 1)
			return false;
		//else if (parseInt(v) === 0)
		//	return false;
	}
	else if (type === 'object') {
		if (Object.keys(v).length < 1)
			return false;
	}
	else if (type === 'number') {
		//return v;
		return "" + v; // todo wenn 0 sonst returns false..
	}
	return v;
}