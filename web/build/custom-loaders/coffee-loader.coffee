module.exports = (coffeedoc) ->
	coffeedoc = coffeedoc
		### Allow single lambda parameter without quotes: Change "xyz: a -> ..." to "xyz: (a) -> ..." ###
		.replace(///
			(?<=					# before: either
				(?::\s)			|	# ": " or
				(?:=\s)			|	# "= " or
				\(				|	# "(" or
				(?:,\s)			|	# ", " or
				(?:(?:-|=)>\s)		# "-> " or "=> "
			)
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
			-						# an array element
				\t
				.+\n				# till end of line
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
		arraybody_transformed = arraybody
			.replace(/^\t/gm, '') # one less indent
		arraybody_transformed = arraybody_transformed
			.replace(/^(\t*)-/, '$1') # rm first -
		arraybody_transformed = arraybody_transformed
			.replace(/^(\t*)-/gm, '$1,\n$1') # change remaining - to ,
		coffeedoc = "#{before} [\n#{arraybody_transformed}#{indent}]\n#{after}"

	coffeedoc