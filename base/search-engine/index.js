const sharer = require('./src/sharer.js')
const node = new sharer('discovery', 'bootstrap',['api_server', 9009])


const bootstrap_servers = ["/dnsaddr/bootstrap.libp2p.io/ipfs/QmNnooDu7bfjPFoTZYxMNLWUQJyrVwtbZg5gBMjTezGAJN",
                        "/dnsaddr/bootstrap.libp2p.io/ipfs/QmQCU2EcMqAqQPR2i9bChDtGNJchTbq5TbXJJ16u19uLTa",
                        "/dnsaddr/bootstrap.libp2p.io/ipfs/QmbLHAnMoJPWSCR5Zhtx6BHJX9KiKNN6tpvbUcqanj75Nb",
                        "/dnsaddr/bootstrap.libp2p.io/ipfs/QmcZf59bWwK5XFi76CZX8cbJ4BhTzzA3gU1ZjYZcYW3dwt",
                        "/ip6/2a05:f6c2:5050:0:6:28f3:b213:2fc3/tcp/4001/ipfs/QmZcGvWL6UiZL4Qhy6YGtWeDsj8RdaWDhFtPHZj83XaJsc"]

node.Bootstrap(bootstrap_servers).then((res) => {
  console.log("Bootstrapped", res);
  node.InitNode()
})
