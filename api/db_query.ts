import sqlite3 from 'sqlite3'

void (async () => {
	const match_terms = process.argv[2]
	const limit = Number(process.argv[3])
	
	const query = 'select fts.site, fts.title from fts where fts match ? limit ?'
	// for testing (much slower)
	// const match_terms = `%${req.query.q}%`
	// const query = 'select fts.site, fts.title from fts where title like ? limit ?'

	const db = new sqlite3.Database('db.db')
	db.all(query, match_terms, limit, (err, rows) => {
		if(err) {
			console.error(err)
			process.exit(1)
		}
		process.send!(rows)
		process.exit(0)
	})
})()