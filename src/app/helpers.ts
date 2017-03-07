/**
 * User: phi
 *  .___.
 *  {o,o}
 * /)___)
 * --"-"--
 */

export function empty(v) {
	let type = typeof v;
	if (type === 'undefined')
		return true;
	if (type === 'boolean')
		return false;
	if (v === null)
		return true;
	if (v == undefined)
		return true;
	if (v instanceof Array) {
		if (v.length < 1)
			return true;
	}
	else if (type === 'string') {
		if (v.length < 1)
			return true;
		else if (parseInt(v) === 0)
			return true;
	}
	else if (type === 'object') {
		if (Object.keys(v).length < 1)
			return true;
	}
	else if (type === 'number') {
		return false;
	}
	return false;
}