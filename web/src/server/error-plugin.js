import path from 'path'
import fs from 'fs'
import fetch from 'node-fetch'

export default {
	async routeError(err, response) {
		// 1. Tell the user
		const html = fs.readFileSync(path.join(__dirname, '500.html'), 'utf-8')
		response.body = html.replace('{{ error }}', err.stack)
		// 2. Tell API/error
		const stringified = ((()=>{ try { return JSON.stringify(err) } catch(_){} })()) || err.status || 'Unknown error'
		const error_stringified = `SSR BUILD FAILURE ----
			${err.message || err.data || err.msg || err.body} -
			${err.stack || ''} -
			${err.toString()} -
			${stringified} -
			${Error().stack}`
		console.info(error_stringified)
		try {
			const resp = await fetch(`${process.env.VUE_APP_API_ROOT}/error`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ error: error_stringified })
			})
			const text = await resp.text()
			if(resp.status !== 200) {
				console.error(`Fetching error failed: ${resp.status}, ${text}`)
			} else {
				console.info("Error reported.");
			}
		} catch(e1) {
			console.error("fetch post error failed 2: ", e1)
		}
	}
}


