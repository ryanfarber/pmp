// src.js

const Client = require("./client.js")
const util = require("util")
const ERROR = require("./errors.js")
const Logger = require("@ryanforever/logger").v2


/** @constructor
 * @arg {object} config
 * @arg {ip address} config.gateway - i.e. IP address of your router
 * @arg {number} [ttl] - amount of time in seconds the ports should be mapped for
 * @arg {array|string} [config.ports] - port or array of ports to map
 * @arg {string} [description] - description that will be noted on your router for the mapping
 * @arg {boolean} [autoRefresh] - automatically remaps the port using the duration of the ttl
 * @arg {boolean} [debug] - log debug
 */
function PMP(config = {}) {

	this.gateway = config.gateway
	this.ports = config.ports || config.port
	this.description = config.description || "node:pmp" // description for router
	this.ttl = config.ttl || 3600 // amount of time in SECS port will be mapped
	this.job // for the auto refresh

	const autoRefresh = config.autoRefresh ?? false
	const debug = config.debug ?? false
	const logger = new Logger("pmp", {debug: debug})
	const self = this

	const client = Client.connect(this.gateway)
	if (typeof this.ports === "number") this.ports = [this.ports]



	/** map a port or an array of ports */
	this.map = async function(input) {
		input = input || this.ports

		let res = []
		if (!input) throw new ERROR("MISSING_PORT")
		if (Array.isArray(input)) {
			input = [...new Set(input)]
			logger.debug(`mapping ports ${input.join(", ")}...`)
			for (let port of input) res.push(await map(port))
		} else {
			logger.debug(`mapping port ${input}...`)
			res.push(await map(input))
		}
		logger.debug("ports succesfully mapped")
		const date = new Date()
		
		if (autoRefresh) {
			const refreshTime = date.setSeconds(date.getSeconds() + (this.ttl - 1))
			logger.debug(`refreshing ports @ ${new Date(refreshTime).toLocaleString()}`)

			this.job = setTimeout(() => {
				this.map(input)
			}, (this.ttl - 1) * 1000)
		}
		return res
	}

	/** unmap a port or an array of ports */
	this.unmap = async function(input) {
		if (this.job) clearTimeout(this.job)
		input = input || this.ports
		let res = []
		if (!input) throw new ERROR("MISSING_PORT")
		if (Array.isArray(input)) {
			input = [...new Set(input)]
			logger.debug(`unmapping ports ${input.join(", ")}...`)
			for (let port of input) res.push(await unmap(port))
		} else {
			logger.debug(`unmapping port ${input}...`)
			res.push(await unmap(input))
		}
		logger.debug("ports succesfully unmapped")
		return res
	}

	async function map(port) {
		// const client = await nat.connect(this.gateway)
		return new Promise((resolve, reject) => {
			client.portMapping({private: port, ttl: self.ttl, description: self.description}, (err, data) => {
				if (err) return reject(err)
				else resolve(data)
			})
		})
	}

	async function unmap(port) {
		// const client = await nat.connect(this.gateway)
		return new Promise((resolve, reject) => {
			client.portUnmapping({private: port, ttl: self.ttl}, (err, data) => {
				if (err) return reject(err)
				else resolve(data)
			})
		})
	}
	
}


class Mapping {
	constructor(d = {}) {
		this.private = d.port
		this.ttl = d.ttl
		this.description = d.description
	}
}







module.exports = PMP






