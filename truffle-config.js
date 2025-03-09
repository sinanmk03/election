module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",   // Localhost (default: Ganache)
      port: 7545,          // Standard Ganache port
      network_id: "*",     // Match any network ID
      gas: 6721975,        // Gas limit (matches Ganache default)
      gasPrice: 20000000000 // 20 gwei (default for Ganache)
    }
  },

  // Configure your compilers
  compilers: {
    solc: {
      version: "0.5.0",    // Match your contract's Solidity version
      settings: {
        optimizer: {
          enabled: true,   // Enable the Solidity optimizer
          runs: 200        // Optimize for 200 runs
        }
      }
    }
  },

  // Path configuration
  contracts_build_directory: "./src/build/contracts",
  contracts_directory: "./contracts",
  migrations_directory: "./migrations",
  tests_directory: "./test",

  // Plugin configuration
  plugins: ["truffle-plugin-verify"],

  // Etherscan verification (for mainnet/testnets)
  api_keys: {
    etherscan: "YOUR_ETHERSCAN_API_KEY"
  }
};