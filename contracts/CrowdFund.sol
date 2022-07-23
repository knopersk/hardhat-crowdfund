// SPDX-License-Identifier: MIT

/**
A simple crowdfunding contract with a goal of optimizing gas costs.

Bob, don't ask questions, just HODL...
 */

pragma solidity ^0.8.8;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "./PriceConverter.sol";

error CrowdFund__NotOwner();
error CrowdFund__SpendMoreEth();

contract CrowdFund {
    using PriceConverter for uint256;

    mapping(address => uint256) private addressToAmountFunded;
    address[] private funders;
    address private immutable i_owner;
    uint256 public constant MINIMUM_USD = 70 * 10**18; //$70
    AggregatorV3Interface private priceFeed;

    modifier onlyOwner() {
        if (msg.sender != i_owner) revert CrowdFund__NotOwner();
        _;
    }
    modifier notEnoughEth() {
        if (msg.value.getConversionRate(priceFeed) <= MINIMUM_USD)
            revert CrowdFund__SpendMoreEth();
        _;
    }

    constructor(address priceFeedAddress) {
        i_owner = msg.sender;
        priceFeed = AggregatorV3Interface(priceFeedAddress);
    }

    /**
     * @dev This is the function that funds the contract,
     * with a minimum funding value being $70.
     *
     * Why $70?...idk, I like this number.
     *
     * New funder is added to the funders array.
     */
    function fund() public payable notEnoughEth {
        addressToAmountFunded[msg.sender] = msg.value;
        funders.push(msg.sender);
    }

    /**
     * @dev This is the function that allows to
     * withdraw all of the funds from the contract.
     *
     * Only the owner of a contract can withdraw.
     *
     * `addressToAmountFunded` mapping is being reset.
     *
     * Funders array is set to "0".
     */
    function withdraw() public payable onlyOwner {
        for (
            uint256 funderIndex = 0;
            funderIndex < funders.length;
            funderIndex++
        ) {
            address funder = funders[funderIndex];
            addressToAmountFunded[funder] = 0;
        }
        funders = new address[](0);

        (bool callSuccess, ) = payable(msg.sender).call{
            value: address(this).balance
        }("");
        require(callSuccess);
    }

    /** Getter Functions */

    function getOwner() public view returns (address) {
        return i_owner;
    }

    function getFunder(uint256 index) public view returns (address) {
        return funders[index];
    }

    function getAddressToAmountFunded(address funder)
        public
        view
        returns (uint256)
    {
        return addressToAmountFunded[funder];
    }

    function getPriceFeed() public view returns (AggregatorV3Interface) {
        return priceFeed;
    }
}
