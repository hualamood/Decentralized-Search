const si = require('search-index');
const fs = require('fs');
// const IPFS = require('ipfs');
const IpfsAPI = require('ipfs-http-client');
const Utils = require('./src/utils.js')
const Getter = require('./src/getter.js')


const node = IpfsAPI('bootstrap', '5001');

// const node = new IPFS({
//   config: {
//     Addresses: {
//       Swarm: [
//         '/dns4/ws-star.discovery.libp2p.io/tcp/443/wss/p2p-websocket-star',
//       ]
//     }
//   },
//   EXPERIMENTAL: {
//     pubsub: true
//   }
// })

const db = si({ name: 'searchbase' })
const getter = new Getter(db, ['api_server', 9009])
const discovery = 'discovery';

Index = (msg) => {
  node.get(msg['ipfs_hash'], (err, files) => {
    files.forEach((file) => {
      let to_add = [
        {
          'path': file.path,
          'hash': msg['ipfs_hash'],
          'tags': msg['tags'],
          'content': file.content.toString('utf8')
        }
      ]
      db.PUT(to_add).then(() => {
        console.log("Added", to_add, "to index")
      })
    })
  })
}

Search = (msg) => {
  return new Promise((resolve, reject) => {
    db.SEARCH(msg['query']).then((result) => {
      Utils.sleep(5000).then(() => {
        node.pubsub.publish(msg['channel'], Utils.ObjectToBuffer({
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
  });
}

HandleTopicMessages = (msg, node, id) => {
  if (msg) {
    let msg_string = msg.data.toString()
    let msg_json = JSON.parse(msg_string)
    console.log('Topic', msg_json)
    if (msg_json['inf'] == 'PUT') {
      Index(msg_json)
    }
  }
}

HandleQueryMessages = (msg, node, id) => {
  if (msg) {
    let msg_string = msg.data.toString()
    let msg_json = JSON.parse(msg_string)
    console.log('Global', msg_json)
    if (msg_json['inf'] == 'SEARCH') {
      Search(msg_json).then((result) => {
        console.log('Published', result, "to", msg_json['channel']);
      })
    }
  }
}

// node.on('ready', () => {
//   // Your node is now ready to use \o/
//   console.log('IPFS node ready')
  node.id().then((id) => {
    console.log('IPFS NODE has id', id)
    node.bootstrap.add('/dns4/gateway.ipfs.io/ipfs/Qmaisz6NMhDB51cCvNWa1GMS7LU1pAxdF4Ld6Ft9kZEP2a', (err, res) => {
      if (err) {
        console.log(err)
      } else {
        console.log('Bootstrap added', res)
      }
    })
    node.bootstrap.add('/dns4/bootstrap/tcp/8080/ipfs/QmSoLV4Bbm51jM9C4gDYZQ9Cy3U6aXMJDAbzgu2fzaDs64', (err, res) => {
      if (err) {
        console.log(err)
      } else {
        console.log('Bootstrap added', res)
      }
    })
    node.bootstrap.add('/ip4/192.168.1.209/tcp/5001/ipfs/Qmdwg944DbHsUPq6zW2GVPNhZ9pjif7KWnk16WZ3SVqUYR', (err, res) => {
      if (err) {
        console.log("Err:", err)
      } else {
        console.log("Bootstrap:", res)
      }
    })
    node.pubsub.subscribe(
      discovery, (msg) => HandleQueryMessages(msg, node, id),
      (err) => {
        if (err) {
          console.log(err);
        }
        node.pubsub.publish(discovery, Utils.ObjectToBuffer({
          'inf': 'joined',
          'id': id,
        }), (err) => {
          if (err) console.log(err);
        })
      })
    getter.PairHash().then((body) => {
      let synchash = body.toString() + ':sync_room'
      console.log('subscribing to', synchash)
      node.pubsub.subscribe(
        synchash, (msg) => HandleTopicMessages(msg, node, id),
        (err) => {
          if (err) {
            console.log(err);
          }
          node.pubsub.publish(synchash, Utils.ObjectToBuffer({
            'inf': 'joined',
            'id': id,
          }), (err) => {
            if (err) console.log(err);
          })
        })
    })

  // stopping a node
  // node.stop(() => {
  //   // node is now 'offline'
  // })
  })
// })
