// CONFIGURE CHAIN NODE
process.env.DEBUG = '*,-hypercore-protocol'
console.log('start', process.env.DEBUG)
const json = JSON.stringify({ chain: ['0.0.0.0', 3399] })
const logport = 9001
process.argv.push(json, logport)

// LAUNCH CHAIN NODE
require('.')

const http = require('http')
const server = http.createServer(handler)
server.listen(process.env.PORT, () => {
  console.log('webserver listening on', server.address())
})
process.on('SIGINT', () => {
  console['log']("\n Terminating all processes")
  process.exit()
})
function handler (request, response) {
  const { url } = request
  response.status = 200
  response.end(`<!doctype html>
  <html>
    <head><meta charset="utf-8"></head>
    <body><script>
      document.title = 'datdot'
      console.log('hello datdot')
      document.body.innerHTML = '<h1> hello datdot </h1>'
      const ws_url = new URL(location.href)
      ws_url.port = ${logport}
      ws_url.protocol = location.hostname === 'localhost' ? 'ws:' : 'wss:'
      console.log({ ws_url: ws_url.href })
      const socket = new WebSocket(ws_url.href)
      socket.onopen = event => {
        console.log('open')
        // socket.send("Hello Server!")
      }
      socket.onmessage = event => {
        console.log("message", event.data)
        document.body.append(Object.assign(document.createElement('div'), {
          innerHTML: '<h3>' + event.data + '</h3>'
        }))
        if (document.body.children.length > 1000) document.body.firstChild.remove()
      }
      socket.onerror = error => {
        console.error(error)
      }
      socket.onclose = event => {
        console.log(event)
      }
    </script></body>
  </html`)
}
