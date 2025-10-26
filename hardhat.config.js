require("dotenv").config();
require("@nomicfoundation/hardhat-toolbox");

const { SEPOLIA_RPC_URL, PRIVATE_KEY, ETHERSCAN_API_KEY } = process.env;

module.exports = {
    solidity: {
  compilers: [
    { version: "0.8.19" },
    { version: "0.8.28" }
  ]
},
    networks: {
        sepolia: {
            url: SEPOLIA_RPC_URL || "",
            accounts: PRIVATE_KEY ? [PRIVATE_KEY] : []
        }
    },
    etherscan: {
        apiKey: ETHERSCAN_API_KEY || ""
    }
};
