const hre = require("hardhat");

async function main() {
  const FreelancePlatform = await hre.ethers.getContractFactory("FreelancePlatform");
  const freelancePlatform = await FreelancePlatform.deploy();

  await freelancePlatform.deployed();

  console.log("FreelancePlatform deployed to:", freelancePlatform.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });