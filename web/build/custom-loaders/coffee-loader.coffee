module.exports = (coffeedoc) ->
	return coffeedoc
		### Allow single lambda parameter without quotes: Change "xyz: a -> ..." to "xyz: (a) -> ..." ###
		.replace(///
			(?<=			# before: either
				(?::\s)	|	# ": " or
				(?:=\s)	|	# "= " or
				\(			# "("
			)
			([\w$@]+)		# $my_paramName@123
			\ 				# space
			(-|=>)			# "->" or "=>"
		///g, '($1) $2')
