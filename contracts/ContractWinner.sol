// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

contract ContractWinner {
    event Winner(address);

    function attempt() external {
        require(msg.sender != tx.origin, "msg.sender is equal to tx.origin");
        emit Winner(msg.sender);
    }

    function testTxOrigin() external view returns (address) {
        return tx.origin;
    }
}
