htmlElements = [
	'table', 'thead', 'tr', 'th', 'span', 'div', 'button', 'tbody', 'td', 'section', 'header', 'nav', 'main', 'h1', 'fieldset', 'p', 'legend', 'img', 'input', 'a', 'em', 'strong', 'hr', 'slot', 'label', 'details', 'router-link', 'router-view', 'summary', 'form', 'ol', 'ul', 'li', 'br', 'select', 'option', 'datalist'
]

module.exports = (doc) ->
	split = ///
		^(<template\ lang="slm">)
		([\w\W]+)
		(<\/template>\s*<script\ lang="coffee">)
		([\w\W]+)
		(export\ default.*\n)
		([\w\W]+)$
		///.exec(doc)
	try
		templateTag = split[1]
	catch e
		console.error(doc)
		throw e
	html = split[2]
	middle = split[3]
	imports = split[4]
	exportStatement = split[5]
	jsAndCss = split[6]
	usedComponentNames = html.match(///
			(?<=^|\n\s*)	# start of line or newline, then optional whitespace
			([a-z-/]+)		# html elem, optional / 's
			(?=[\s.#]|$)	# end of line or 1 whitespace
		///g)
		.filter((name) => !htmlElements.includes(name))
	html = html.replace(/// # todo: use matches from above
			(?<=^|\n\s*)
			([a-z-]+)/([a-z-]+)	# bla/my-comp
			(?=[\s.#]|$)
		///g, '$2')	# remove /
	usedComponents = [...new Set(usedComponentNames)]
		.map((name) =>
			match = /^(.+\/)?([^\/]+)$/.exec(name)
			path = match[1] || ''
			name = match[2]
			camelCase = name
				.replace(/-(.)/g, ($1) => $1[1].toUpperCase())
			CamelCase = camelCase[0].toUpperCase() + camelCase.slice(1)
			return {
				path: path
				name: CamelCase
			}
		)
	imports = imports + usedComponents
		.map((component) => "import #{component.name} from '@/components/#{component.path}#{component.name}'")
		.join('\n')
	componentsString = usedComponents
		.map((component) => component.name)
		.join(',')
	# todo: component name from file ...?
	"#{templateTag}#{html}#{middle}\n#{imports}\n#{exportStatement}\tcomponents:{#{componentsString}}\n#{jsAndCss}"