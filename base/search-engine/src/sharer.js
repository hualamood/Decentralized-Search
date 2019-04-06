const IpfsAPI = require('ipfs-http-client')

const Getter = require('./getter.js')
const Utils = require('./utils.js')
const IndexStorage = require('./ipfs-search_indexstore.js')

module.exports = class Communicator {
  constructor(discovery, ipfs_addr, server_addr) {
    this.pair_hash = ''
    this.discovery = discovery
    this.bootstrap_servers = bootstrap_servers

    this.ipfs = IpfsAPI(ipfs_addr, '5001')
    this.getter = new Getter(server_addr)
    this.IndexStore = new IndexStorage()
  }

  HandleTopicMessages(msg, id) {
    if (msg) {
      let msg_string = msg.data.toString()
      let msg_json = JSON.parse(msg_string)
      console.log('Topic', msg_json)
      if (msg_json['inf'] == 'PUT') {
        this.Index(msg_json)
      }
    }
  }

  HandleQueryMessages(msg, id) {
    if (msg) {
      let msg_string = msg.data.toString()
      let msg_json = JSON.parse(msg_string)
      console.log('Global', msg_json)
      if (msg_json['inf'] == 'SEARCH') {
        this.Query(msg_json).then((result) => {
          console.log('Published', result, "to", msg_json['channel'])
        }).catch(err => console.error(err))
      }
    }
  }

  Bootstrap(servers) {
    return new Promise((resolve, reject) => {
      servers.forEach((server) => {
        if ((! server.includes('127.0.0.1')) && server.includes('/ipfs/')) {
          this.ipfs.bootstrap.add(server, (err, res) => {
            if (err) {
              reject(err);
            } else {
              if (server == servers[servers.length-1]) {
                resolve({ peers: servers })
              }
            }
          })
        }
      })
    });
  }


  Index(msg) {
    this.ipfs.get(msg['ipfs_hash'], (err, files) => {
      files.forEach((file) => {
        let to_add = {
            'path': file.path,
            'hash': msg['ipfs_hash'],
            'tags': msg['tags'],
            'content': file.content.toString('utf8')
          }
          this.IndexStore.Put(to_add).then(() => {
            console.log("Added", to_add.hash , "to index")
          })
      })
    })
  }

  Query(msg) {
    return new Promise((resolve, reject) => {
      this.IndexStore.Search(msg['query']).then((result) => {
        console.log("Res", result)
        Utils.sleep(5000).then(() => {
          this.ipfs.pubsub.publish(msg['channel'], Utils.ObjectToBuffer({
            'inf': 'search_result',
            'result': result,
          }), (err) => {
            if (err) {
              reject(err)
            } else {
              resolve(result)
            }
          })
        })
      })
      // .catch((error) => {
      //   console.log("Rejecting here");
      //   reject(error);
      // })
    });
  }

  // Bootstrap(addr) {
  //   return new Promise((resolve, reject) => {
  //     this.ipfs.bootstrap.add(addr, (err, res) => {
  //       if (err) {
  //         reject(err)
  //       } else {
  //         resolve(res)
  //       }
  //     })
  //   })
  // }

  InitNode() {
    this.ipfs.id().then((id) => {
      this.ipfs.pubsub.subscribe(
        this.discovery, (msg) => this.HandleQueryMessages(msg, id), { discover: true },
        (err) => {
          if (err) {
            console.log(err)
          }
          this.ipfs.pubsub.publish(this.discovery, Utils.ObjectToBuffer({
            'inf': 'joined',
            'id': id,
          }), (err) => {
            if (err) console.log(err)
          })
        })
      this.getter.PairHash().then((body) => {
        this.pair_hash = body.toString()
        let synchash = this.pair_hash + ':sync_room'
        console.log('subscribing to', synchash)
        this.ipfs.pubsub.subscribe(
          synchash, (msg) => this.HandleTopicMessages(msg, id),
          (err) => {
            if (err) {
              console.log(err)
            }
            this.ipfs.pubsub.publish(synchash, Utils.ObjectToBuffer({
              'inf': 'joined',
              'id': id,
            }), (err) => {
              if (err) console.log(err)
            })
          })
      })
    })
  }
}
