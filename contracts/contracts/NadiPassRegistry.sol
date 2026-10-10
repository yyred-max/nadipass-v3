// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract NadiPassRegistry {
    event BreakGlassLogged(
        bytes32 indexed patientId,
        bytes32 dataHash,
        bytes32 reasonHash,
        uint256 timestamp
    );

    function logBreakGlass(
        bytes32 patientId,
        bytes32 dataHash,
        bytes32 reasonHash
    ) external {
        emit BreakGlassLogged(patientId, dataHash, reasonHash, block.timestamp);
    }
}