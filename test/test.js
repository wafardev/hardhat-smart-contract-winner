const hre = require("hardhat");
const { expect } = require("chai");

describe("Testing Tx Relayer", function () {
  let owner;
  let contractWinner;
  let contractWinnerAddress;
  let contractRelay;
  let contractRelayAddress;

  beforeEach(async function () {
    [owner] = await hre.ethers.getSigners();
    const ContractWinner = await hre.ethers.getContractFactory(
      "ContractWinner"
    );
    contractWinner = await ContractWinner.deploy();
    await contractWinner.waitForDeployment();

    contractWinnerAddress = contractWinner.target;

    const ContractRelay = await hre.ethers.getContractFactory("TxRelayer");
    contractRelay = await ContractRelay.deploy(contractWinnerAddress);
    await contractRelay.waitForDeployment();
    contractRelayAddress = contractRelay.target;
  });

  it("Should relay the Contract Winner Contract", async function () {
    const txResponse = await contractRelay.relayMsgSender();
    const receipt = await txResponse.wait();

    const logData = receipt.logs[0].data.toLowerCase();
    // Emitted data is formatted differently than a normal address

    const trimmedRelayContractAddress = logData.toLowerCase().slice(2);
    expect(logData.endsWith(trimmedRelayContractAddress)).to.equal(true);
  });

  it("Should show the tx origin", async function () {
    const txOriginAddress = await contractRelay.testRelayer();

    console.log("txOriginAddress: ", txOriginAddress);
    console.log("contractRelayAddress: ", contractRelayAddress);

    expect(txOriginAddress).to.equal(owner.address);
  });

  it("Should self destruct the Tx Relay Contract", async function () {
    await contractRelay.selfDestruct();
    const code = await hre.ethers.provider.getCode(contractRelayAddress);

    expect(code).to.equal("0x");
  });
});
