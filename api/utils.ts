/** process.env.[name] or throw */
export const env = (name: string): string =>
	process.env[name] || (() => { throw new Error(`environment variable ${name} is missing`) })()

export const log = console.log

export const error = console.error

export const html_escape = (s: string) =>
	s.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#039;')
