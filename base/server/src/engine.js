const Utils = require('./utils.js')

//Function that can be fed info express js.
//Will feed the arguments req, res

module.exports = class Engine {
  constructor(db, comm, stor, ipfs) {
    this.db = db
    this.comm = comm
    this.stor = stor
    this.ipfs = ipfs
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

  TrackItem(hash, tags) {
    return new Promise((resolve, reject) => {
      this.db.get(hash, (error, doc) => {
        if (error) {
          this.db.put({
            _id: hash,
            tags: [tags]
          }).then((response) => {
            resolve(response)
          }).catch((err) => {
            reject(err)
          });
        } else {
          doc.tags.push(tags)
          this.db.put({
            _id: hash,
            tags: doc.tags,
            _rev: doc._rev,
          }).then((response) => {
            reject(error)
          }).catch((err) => {
            reject(err)
          });
        }
      });
    });
  }

  AddItem(req, res) {
    let hash = req.params.hash
    let tags = req.body.tags
    if (hash && tags) {
      this.TrackItem(hash, tags).then(() => {
        this.comm.SendItem(tags, hash).then((synchash) => {
          res.send('Item Added')
        })
      }).catch((error) => {
        console.log(error);
        res.send('Item already in store')
      })
    }
  }

  Query(req, res) {
    let query = req.params.query
    if (query) {
      this.comm.SendQuery(query).then((channel) => {
        console.log("sending assigned query", query, "to channel", channel)
        res.send(channel)
      })
    }
  }
};
