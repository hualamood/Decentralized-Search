//Here the class will be for the communicator
//that communicates between the search engine and the api-server

const crypto = require('crypto');

const Utils = require('./utils.js');

module.exports = class Communicator {
  constructor(db, ipfs) {
    this.ipfs = ipfs
    this.db = db
    this.pair_id = Utils.GenID();
    this.pair_hash = Utils.Createhash(this.pair_id);
    this.sync_hash = this.pair_hash + ':sync_room';

    this.Init_IPFS_conn()
  }

  GetSyncHash() {
    return this.sync_hash;
  }

  GetPairHash() {
    return this.pair_hash;
  }

  Handle_IPFS_msg(msg, db) {
    if (msg) {
      console.log(msg.data.toString());
      let msg_data = JSON.parse(msg.data.toString());
    }
  }

  Init_IPFS_conn(multihash) {
    //Adding server to bootstrap list
    // this.ipfs.bootstrap.add(multihash, async (err) => {
    //   if (err) {
    //     console.log(err);
    //   }
    // })
    //Then subscribing to pubsub room
    this.ipfs.bootstrap.add('/dns4/gateway.ipfs.io/tcp/5001/ipfs/Qmaisz6NMhDB51cCvNWa1GMS7LU1pAxdF4Ld6Ft9kZEP2a' , (err, res) => {
      if (err) {
        console.log("Err:", err)
      } else {
        console.log("Bootstrap:", res)
      }
    })

    this.ipfs.bootstrap.add('/dns4/ws-star.discovery.libp2p.io/tcp/443/ipfs/QmNNp1yZ3JmmfTzJugRFrU71jCdT7ryrKxE1nH1oKx3n12', (err, res) => {
      if (err) {
        console.log("Err:", err)
      } else {
        console.log("Bootstrap:", res)
      }
    })

    this.ipfs.bootstrap.add('/ip4/192.168.1.209/tcp/8080/ipfs/Qmdwg944DbHsUPq6zW2GVPNhZ9pjif7KWnk16WZ3SVqUYR', (err, res) => {
      if (err) {
        console.log("Err:", err)
      } else {
        console.log("Bootstrap:", res)
      }
    })

    this.ipfs.pubsub.subscribe(this.sync_hash, (msg) => this.Handle_IPFS_msg(msg, this.db), (err) => {
      if (err) {
        return console.error(`failed to subscribe to ${this.sync_hash}`, err)
      }
      console.log(`subscribed to ${this.sync_hash}`)
    })
  }
};
