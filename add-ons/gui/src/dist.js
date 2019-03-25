const IPFSAPI = require('ipfs-http-client');
const Utils = require('./utils.js')

module.exports = class IPFSNode {
  constructor() {
    this.ipfs = new IPFSAPI('127.0.0.1', 5001)
    this.id = ''
  }

  Sub(channel, handler) {
    return new Promise((resolve, reject) => {
      this.ipfs.pubsub.subscribe(
        channel, (msg) => handler(msg, this.ipfs, this.id),
        (err) => {
          if (err) {
            reject(err)
          } else {
            resolve()
          }
        })
    })
  }

  // InitNode() {
  //   return new Promise((reject, resolve) => {
  //     // this.ipfs.on('ready', () => {
  //     //   // Your node is now ready to use \o/
  //       // console.log('IPFS node ready')
  //       this.ipfs.id().then((id) => {
  //         this.id = id
  //         console.log('IPFS NODE has id', id)
  //         resolve(id)
  //       })
  //       // stopping a node
  //       // this.ipfs.stop(() => {
  //       //   // node is now 'offline'
  //       // })
  //     })
  //   // })
  // }
}
