// errors.js

let name = "PMP ERROR"
let type = {
	MISSING_PORT: "please specify the port you want to map"
}

class ERROR extends Error {
	constructor(input) {
		super()

		this.name = name
		this.code = undefined

		if (type.hasOwnProperty(input)) {
			this.message = type[input]
			this.code = input
		} else {
			this.message = input
			this.code = input
		}
	}
}

module.exports = ERROR