const hre = require("hardhat");
const fs = require('fs');
const fse = require("fs-extra");
const { getAmountInWei, developmentChains } = require('../utils/helper-scripts');

async function main() {
  const deployNetwork = hre.network.name

  // test URI
  const baseURI = "ipfs://QmeHfivPyobBjSXtVUv2VHCMmugDRfZ7Qv7QfkrG4BWLQz"

  const maxSupply = 30
  const mintCost = getAmountInWei(0.01)
  const maxMintAmount = 5

  // Deploy DacadePunks NFT contract 
  const NFTContract = await hre.ethers.getContractFactory("DacadePunks");
  const nftContract = await NFTContract.deploy(maxSupply, mintCost, maxMintAmount);

  await nftContract.waitForDeployment();

   const set_tx = await nftContract.setBaseURI(baseURI)
   await set_tx.wait()

    // Deploy DacadePunks ERC20 token contract 
   const TokenContract = await hre.ethers.getContractFactory("DacadePunksToken");
   const tokenContract = await TokenContract.deploy();

   await tokenContract.waitForDeployment();

    // Deploy Vault contract 
   const Vault = await hre.ethers.getContractFactory("Vault");
   const stakingVault = await Vault.deploy(nftContract.target, tokenContract.target);

   await stakingVault.waitForDeployment();

   const control_tx = await tokenContract.setController(stakingVault.target, true)
   await control_tx.wait()

   console.log("DacadePunks NFT contract deployed at:         ", nftContract.target);
   console.log("DacadePunks ERC20 token contract deployed at: ", tokenContract.target);
   console.log("NFT Staking Vault deployed at:                ", stakingVault.target);
   console.log("Network deployed to:                          ", deployNetwork);

   /* transfer contracts addresses & ABIs to the frontend */
   if (fs.existsSync("../frontend/src")) {
     fs.rmSync("../src/artifacts", { recursive: true, force: true });
     fse.copySync("./artifacts/contracts", "../frontend/src/artifacts")
     fs.writeFileSync("../frontend/src/utils/contracts-config.js", 
     `
      export const stakingContractAddress = "${stakingVault.target}"
      export const nftContractAddress = "${nftContract.target}"
      export const tokenContractAddress = "${tokenContract.target}"
      export const ownerAddress = "${stakingVault.runner.address}"
      export const networkDeployedTo = "${hre.network.config.chainId}"
     `)
   }

}


main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
