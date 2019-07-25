module.exports = (coffeedoc) ->
	coffeedoc = coffeedoc
		### Allow single lambda parameter without quotes: Change "xyz: a -> ..." to "xyz: (a) -> ..." ###
		.replace(///
			(?<=					# before: either
				(?::\s)			|	# ": " or
				(?:=\s)			|	# "= " or
				\(				|	# "(" or
				(?:[a-zA-Z_]\s)	|	# "someword " or
				(?:,\s)			|	# ", " or
				(?:(?:-|=)>\s)		# "-> " or "=> "
			)
			(?<!(?:						# before: neither
				export|import|require
			)\ )
			([\w$@]+)		# $my_paramName@123
			(?=
				\ 			# space
				(-|=>)		# "->" or "=>"
			)
		///g, '($1)')

	# support yaml-like array syntax (https://github.com/jashkenas/coffeescript/issues/4952:TODO)
	while hasYamlsyntaxArray = coffeedoc.match(///
		([\w\W]*?)\n				# \1: anything before
			(						# \2: the array body
			(?:(\t+)				# \3: indent
			- \t.+\n				# an array element
					(?:\3\t\t
					.+\n)* 			# arbitrary nested stuff
			(?:\3\t
				.+\n				# still same element but next line, same indent like the "-" line: this element is an object and this line is another key
					(?:\3\t\t
					.+\n)* 			# arbitrary nested stuff
			)* 						# zero or more lines below the first "-" one
			)+) 					# one or more elements
		([\w\W]*) 					# \4: anything after
	///m)
		[_, before, arraybody, indent, after] = hasYamlsyntaxArray
		console.log arraybody
		arraybody_transformed = arraybody
			.replace(///^#{indent}-///, indent) # rm first -
			.replace(///^#{indent}-///gm, "#{indent},\n#{indent}") # change the other remaining - to ,
			.replace(/^\t/gm, '') # everything one less indent
		console.log "afteeeeeeeer"
		console.log "[\n#{arraybody_transformed}#{indent}]\n"
		coffeedoc = "#{before} [\n#{arraybody_transformed}#{indent}]\n#{after}"

	coffeedoc