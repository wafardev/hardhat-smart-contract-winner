const hre = require("hardhat");

async function main() {
  const ContractWinner = await hre.ethers.getContractFactory("ContractWinner");

  const contractWinnerContract = await ContractWinner.deploy();
  await contractWinnerContract.waitForDeployment();

  const contractWinnerAddress = contractWinnerContract.target;

  console.log(`ContractWinner Contract deployed to: ${contractWinnerAddress}`);

  const ContractRelay = await hre.ethers.getContractFactory("TxRelayer");
  const contractRelayContract = await ContractRelay.deploy(
    contractWinnerAddress
  );
  await contractRelayContract.waitForDeployment();

  const contractRelayAddress = contractRelayContract.target;

  console.log(`ContractRelay Contract deployed to: ${contractRelayAddress}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
