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

  SendQuery(query) {
    return new Promise((resolve, reject) => {
      let channel = `${this.GetPairHash()}:query:${Utils.GenID()}`
      this.ipfs.pubsub.publish('discovery', Utils.ObjectToBuffer({
        'inf': 'SEARCH',
        'channel': channel,
        'query': query
      }), (err) => {
        if (err) {
          reject(err)
        } else {
          resolve(channel)
        }
      })
    })
  }

  SendItem(tags, hash) {
    return new Promise((resolve, reject) => {
      let synchash = this.GetSyncHash()
      this.ipfs.pubsub.publish(synchash, Utils.ObjectToBuffer({
        'inf': 'PUT',
        'ipfs_hash': hash,
        'tags': tags,
      }), (err) => {
        if (err) {
          reject(err)
        } else {
          resolve(synchash)
        }
      })
    });
  }

  Handle_IPFS_msg(msg, db) {
    if (msg) {
      console.log(msg.data.toString());
      let msg_data = JSON.parse(msg.data.toString());
    }
  }

  Init_IPFS_conn(multihash) {
    this.ipfs.pubsub.subscribe(this.sync_hash, (msg) => this.Handle_IPFS_msg(msg, this.db), (err) => {
      if (err) {
        return console.error(`failed to subscribe to ${this.sync_hash}`, err)
      }
      console.log(`subscribed to ${this.sync_hash}`)
    })
  }
};
