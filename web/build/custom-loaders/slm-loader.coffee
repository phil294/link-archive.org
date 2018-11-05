slm = require('slm')

module.exports = (slmdoc) ->
	slm.compile(slmdoc
		# Allow inline comments: # followed by whitespace
		.replace(/# .*/g, '')
		# Allow attributes without quotes syntax. E.g: input @click=myMethod
		.replace(///
			(?<=\s[a-z.@%:-]+=)	# [WS]%src=
			([^\s"]+)			# mySrc				<- captured
			(?=\s|$)			# [WS]
		///g, '"$1"')			# Add quotes
		# Allow alternative syntax for event handlers: %click="myMethod" translates to @click="myMethod"
		.replace(///
			(?<=\s)				# [WS]
			%					# %					<- captured
			(?=[a-z.-]+=		# src=
			"[^"]+"				# "mySrc"
			\s|$)				# [WS]
		///g, '@')				# Replace with @
		# Allow alternative syntax for property binding: -src="mySrc" translates to :src="mySrc"
		.replace(///
			(?<=\s)
			-
			(?=[a-z.-]+=
			"[^"]+"
			\s|$)
		///g, ':')
		# Allow alternative syntax for v-model: model="myVar" translates to v-model="myVar"
		.replace(///
			(?<=\s)				# [WS]
			model				# model			<- captured
			(?=="[^"]+"			# ="myVar"
			\s|$)				# [WS]
		///g, 'v-model')		# Replace with v-model
		# Allow alternative syntax for v-if: if="myVar" translates to v-if="myVar"
		.replace(///
			(?<=\s)
			if
			(?=="[^"]+"
			\s|$)
		///g, 'v-if')
		# Allow standalone keywords to work without value assignment. To be extended. E.g.: div v-else hello
		.replace(///
			(?<=\s)(			# [WS]
			v-else		|		# The keywords...	<- captured
			required	|		# ...
			disabled
			)(?=\s|$)			# [WS]
		///g, '$1=""')			# Add =""
	)()
