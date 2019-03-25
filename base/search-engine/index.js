const sharer = require('./src/sharer.js')
const node = new sharer('discovery', 'bootstrap',['api_server', 9009])

node.InitNode()
node.Bootstrap('/dns4/gateway.ipfs.io/ipfs/Qmaisz6NMhDB51cCvNWa1GMS7LU1pAxdF4Ld6Ft9kZEP2a')
