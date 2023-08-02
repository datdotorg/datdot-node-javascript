const { login } = require('datdot-service/src/node_modules/datdot-vault')
/*************************************
  LOGIN + VAULT USE
*************************************/
{
  const { vault, sudo } = login()
  const _ROUTES = {}
  _ROUTES['/live'] = () => {}
  _ROUTES['/'] = () => {}
  _ROUTES['/chain'] = {
    open: event => {},
    error: event => {},
    message: event => {},
    close: event => {},
  }
  _ROUTES['/debug'] = {
    open: event => {},
    error: event => {},
    message: event => {},
    close: event => {},
  }
  const ADDRESSES = {
    'http'       : '/',
    'chain'      : '/chain',
    'chain/logs' : '/debug',
    'livereload' : '/live',
  }
  // @INFO: be able to learn about all global modules + APIs
  // logs hyperaddress/README.md of module to listen 
  // LEARN ABOUT ALL GLOBAL MODULE LISTENERS
  sudo.onnode = ({ name, stack }) => { // register
    const id = ADDRESSES[name]
    console.log(`[onnode]`, name, id)
    const on = _ROUTES[id]
    if (!on) throw new Error(`undefined handlers for "${id}"`)
    if (!id) throw new Error(`unknown route "${name}"`)
    // console.log('[SUDO]:onnode>', id, name, stack)
    return id
  }
  // sudo.onwire = wire => { // route
  //   console.log('[SUDO]:onwire>', wire)
  // }
  // sudo.oninvite = (path, token) => { // onlink   
  //   console.log('[SUDO]:oninvite>', path, token)
  // }
  // sudo.onconnect = token => { console.log('[SUDO]:onconnect>', token) }
}
/*************************************
 VAULT USE
*************************************/
const { io } = vault 
// { const { id, on, db, at } = { io, db, id } = vault }
const at1 = io('livereload', function on (message) {
  console.log('@TODO: livereload')
  // @TODO: make live reload work! ...maybe even HMR!
  // @TODO: later, make that a custom thing for a custom vault
  // => and make the page live reloading dependent on the vault instead
})
const at2 = io('http', handler)
// const at2 = io('http', onhttp)
function onhttp (stream, info) { // onopen
  // info: any provided data that passes through JSON.parse(JSON.stringify(x))
  console.log('@TODO: http')
  // stream > message, because it also allows to answer and close, ...

  handler()

  // CHALLENGE:
  // ...know what "protocol" to speak
  // 1. what messages to accept
  // 2. what messages to respond with
  // => every module must document it's GLOBAL SERVERS
  // => every module must documnt it's param based token servers
  // ===> if a module uses a global server module, it must document it too
  // ===> if it does not, there should be a generic way to discover the docs
  // -> THERE IS! the `sudo.onnodes hook` will provide the README.md of
  //    listener defining module
  // ----------------------
  stream.onopen
  stream.onerror
  stream.onclose
  stream.ondata
  stream.on('readable', data => {})
  stream.on('data', data => {})
  stream.on('close', data => {})
  stream.on('error', data => {})
}
/////////////////////////////////////////////////////////////
// substack : brick $  ....
/////////////////////////////////////////////////////////////

// PROBLEM:
// * modules could accept ip/port params to start a server
// * using a module with ip/port params directly is ok
// * but using modules that hardcode ip/port params to child modules is rigid
//   -> we now dont know or control server listening, maybe port even conflicts
// SOLUTION: have servers be independent of params and notify root directly
// PROBOLEM: if every module that listens was like that it means lots of config
// SOLUTION:
// 0. any sub dependency module deep in the code can define a `node`
//    => can send messages => ...they go nowhere, because nothing is connected
//    => can receive messages => ...doesn't happen, because nothing is connected
// 1. a node can do `token listening`
//    -> IN-PROCESS-ONLY: pass/send invite tokens to others for connecting
//    -> invite tokens are not transferrable across process boundaries
// 2. a node can do `pure listening` -> means listening to something undefined
//    -> needs global counterpart! (e.g. http/websockets/...)
//    -> listening is received GLOBALLY (maybe stored, maybe connect immediately)
// 3. process root has global listener for:
//    A. to use protocol servers (http/websocket/...) and address is invite
//    B. can listen to `pure listening` nodes
//    C. spawn other processes because it is a `root syscall`
// A and B can always independently token connect
// A and B pure servers can be introduced and connceted by ROOT
/////////////////////////////////////////////////////////////
// 1. If A and B offer token servers, they connect when one token connects
/////////////////////////////////////////////////////////////
// => how to decide to which X to forward?
// ==> ROOT needs to pick an available registered node
// ==> incoming conncetion needs to be mapped somehow
/////////////////////////////////////////////////////////////
// REAL SERVER:
// 1. receives request from outside
// 2. forwards conncetion to node X
// 3. forwards back response from node X
// 4. stops process when either side closes the connection
// --> so only connect temporarily while a client connectes
// TODO: model connect/disconnect back/forth forward messages
// 1. maybe connection comes first   =>  but if NO ROUTE, it cannot come
// 2. so it comes first from module  =>  which enables connection later
// 3. if remote closes connection    =>  it gets forwarded
// 4. if local closes connection     =>  it gets forwarded
// PROXY: listen to both sides
/////////////////////////////////////////////////////////////
/**************************************
  START
*************************************/
const { createServer } = require('http')
const { WebSocketServer } = require('ws')
/**************************************
  CONFIGURE CHAIN NODE
    glitch port    : 3000
    logkeeper port : 9001
    chain port     : 3399
*************************************/
process.env.DEBUG = '*,-hypercore-protocol'
const port = process.env.PORT || 8080
const host = '0.0.0.0' // '127.0.0.1' || process.env.HOST_ADDRESS

