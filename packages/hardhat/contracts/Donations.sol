// SPDX-License-Identifier: MIT
// (c)2024 Atlas (atlas@vialabs.io)
pragma solidity =0.8.17;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Donations {
    struct Message {
        address sender;
        uint256 timestamp;
        string message;
        uint256 amount;
        bool isUSDC;
    }

    Message[] public messages;
    uint256 public totalDonations;
    address public treasuryAddress;
    address public owner;
    IERC20 public usdcToken;

    event DonationReceived(address indexed sender, uint256 amount, string message, bool isUSDC);
    event TreasuryAddressUpdated(address indexed oldAddress, address indexed newAddress);
    event USDCTokenUpdated(address indexed oldAddress, address indexed newAddress);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not authorized");
        _;
    }

    constructor(address _treasuryAddress, address _usdcAddress) {
        treasuryAddress = _treasuryAddress;
        owner = msg.sender;
        usdcToken = IERC20(_usdcAddress);
    }

    function updateTreasuryAddress(address _newTreasuryAddress) public onlyOwner {
        require(_newTreasuryAddress != address(0), "Invalid address");
        emit TreasuryAddressUpdated(treasuryAddress, _newTreasuryAddress);
        treasuryAddress = _newTreasuryAddress;
    }

    function updateUSDCAddress(address _newUSDCAddress) public onlyOwner {
        require(_newUSDCAddress != address(0), "Invalid address");
        emit USDCTokenUpdated(address(usdcToken), _newUSDCAddress);
        usdcToken = IERC20(_newUSDCAddress);
    }

    function donate(string memory _message) public payable {
        require(msg.value > 0, "Donation amount must be greater than zero");
        require(treasuryAddress != address(0), "Treasury address not set");

        totalDonations += msg.value;

        messages.push(Message({
            sender: msg.sender,
            timestamp: block.timestamp,
            message: _message,
            amount: msg.value,
            isUSDC: false
        }));

        (bool success, ) = treasuryAddress.call{value: msg.value}("");
        require(success, "Transfer failed");

        emit DonationReceived(msg.sender, msg.value, _message, false);
    }

    function donateUSDC(uint256 _amount, string memory _message) public {
        require(_amount > 0, "Donation amount must be greater than zero");
        require(treasuryAddress != address(0), "Treasury address not set");
        require(address(usdcToken) != address(0), "USDC token address not set");

        require(usdcToken.transferFrom(msg.sender, treasuryAddress, _amount), "USDC transfer failed");

        totalDonations += _amount;

        messages.push(Message({
            sender: msg.sender,
            timestamp: block.timestamp,
            message: _message,
            amount: _amount,
            isUSDC: true
        }));

        emit DonationReceived(msg.sender, _amount, _message, true);
    }

    function getMessages(uint256 _count) public view returns (Message[] memory) {
        uint256 messageCount = messages.length;
        if (_count > messageCount) {
            _count = messageCount;
        }

        Message[] memory recentMessages = new Message[](_count);
        for (uint256 i = 0; i < _count; i++) {
            recentMessages[i] = messages[messageCount - i - 1];
        }
        return recentMessages;
    }
}
