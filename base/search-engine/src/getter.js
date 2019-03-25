const http = require('http');

//This class interfaces with the api server

module.exports = class Getter {
  constructor(db, addr) {
    this.addr = addr[0]
    this.port = addr[1]
    this.db = db
  }

  PairHash() {
    return new Promise((resolve, reject) => {
      let options = {
        host: this.addr,
        port: this.port,
        path: '/addr'
      };
      let req = http.get(options,(res) => {
        let bodyChunks = [];
        res.on('data', (chunk) =>  {
          bodyChunks.push(chunk);
        }).on('end', function() {
          let body = Buffer.concat(bodyChunks);
          console.log(body);
          resolve(body)
        })
      });
      req.on('error',(e) => {
        reject(e)
      });
    });
  }
}
