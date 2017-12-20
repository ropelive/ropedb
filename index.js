const Rope = require('@rope/node').Rope
const kad = require('kad')
const level = require('level-browserify')

const port = process.env.KITEDB_PORT || 1337
const seedHost = process.env.KITEDB_SEED || 'kitedb.microverse.koding.live'
const seedPort = process.env.KITEDB_SEED_PORT || 443

const node = kad({
	transport: new kad.HTTPTransport(),
	storage: level('./ropedb'),
	contact: {
		hostname: 'localhost',
		port: port
	}
})

const seed = [
		'ea48d3f07a5241291ed0b4cab6483fa8b8fcc127',
		{
			hostname: seedHost,
			port: seedPort
		}
]

node.listen(port)

node.join(seed, () => {
	console.log(`Connected to ${node.router.size} peers`)
})

new Rope('kitedb', {
	get: (key, callback) => {
		node.iterativeFindValue(key, (err, value, contacts) => {
			console.log(`get ${key} result: err=${err}, value=${value}, contacts=${contacts}`)
		})
	},
	set: (key, value, callback) => {
		node.iterativeStore(key, value, (err, stored) => {
			console.log(`set ${key}=${value} result: err=${err}, stored=${stored}`)
		})
	},
	del: (key, callback) => {
		console.log(`del ${key}: not implemented`)
	},
})
