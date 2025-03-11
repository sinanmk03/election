// truffle-config.cjs

module.exports = {
  // Compiled contract artifacts will be saved to your React app’s src/contracts folder.
  contracts_build_directory: "./src/contracts",

  networks: {
    development: {
      host: "127.0.0.1",    // Localhost
      port: 7545,           // Ganache GUI default port (or 8545 for Ganache CLI)
      network_id: "*"       // Match any network id
    },
    // Additional networks can be configured here.
  },

  compilers: {
    // Note: Your environment is using Solidity v0.5.16
    solc: {
      version: "0.5.16",    // Solidity version to use
      settings: {
        optimizer: {
          enabled: true,  // Enable the optimizer
          runs: 200       // Optimize for how many times you intend to run the code
        }
      }
    }
  }
};
