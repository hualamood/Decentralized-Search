const Utils = require('./utils.js');

module.exports = class Storage {
  constructor(ipfs) {
    this.ipfs = ipfs
    this.ipfs.id().then((id) => {
      console.log("Storage module mounted on", id.id);
    })
  }

  async StoreObject(ipfs, object) {
    return new Promise(function(resolve, reject) {
      let object_json = object
      ipfs.dag.put(object_json, { format: 'dag-cbor', hashAlg: 'sha2-256' }, (err, cid) => {
        if (err) {
          reject(err)
        } else {
          resolve(cid)
        }
      })
    });
  }
};
