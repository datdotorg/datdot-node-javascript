const { createServer } = require('http')
const { WebSocketServer } = require('ws')

const { io } = globalThis.vault

module.exports = webserver

function webserver ({ port = 8080, host = '127.0.0.1', flag = '' }) {
  const wss = new WebSocketServer({ noServer: true })
  wss.on('connection', onconnection)
  const server = createServer(handlerX) // HANDLER syscall
  server.on('upgrade', onupgrade)       // ONUPGRADE syscall
  server.listen(port, host, onlisten) 
  process.on('SIGINT', onterminate)

  // --------------------------------------------------------------------------

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
}
