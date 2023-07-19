// CONFIGURE CHAIN NODE
const json = JSON.stringify({ chain: ['0.0.0.0', 8080] })
const logport = 9001
process.argv.push(json, logport)

// LAUNCH CHAIN NODE
require('.')

// const spawn = require('cross-spawn')

// const filepath = require.resolve('datdot-service')
// const explorer_path = 'node_modules/datdot-explorer/demo/registry.js'
// const modulepath = new URL(explorer_path, `file:${filepath}`).href.slice(7)
// const args = [modulepath, JSON.stringify([logport])]
// const logkeeper = spawn('node', args, { stdio: 'inherit' })



process.on('SIGINT', () => {
  console['log']("\n Terminating all processes")
  // logkeeper.kill()
  process.exit()
})