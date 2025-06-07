// SPDX-License-Identifier: MIT

pragma solidity ^0.8.18;

import {TimelockController} from "@openzeppelin/contracts/governance/TimelockController.sol";

contract Timelock is TimelockController {
    /**
     * @notice Create a new Timelock controller
     * @param minDelay Minimum delay for timelock executions
     * @param proposers List of addresses that can propose new transactions
     * @param executors List of addresses that can execute transactions
     */
    constructor(uint256 minDelay, address[] memory proposers, address[] memory executors)
        TimelockController(minDelay, proposers, executors, msg.sender)
    {}
}