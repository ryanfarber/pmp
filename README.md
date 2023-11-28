# pmp
Map ports using PMP (NAT Port Mapping Protocol)

This is a fork of [nat-pmp](https://www.npmjs.com/package/nat-pmp).  Added async/await and easier methods.

## usage
```javascript
const PMP = require("@ryanforever/pmp")
const pmp = new PMP({
    gateway: "192.168.1.1", // i.e. your router ip address
    ttl: 1800,              // amount of time in seconds port(s) should remain mapped
    ports: [69, 420],       // ports you want to map
    autoRefresh: true,      // automatically refresh port(s) before they expire
    description: "my-app",  // a description to be send along with the mapping
    debug: true,            // debug logging
})

// map the ports
pmp.map()

// unmap the ports
pmp.unmap()
```

You can also map the ports in the methods themselves
```javascript
const PMP = require("@ryanforever/pmp")
const pmp = new PMP({
    gateway: "192.168.1.1",
    ttl: 1800
})

pmp.map(42)
pmp.unmap(42)
```