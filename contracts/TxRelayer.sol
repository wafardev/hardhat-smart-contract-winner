// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

interface ContractWinnerInterface {
    function testTxOrigin() external view returns (address);

    function attempt() external;
}

contract TxRelayer {
    address public contractInstanceAddress;
    ContractWinnerInterface contractInstance;

    constructor(address _contract) {
        contractInstanceAddress = _contract;
        contractInstance = ContractWinnerInterface(_contract);
    }

    function relayMsgSender() external {
        (bool success, ) = contractInstanceAddress.call(
            abi.encodeWithSignature("attempt()")
        );
        require(success, "TxRelayer: relay failed");
    }

    function selfDestruct() external {
        selfdestruct(payable(msg.sender));
    }

    function testRelayer() external view returns (address) {
        (bool success, bytes memory data) = contractInstanceAddress.staticcall(
            abi.encodeWithSignature("testTxOrigin()")
        );
        require(success, "TxRelayer: relay failed");

        return abi.decode(data, (address));
    }
}
