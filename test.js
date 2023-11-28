
const PMP = require("./src")

let pmp = new PMP({
	gateway: "192.168.1.1",
	ttl: 5,
	port: [80, 81],
	autoRefresh: true,
	description: "node test",
	debug: true
})

let ports = ["12305", "12306"]

// pmp.unmap(ports)
// pmp.map(ports).then(console.log)



// setTimeout(() => {      
// 	pmp.unmap(ports)
// 	process.exit(0)
// }, 3000)

pmp.unmap().then(() => {
	pmp.map().then(console.log)
})


