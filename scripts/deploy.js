// scripts/deploy.js  (ESM)
import hre from "hardhat";
import fs from "fs";

async function main() {
  const signers = await hre.ethers.getSigners();
  const deployer = signers[0];
  const deployerAddress = await deployer.getAddress();

  // get balance from provider
  const balance = await hre.ethers.provider.getBalance(deployerAddress);

  console.log("Deploying with account:", deployerAddress);
  console.log("Account balance:", balance.toString());

  const FileRegistry = await hre.ethers.getContractFactory("FileRegistry");
  const registry = await FileRegistry.deploy();

  // wait for deployment (works for ethers v6 and v5)
  if (typeof registry.waitForDeployment === "function") {
    await registry.waitForDeployment();
  } else if (typeof registry.deployed === "function") {
    await registry.deployed();
  }

  // address property differences across ethers versions
  const deployedAddress = registry.target ? registry.target : registry.address;
  console.log("FileRegistry deployed to:", deployedAddress);

  // write address to file for frontend convenience
  fs.writeFileSync("deployed-address.json", JSON.stringify({ address: deployedAddress }, null, 2));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
