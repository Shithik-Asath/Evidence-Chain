module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "1337", // Changed from 5777 to 1337
      gas: 6721975,
      gasPrice: 20000000000,
    },
    ganache: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "1337", // Changed from 5777 to 1337
      gas: 6721975,
      gasPrice: 20000000000,
    }
  },
  compilers: {
    solc: {
      version: "0.8.19",
      settings: {
        optimizer: {
          enabled: true,
          runs: 200
        }
      }
    }
  }
};