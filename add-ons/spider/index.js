const Crawler = require("crawler");
const ipfsClient = require('ipfs-http-client');
const fetch = require('node-fetch');

// connect to ipfs daemon API server
let ipfs = ipfsClient('localhost', '5001', { protocol: 'http' }) // leaving out the arguments will default to these values

let crawled = [];

const c = new Crawler({
    maxConnections : 10,
    // This will be called for each crawled page
    callback : function (error, res, done) {
        if(error){
            console.log(error);
        }else{
            // $ is Cheerio by default
            //a lean implementation of core jQuery designed specifically for the server
            if (res.$) {
              let linkHrefs = res.$('link').map(function(i) {
                let u = res.$(this).attr('href')
                let h = res.request.uri.href
                if (u.substring(0,2) == '//') {
                  return 'http:' + u
                } else {
                  return h.substring(0, h.length - 1) + u
                }
                return ;
              }).get();


              linkHrefs.map((item) => {
                if (! crawled.includes(item)) {
                  console.log("Item", item)
                  // if (item.includes('wikipedia')) {
                  // }
                  Q_up(item)
                  crawled.push(item)
                }
              })

              Add_Item(res.body, res.request.uri.href)

              console.log(linkHrefs)
              console.log('Grabbed', res.request.uri.href, 'bytes');
            }
        }
        done();
    }
});

Add_Item = (body, link) => {
  ipfs.add(Buffer.from(body, 'utf8'), (err, res) => {
    if (err) {
      console.log(err)
    } else {
      fetch('http://localhost:9009/add/' + res[0].hash, {
        method: 'post',
        body: JSON.stringify({
          'tags': link,
        }),
        headers: { 'Content-Type': 'application/json' },
    })
        .then(res => res.text())
        .then(text => console.log(text));
    }
  })
}

Q_up = (url) => {
  c.queue(url);
}

c.queue('https://www.w3schools.com/jsref/jsref_includes.asp');
