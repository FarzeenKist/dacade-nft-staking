const hre = require("hardhat");
import dotenv from "dotenv";
dotenv.config();
const PRIVATE_KEY = <string>process.env.PRIVATE_KEY;
import { ethers } from "ethers";

const abi = require("../artifacts/contracts/DacadePunks.sol/DacadePunks.json");

async function main() {
  let rpc = "https://alfajores-forno.celo-testnet.org";
  let chainId = 44787;

  const nftAddress = "0x15d37b4fe7d2c39446637C949b55e3f9Ccb87CBE";

  const provider = new ethers.JsonRpcProvider(rpc, chainId);
  const signer = new ethers.Wallet(PRIVATE_KEY, provider);

  const NFTContract = new ethers.Contract(nftAddress, abi.abi, signer);

  console.log('Activating...');
  let tx = await NFTContract.connect(signer);
  console.log(tx)
}


main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
