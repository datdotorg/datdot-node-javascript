// CONFIGURE CHAIN NODE
const json = JSON.stringify({ chain: ['0.0.0.0', 3399] })
const logport = 9001
process.argv.push(json, logport)

// LAUNCH CHAIN NODE
require('.')

process.on('SIGINT', () => {
  console['log']("\n Terminating all processes")
  process.exit()
})