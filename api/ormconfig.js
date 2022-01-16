// import { SnakeNamingStrategy } from 'typeorm-naming-strategies'

const SnakeNamingStrategy = require('typeorm-naming-strategies').SnakeNamingStrategy

// export default {
module.exports = {
	"type": "sqlite",
	// It shouldn't be necessary to specify the env properties, but it still is because TypeORM#510
	"database": process.env.TYPEORM_DATABASE,
	"synchronize": process.env.TYPEORM_SYNCHRONIZE == "true",
	"logging": process.env.TYPEORM_LOGGING === "true",
	"entities": ["models/*.ts", "models/*.js"],
	"migrations": process.env.TYPEORM_MIGRATIONS?.split(",") || ["migration/*.ts", "migration/*js"],
	"subscribers": ["subscriber/*.ts", "subscriber/*.js"],
	"cli": {
		"entitiesDir": "models",
		"migrationsDir": process.env.TYPEORM_MIGRATIONS_DIR || "migration",
		"subscribersDir": "subscriber"
	},
	// todo check
	"maxQueryExecutionTime": 1000,
	// TYPEORM_CONNECTTIMEOUTMS=5000
	// TYPEORM_RECONNECTTRIES=2
	// TYPEORM_RECONNECTINTERVAL=1000
	namingStrategy: new SnakeNamingStrategy(),
}
