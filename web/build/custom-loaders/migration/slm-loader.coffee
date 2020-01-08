module.exports = (slmdoc) ->
	# Things to replace
	replaces = [
		[/(?<=\s)if=("?)/g, 'v-if=$1']
		[/(?<=\s)html=("?)/g, ' v-html=$1']
		[/(?<=\s)else(?=\s)/g, 'v-else']
		[/else-if=("?)/g, 'v-else-if=$1']
		[/model=("?)/g, 'v-model=$1']
		[/drag=("?)/g, 'v-drag=$1']
		[/drop=("?)/g, 'v-drop=$1']
		# each=products translates to v-for="product in products"
		[/(?<=\s)each=?(\S+)(\s|$)/g, 'v-for="$1 in $1s"$2']
	]
	for rule from replaces
		slmdoc = slmdoc.replace(rule[0], rule[1])

	# Keywords that should allowed to be followed and preceded by whitespace without anything else. This has the potential to break plain text horribly
	standalone_keywords = [
		'v-else'
		'required'
		'disabled'
		'draggable'
		'contained'
		'onetime'
		'selected'
		'exact'
		'drag'
		'drop'
		'button_float_right'
		'v-slot:\\w+'
	]
	for keyword from standalone_keywords
		slmdoc = slmdoc.replace(new RegExp(
			'(?<=\\s)(' \	# [WS]
			+ keyword \		# The keyword		<- captured # todo coffee supports vars in regexes
			+ ')(?=\\s|$)'	# [WS]
		, 'g'), '$1=""')

	slmdoc