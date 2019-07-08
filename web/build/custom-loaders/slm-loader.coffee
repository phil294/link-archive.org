module.exports = (slmdoc) ->
	# Allow inline comments: # followed by whitespace
	slmdoc = slmdoc.replace(/# .*/g, '')

	# Allow attributes without quotes syntax. E.g: input @click=my_method
	.replace(///
		(?<=\s[a-zA-Z.@%#:_-]+=)	# [WS]%src=
		([^\s"]+)			# my_src				<- captured
		(?=\s|$)			# [WS]
	///g, '"$1"')			# Add quotes
	# Things to replace
	replaces = [
		[/(?<=\s)if="/g, ' v-if="']
		[/(?<=\s)html="/g, ' v-html="']
		[/(?<=\s)else(?=\s)/g, 'v-else']
		[/else-if="/g, 'v-else-if="']
		[/model="/g, 'v-model="']
		[/drag="/g, 'v-drag="']
		[/drop="/g, 'v-drop="']
		# each=products translates to v-for="product in products"
		[/(?<=\s)each="(\S+)"/g, 'v-for="$1 in $1s"']
		# $blub to {{blub}}
		[///
			(?<=\s)				# before: whitespace
			\$					# dollar
			([\w.\[\]()$/="'+-]+)	# myVar_[0].$prop+12-5/7==="a"
		///g, '{{$1}}']
		# :class.myclass="condition" to :class="{'myclass':condition}"
		[///
			(?<=		# before:
				\s			# whitespace
				:class		# :class
			)
			\.([\w-]+)	# .myclass
			="			# ="
			([^"]+)		# condition
			"			# "
			(?=\s)		# after: whitespace
		///g, '="{\'$1\':$2}"']
		[/(?<=\s)#(.+)(?=\s)/g, 'v-slot:$1'] # this is in fact supported by vue itself natively already, but slm loader does not like it. so this one is more of a polyfill
	]
	for rule from replaces
		slmdoc = slmdoc.replace(rule[0], rule[1])

	# Keywords that should allowed to be followed and preceded by whitespace without anything else. This has the potential to break plain text horribly
	standalone_keywords = [
		'v-else'
		'required'
		'disabled'
		'draggable'
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
			+ keyword \		# The keyword		<- captured
			+ ')(?=\\s|$)'	# [WS]
		, 'g'), '$1=""')

	slmdoc