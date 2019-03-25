const express = require('express')
const bodyParser = require('body-parser')
const IpfsAPI = require('ipfs-api');
const PouchDB = require('pouchdb');
const Communicator = require('./src/communicator.js')
const Storage = require('./src/storage.js')
const Engine = require('./src/engine.js')

const ipfs = IpfsAPI('ipfs', '5001');
const db = new PouchDB('localsyncdb');
const comm = new Communicator(db, ipfs)
const stor = new Storage(ipfs)

const engine = new Engine(db, comm, stor, ipfs)

const port = 9009
const app = express()
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

//Changes function
db.changes({
  since: 0,
  include_docs: true
}).then(function (changes) {
  console.log("Change", changes);
}).catch(function (err) {
  console.log(err);
});

app.get('/addr/sync', (req, res) => engine.GetSyncRoomAddr(req, res))
app.get('/addr', (req, res) => engine.GetPairRoomAddr(req, res))
app.get('/query/:query', (req, res) => engine.Query(req, res))
app.post('/add/:hash', (req, res) => engine.AddItem(req, res))

app.listen(port, () => console.log(`API listening on port ${port}!`))
