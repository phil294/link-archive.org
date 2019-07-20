html_elements = [
	'table', 'thead', 'tr', 'th', 'span', 'div', 'button', 'tbody', 'td', 'section', 'header', 'nav', 'main', 'h1', 'fieldset', 'p', 'legend', 'img', 'input', 'a', 'em', 'strong', 'hr', 'slot', 'label', 'details', 'router-link', 'router-view', 'summary', 'form', 'ol', 'ul', 'li', 'br', 'select', 'option', 'datalist', 'template', 'menu'
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
		template_tag = split[1]
	catch e
		console.error(doc)
		throw e
	html = split[2]
	middle = split[3]
	imports = split[4]
	export_statement = split[5]
	js_and_css = split[6]
	used_component_names = html.match(///
			(?<=^|\n\s*)	# start of line or newline, then optional whitespace
			([a-z-/]+)		# html elem, optional / 's
			(?=[\s.#]|$)	# end of line or 1 whitespace
		///g)
		.filter((name) => !html_elements.includes(name))
	html = html.replace(/// # todo: use matches from above
			(?<=^|\n\s*)
			([a-z-]+/)+([a-z-]+)	# bla/blub/my-comp
			(?=[\s.#]|$)
		///g, '$2')	# remove /
	used_components = [...new Set(used_component_names)]
		.map((name) =>
			match = /^(.+\/)?([^\/]+)$/.exec(name)
			path = match[1] || ''
			name = match[2]
			camel_case = name
				.replace(/-(.)/g, ($1) => $1[1].toUpperCase())
			CamelCase = camel_case[0].toUpperCase() + camel_case.slice(1)
			{
				path: path
				name: CamelCase
			}
		)
	imports = imports + used_components
		.map((component) => "import #{component.name} from '@/components/#{component.path}#{component.name}'")
		.join('\n')
	components_string = used_components
		.map((component) => component.name)
		.join(',')
	# todo: component name from file ...?
	x = "#{template_tag}#{html}#{middle}\n#{imports}\nimport Vue from 'vue'\n\nimport { mapActions, mapState, mapGetters } from 'vuex'\n#{export_statement}\tcomponents:{#{components_string}}\n#{js_and_css}"
	# if x.includes('datum_clicked')
		# console.log x
	x