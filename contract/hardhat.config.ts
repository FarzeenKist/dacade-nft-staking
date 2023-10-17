import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
// require("@nomiclabs/hardhat-ethers");

import dotenv from "dotenv";
dotenv.config();
const PRIVATE_KEY = <string>process.env.PRIVATE_KEY;

const config: HardhatUserConfig = {
  solidity: "0.8.7",
  networks: {
    hardhat: {
    },
    alfajores: {
      url: "https://alfajores-forno.celo-testnet.org",
      chainId: 44787,
      gas: 10000000,
      accounts: [PRIVATE_KEY]
    }
  },
};

export default config;