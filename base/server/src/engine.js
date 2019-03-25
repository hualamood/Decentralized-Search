const Utils = require('./utils.js')

//Function that can be fed info express js.
//Will feed the arguments req, res

module.exports = class Engine {
  constructor(db, comm, stor, ipfs) {
    this.db = db
    this.comm = comm
    this.stor = stor
    this.ipfs = ipfs
    this.temp_eng = new Templates()
  }

  API_Errors(error, err) {
    let errors = {
      p_missing: {
        'error': 'parameters missing',
        'inf': error,
      },
      db_err: {
        'error': 'database error',
        'inf': error,
        'err': err,
      }
    }
    if (error in errors) {
      return JSON.stringify(errors[error])
    }
  }

  GetSyncRoomAddr(req, res) {
    let to_send = this.comm.GetSyncHash();
    console.log("Sending Sync Address to Worker", to_send);
    res.send(to_send)
  }

  GetPairRoomAddr(req, res) {
    let to_send = this.comm.GetPairHash();
    console.log("Sending Sync Address to Worker", to_send);
    res.send(to_send)
  }

  AddItem(req, res) {
    let hash = req.params.hash
    let tags = req.body.tags
    let synchash = this.comm.GetSyncHash()
    if (hash && tags) {
      this.ipfs.pubsub.publish(synchash, Utils.ObjectToBuffer({
        'inf': 'PUT',
        'ipfs_hash': hash,
        'tags': tags,
      }), (err) => {
        if (err) console.log(err);
        res.send('Item Added')
      })
    }
  }

  Query(req, res) {
    let channel = this.comm.GetPairHash() + ':query:' + Utils.GenID();
    if (req.params.query) {
      this.ipfs.pubsub.publish('discovery', Utils.ObjectToBuffer({
        'inf': 'SEARCH',
        'channel': channel,
        'query': req.params.query
      }), (err) => {
        if (err) console.log(err);
        console.log("sent query", req.params.query, "about chan", channel)
        res.send(channel)
      })
    }
  }
};
