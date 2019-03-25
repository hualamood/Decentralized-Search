# Decentralized-Search

a decentralized search engine based on IPFS

The idea here is that every peer will be able to harvest and store their own data to be queried by other users on a distributed pubsub room (like a chat but for computers), where other peers also host their data.

a peer of this program consists of a couple of services:

server -- this will be what the spider will post its
documents to it will be fed ipfs hashes

indexer -- the indexer pulls items from ipfs and adds the
hashes to its full text search engine it will index objects like

{
  'ipfs_hash': 'someipfshash',
  'content': 'lorem ipsum'
}

on top of that i've added a couple of tools to make the whole thing useable

spider -- add-ons/spider

the spider in this repo is very minimal, but it works for demontration, it can be pointed to a website from where it will upload the content to ipfs and post it to the search engine.

gui -- add-ons/gui
