const { performance } = require('perf_hooks')
var init
module.exports = blockgenerator

function blockgenerator ({ blockinterval = 6000, intrinsics }, log, emit) {
  if (init) throw Error('block generator already initialized')
  var currentBlock = 0
  var scheduled = []
  var total = 0 // TODO: make this BigInt

  init = setInterval(async () => {
    // if (currentBlock === 0) {
    //   for (var i = 0; i < scheduled.length; i++) {
    //     const action = scheduled[i]
    //     action.executeBlock += currentBlock
    //   }
    // }
    const startTime = performance.now()
    currentBlock++
    const temp = [...scheduled]
    scheduled = []
    while (temp.length) {
      if ((performance.now() - startTime) > (blockinterval - 200)) {
        scheduled = [...temp, ...scheduled]
        log({ type: 'Error', data: 'not able to check  or execute the remaining ${temp.length} intrinsics in scheduler during blockinterval' })
        emit({ from: 'blockgenerator', type: 'block', data: { number: currentBlock, startTime } })
        // TODO: maybe allow listeners to `emit` (= '*') events?
        return
      }
      const { id, from, type, data, executeBlock } = temp.shift()
      if (!id) continue // old item - id removed by `cancelAction(id)`
      else if (executeBlock <= currentBlock) {
        log({ type: 'scheduler', data: `Executing: ${type}` })
        const intrinsic = intrinsics[type]

        await intrinsic(from, data)
      }
      else scheduled.push({ id, from, type, data, executeBlock })
    }
    emit({ type: 'block', data: { number: currentBlock, startTime } })
  }, blockinterval)

  function scheduleAction ({ from, data, delay, type }) {
    if (delay <= 0) return void setTimeout(() => {
      const intrinsic = intrinsics[type]
      intrinsic(from, data)
    }, 0)
    const item = { from, type, data, executeBlock: currentBlock + delay/*currentBlock? currentBlock + delay : delay*/ }
    const id = item.id = total = total + 1
    scheduled.push(item)
    log({ type: 'scheduler', data: { from: from.path, type, data, id, executeBlock: item.executeBlock } })
    return id
  }
  function cancelAction (id) {
    log({ type: 'scheduler', data: { text: `Cancel: ${id}`, scheduled: scheduled.filter(entry => entry.id) } })
    // log({ type: 'scheduler', data: { text: `Cancel: ${id}` } })
    for (var i = 0, len = scheduled.length; i < len; i++) {
      if (scheduled[i].id === id) scheduled[i].id = undefined
    }
  }
  return { scheduleAction, cancelAction }
}
