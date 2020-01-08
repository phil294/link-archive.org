module.exports = (coffeedoc) ->
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
		arraybody_transformed = arraybody
			.replace(///^#{indent}-///, indent) # rm first -
			.replace(///^#{indent}-///gm, "#{indent},\n#{indent}") # change the other remaining - to ,
			.replace(/^\t/gm, '') # everything one less indent
		coffeedoc = "#{before} [\n#{arraybody_transformed}#{indent}]\n#{after}"

	coffeedoc