const logport = 9001
console.log('HOST+PORT', process.env.HOST_ADDRESS, process.env.PORT)
if (process.env.DEBUG) console.log('DEBUG', process.env.DEBUG)
const json = JSON.stringify({
  chain: [process.env.HOST_ADDRESS || '0.0.0.0', 3399]
})
const [flag] = process.argv.slice(2)
console.log({flag})
process.argv.push(json, logport)
/**************************************
  LAUNCH CHAIN NODE
*************************************/
const script = require('datdot-node-javascript/devtools')
const init = require('datdot-node-javascript')
init(JSON.parse(json))



LESEZEICHEN: `@TODO: fix shit! 2`


const wss = new WebSocketServer({ noServer: true })
wss.on('connection', onconnection)
function onconnection (ws, request) {
  const { url: path } = request
  console.log('CONNECTION', { path }) // log
  // const send = protocol(message => ws.send(message))

  // const send = io.to(path, message => {
  //   // @TODO: THINK HOW DOES IT REALLY WORK?!?
  //   // 1. create logkeeper listener with websocket intention
  // })

  io.to(path, { ws, request })
  
  // const { id, name, stack, fn: protocol } = ROUTES[path]
  // const { protocol } = ws
  // ws.on('open', event => send(event))
  // ws.on('error', event => send(event))
  // ws.on('close', event => send(event))
  // ws.on('message', event => send(event))
}
// --------------------------------------------------------------------------
const server = createServer(handlerX) // HANDLER syscall
server.on('upgrade', onupgrade)      // ONUPGRADE syscall

function handlerX (request, response) {
  const { url } = request
  const info = {}
  // const info = {
  //   publickey,
  //   topics,
  //   prioritized,
  //   ban(status = true)
  // }
  // const stream = io.to('http', info)
  // request.pipe(stream).pipe(response)
  io.to(url, { request, response })
}
server.listen(port, host, onlisten) 
process.on('SIGINT', onterminate)
/************************************/
async function onupgrade (request, socket, head) {
  socket.on('error', onerror)
  try { await authenticate(request) } catch (error) {
    console.error('ERROR', error)
    socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n')
    socket.destroy()
  }
  socket.removeListener('error', onerror)
  const { url } = request

  // try {
  //   io.to(url, { request, response })
  // } catch (error) {
  // }
  // const on = ROUTES[url] // @TODO: ...
  if (io.has(url)) return wss.handleUpgrade(request, socket, head, ws => {
    wss.emit('connection', ws, request)
  })
  socket.write('HTTP/1.1 404 Not Found\r\n\r\n')
  socket.destroy()
}
function onlisten () {
  const { address, family, port } = server.address()
  const url = `http://${address}:${port}`
  console.log('webserver listening on', url)
  if (flag !== 'open') return
  const command = `${{ darwin: 'open', win32: 'start' }[process.platform] || 'xdg-open'/*linux*/} ${url}`
  require('child_process').exec(command)
}
function onterminate () {
  console['log']("\n Terminating all processes")
  process.exit()
}
function onerror (error) { console.log('[ws]:error>', error) }
function authenticate (request) { return request }
function handler ({ request, response }) {
  const { url } = request
  console.log('[http]', url)
  response.status = 200
  response.end(`<!doctype html>
  <html>
    <head><meta charset="utf-8"><link rel="icon" href="data:,"></head>
    <body><script>;(${script})()</script></body>
  </html`)
}