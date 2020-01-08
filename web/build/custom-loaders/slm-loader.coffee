module.exports = (slmdoc) ->
	# Allow attributes without quotes syntax. E.g: input @click=my_method
	slmdoc = slmdoc.replace(///
		(?<=\s[a-zA-Z.@%#:_-]+=)	# [WS]%src=
		([^\s"]+)			# my_src				<- captured
		(?=\s|$)			# [WS]
	///g, '"$1"')			# Add quotes
	# Things to replace
	replaces = [
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
		# :style.some-prop="condition" to :style="{'some-prop':condition}" (same syntax as above but with style binding)
		[///
			(?<=		# before:
				\s			# whitespace
				:style		# :class
			)
			\.([\w-]+)	# .myprop
			="			# ="
			([^"]+)		# condition
			"			# "
			(?=\s)		# after: whitespace
		///g, '="{\'$1\':$2}"']
		# slot
		[/(?<=\S[\t ]+)#(.+)(?=\s)/g, 'v-slot:$1'] # this is in fact supported by vue itself natively already, but slm loader does not like it. so this one is more of a polyfill
	]
	for rule from replaces
		slmdoc = slmdoc.replace(rule[0], rule[1])

	slmdoc