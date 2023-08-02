module.exports = devtools

function devtools () {
  document.title = 'dev'
  console.log('[dev]:ready')
  document.body.innerHTML = '<h1> dev </h1>'
  const chain = connect('./chain')
  const debug = connect('./debug')

  function connect (path) {
    const url = new URL(path, location.href)
    url.protocol = location.protocol === 'http:' ? 'ws:' : 'wss:'
    console.log('URL', url.href)
    const socket = new WebSocket(url.href)
    return socket
  }
  
  chain.onopen = event => {
    console.log('[chain]:open>', event)
  }
  chain.onmessage = event => {
    console.log('[chain]:message>', event.data)
    document.body.append(Object.assign(document.createElement('div'), {
      innerHTML: '<h3>' + event.data + '</h3>'
    }))
    if (document.body.children.length > 1000) document.body.firstChild.remove()
  }
  chain.onerror = event => {
    const text = ERROR_CODES[event.code] || 'Unknown reason'
    console.log('[chain]:error>', event.code, event.reason, text)
  }
  chain.onclose = event => {
    const text = ERROR_CODES[event.code] || 'Unknown reason'
    console.log('[chain]:close>', event.code, event.reason, text)
  }




  debug.onopen = event => {
    console.log('[debug]:open>', event)
  }
  debug.onmessage = event => {
    console.log('[debug]:message>', event.data)
    document.body.append(Object.assign(document.createElement('div'), {
      innerHTML: '<h3>' + event.data + '</h3>'
    }))
    if (document.body.children.length > 1000) document.body.firstChild.remove()
  }
  debug.onerror = event => {
    const text = ERROR_CODES[event.code] || 'Unknown reason'
    console.log('[debug]:error>', event.code, event.reason, text)
  }
  debug.onclose = event => {
    const text = ERROR_CODES[event.code] || 'Unknown reason'
    console.log('[debug]:close>', event.code, event.reason, text)
  }

  const ERROR_CODES = {
    1000: 'Normal closure, meaning that the purpose for which the connection was established has been fulfilled.',
    1001:'An endpoint is \"going away\", such as a server going down or a browser having navigated away from a page.',
    1002: 'An endpoint is terminating the connection due to a protocol error',
    1003: 'An endpoint is terminating the connection because it has received a type of data it cannot accept (e.g., an endpoint that understands only text data MAY send this if it receives a binary message).',
    1004: 'Reserved. The specific meaning might be defined in the future.',
    1005: 'No status code was actually present.',
    1006: 'The connection was closed abnormally, e.g., without sending or receiving a Close control frame',
    1007: 'An endpoint is terminating the connection because it has received data within a message that was not consistent with the type of the message (e.g., non-UTF-8 [https://www.rfc-editor.org/rfc/rfc3629] data within a text message).',
    1008: 'An endpoint is terminating the connection because it has received a message that \"violates its policy\". This reason is given either if there is no other sutible reason, or if there is a need to hide specific details about the policy.',
    1009: 'An endpoint is terminating the connection because it has received a message that is too big for it to process.',
    // Note that the following status code is not used by the server, because it can fail the WebSocket handshake instead:
    1010: `An endpoint (client) is terminating the connection because it has expected the server to negotiate one or more extension, but the server didnt return them in the response message of the WebSocket handshake.
          Specifically, the extensions that are needed are listed in 'event.reason'`,
    1011: 'A server is terminating the connection because it encountered an unexpected condition that prevented it from fulfilling the request.',
    1015: 'The connection was closed due to a failure to perform a TLS handshake (e.g., the server certificate cant be verified).'
  }
}