slm = require('slm')

# Things to replace
replaces = [
	[/(?<=\s)if="/g, ' v-if="']
	[/else="/g, 'v-else="']
	[/else-if="/g, 'v-else-if="']
	[/model="/g, 'v-model="']
	# Allow alternative syntax for event handlers: %click="myMethod" translates to @click="myMethod"
	[/(?<=\s)%(?=[a-z.-]+=")/g, '@']
	# Allow alternative syntax for property binding: -src="mySrc" translates to :src="mySrc". Tactical syntax highlighting error fixing quote: "
	[/(?<=\s)-(?=[a-z.-]+=")/g, ':']
]

# Keywords that should allowed to be followed and preceded by whitespace without anything else. This has the potential to break plain text horribly
standaloneKeywords = [
	'v-else'
	'required'
	'disabled'
	'draggable'
	'selected'
	'exact'
]

module.exports = (slmdoc) ->
	# Allow inline comments: # followed by whitespace
	slmdoc = slmdoc.replace(/# .*/g, '')
	
	# Allow attributes without quotes syntax. E.g: input @click=myMethod
	.replace(///
		(?<=\s[a-z.@%:-]+=)	# [WS]%src=
		([^\s"]+)			# mySrc				<- captured
		(?=\s|$)			# [WS]
	///g, '"$1"')			# Add quotes
	
	# All replace rules
	for rule from replaces
		slmdoc = slmdoc.replace(rule[0], rule[1])

	# All standalone keywords
	for keyword from standaloneKeywords
		slmdoc = slmdoc.replace(new RegExp(
			'(?<=\\s)(' \	# [WS]
			+ keyword \		# The keyword		<- captured
			+ ')(?=\\s|$)'	# [WS]
		, 'g'), '$1=""')
	
	# Should now be pure coffee
	return slm.compile(slmdoc)()
