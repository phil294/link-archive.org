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
				(?:(?:-|=)>\s)	|	# "-> " or "=> " or
				(?:return\s)		# "return "
			)
			(?<!(?:						# before: neither
				export|import|require
			)\ )
			([\w$@]+)		# $my_paramName@123
			(?=
				\ 			# space
				(->|=>)		# "->" or "=>"
			)
		///g, '($1)')

	coffeedoc