const WebSocket = require('ws')

const wss = new WebSocket('wss://datdot-node-javascript.glitch.me:3000', {
  headers: {
    'user-agent': 'some-browser'
  }
})
console.log('wss running')

wss.on('error', console.error)

wss.on('open', function open() {
  console.log('open')
  // wss.send('something')
})

wss.on('message', function message(data) {
  console.log('received: %s', data)
})
