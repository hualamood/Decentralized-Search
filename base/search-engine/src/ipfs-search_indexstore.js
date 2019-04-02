const amqp = require('amqplib/callback_api')
const elasticsearch = require('elasticsearch');
const Utils = require('./utils.js')

module.exports = class IndexStorage {
  constructor() {
    this.rabbit_addr = 'amqp://rabbitmq'
    this.es_client = new elasticsearch.Client({
      host: 'elasticsearch:9200',
      log: 'trace'
    });
  }

  Put(item) {
    return new Promise((resolve, reject) => {
      amqp.connect(this.rabbit_addr, (err, conn) => {
        conn.createChannel((err, ch) => {
          if (err) {
            reject(err)
          }
          ch.publish('', 'hashes', Utils.ObjectToBuffer({ 'Hash': item.hash }), (err, ok) => {
            if (err) {
              reject(err)
            } else {
              resolve()
            }
          })
        })
      })
    })
  }

  ParseOutput(result) {
    return result.hits.hits.map(i => {
      return { 'hash' : i._id }
    })
  }

  Search(query) {
    return new Promise((resolve, reject) => {
      this.es_client.search({
        q: query
      })
      .then((response) => resolve(this.ParseOutput(response)))
      .catch((error) => reject(error))
    })
  }
}
