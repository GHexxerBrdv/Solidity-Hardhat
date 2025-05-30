// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {VRFConsumerBaseV2} from "@chainlink/contracts/src/v0.8/vrf/VRFConsumerBaseV2.sol";
import {VRFCoordinatorV2} from "@chainlink/contracts/src/v0.8/vrf/VRFCoordinatorV2.sol";
import {AutomationCompatibleInterface} from "@chainlink/contracts/src/v0.8/automation/interfaces/AutomationCompatibleInterface.sol";
// import {VRFV2PlusClient} from "@chainlink/contracts/src/v0.8/dev/vrf/libraries/VRFV2PlusClient.sol";

contract Raffle is VRFConsumerBaseV2, AutomationCompatibleInterface {
    enum RaffleState {
        OPEN,
        CALCULATING
    }

    uint256 private immutable i_entranceFee;
    address payable[] private  s_players;
    VRFCoordinatorV2 private immutable i_vrfCoordinator;
    bytes32 private immutable i_ganLane;
    uint64 private immutable i_subscriptionId;
    uint32 private immutable i_callbackGasLimit;
    uint16 private constant REQUEST_CONFIRMATIONS = 3;
    uint32 private constant NUM_WORDS = 1;
    uint256 private s_lastTimestamp;
    uint256 private immutable i_interval;


    RaffleState private s_raffleState;

    address private s_recentWinner;

    event RaffleEnter(address indexed player);
    event RequestedRaffleWinner(uint256 indexed requestId); 
    event WinnerPicked(address indexed winner);

    error Raffle__NotEnoughETHSent();
    error Raffle__TransferFailed();
    error Raffle__LotteryIsClosed();
    error Raffle__UpkeedNotNeeded();

    constructor(address vrfCoordinatorV2, uint256 entranceFee, bytes32 gasLane, uint64 subscriptionId, uint32 callbackGasLimit, uint256 interval) VRFConsumerBaseV2(vrfCoordinatorV2) {
        i_entranceFee = entranceFee;
        i_vrfCoordinator = VRFCoordinatorV2(vrfCoordinatorV2);
        i_ganLane = gasLane;
        i_subscriptionId = subscriptionId;
        i_callbackGasLimit = callbackGasLimit;
        s_raffleState = RaffleState.OPEN;
        s_lastTimestamp = block.timestamp;
        i_interval = interval;
    }

    function enterRaffle() external payable {
        if(s_raffleState != RaffleState.OPEN) {
            revert Raffle__LotteryIsClosed();
        }
        if(msg.value < i_entranceFee) {
            revert Raffle__NotEnoughETHSent();
        }

        s_players.push(payable(msg.sender));
        emit RaffleEnter(msg.sender);
    }

    function checkUpkeep(bytes memory /*checkData*/) public override returns(bool upkeepNeeded, bytes memory /* performData */ ) {
        bool isOpen = (RaffleState.OPEN == s_raffleState);
        bool timePassed = ((block.timestamp - s_lastTimestamp) >= i_interval);
        bool hasPlayer = (s_players.length > 0);
        bool hsaBalance = (address(this).balance > 0);
        upkeepNeeded = (isOpen && timePassed && hasPlayer && hsaBalance);

    }

    function performUpkeep(bytes calldata /* performData */) external override {

        (bool upkeepNeeded,) = checkUpkeep("");
        if(!upkeepNeeded) {
            revert Raffle__UpkeedNotNeeded();
        }

        s_raffleState = RaffleState.CALCULATING;
        uint256 requestId = i_vrfCoordinator.requestRandomWords(
            i_ganLane,
            i_subscriptionId,
            REQUEST_CONFIRMATIONS,
            i_callbackGasLimit,
            NUM_WORDS
        );

        emit RequestedRaffleWinner(requestId);
    }


    function fulfillRandomWords(uint256 /*requestId*/, uint256[] memory randomWords) internal override {
        uint256 indexOfWinner = randomWords[0] % s_players.length;
        address payable recentwinner = s_players[indexOfWinner];
        s_recentWinner = recentwinner;
        s_players = new address payable[](0);
        s_lastTimestamp = block.timestamp;
        (bool ok,) = recentwinner.call{value: address(this).balance}("");

        if(!ok) {
            revert Raffle__TransferFailed();
        }

        emit WinnerPicked(recentwinner);
    }

    function getEntraceFee() public view returns(uint256) {
        return i_entranceFee;
    }

    function getPlayer(uint256 index) public view returns(address) {
        return s_players[index];
    }

    function getNumbersOfPlayers() public view returns(uint256) {
        return s_players.length;
    }

    function getRecentWinner() public view returns(address) {
        return s_recentWinner;
    }

    function getRaffleState() public view returns(RaffleState) {
        return s_raffleState;
    }

    function getNumWords() public pure returns(uint256) {
        return NUM_WORDS;
    }

    function getInterval() public view returns(uint256) {
        return i_interval;
    }

    function getLastTimestamp() public view returns(uint256) {
        return s_lastTimestamp;
    }
}