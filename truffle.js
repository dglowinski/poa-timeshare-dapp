require('dotenv').config()

const HDWalletProvider = require('truffle-hdwallet-provider')

module.exports = {
  solc: {
    optimizer: {
      enabled: true,
      runs: 200
    }
  },
  networks: {
    development: {
      host: 'localhost',
      port: 8545,
      network_id: '*', // Match any network id
      gas: 4712388
    },
    ropsten: {
      provider: function() {
        return new HDWalletProvider(
          process.env.MNEMONIC,
          'https://ropsten.infura.io/v3/' + process.env.INFURA,
          0,
          10
        )
      },
      network_id: 3,
      gas: 4712388,
      gasPrice: 20000000000
    }
  }
}
