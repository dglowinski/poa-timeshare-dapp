pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/token/ERC20/PausableToken.sol";
import "openzeppelin-solidity/contracts/token/ERC20/DetailedERC20.sol";
import "./TimeShareToken.sol";


contract PoAToken is PausableToken, DetailedERC20 {
    ///@dev instead of keeping time share balance, we could simply mint time share token
    ///but this would make every transfer consume a little more gas, and would be subjectively less clean
    struct TimeShare {
        uint256 lastBlockNumber;
        uint256 lastBalance;
    }

    /**
      @dev for simplicity I use blocks as measurement of time, assuming that using average block
      time https://etherscan.io/chart/blocktime we can calculate the duration an address is holding tokens
      For production implementation this would need to be calculated more precisely

      Also speeding up time for demonstration purposes
    */
    uint256 public constant blocksInYear = 730;
    //this also would need to be calculated dynamically
    uint256 public constant daysInYear = 365;  
    
    TimeShareToken timeShareToken;
    //price of tokens
    uint256 public tokensForEther;
    //description of property and perhaps a link to additional meta like photo gallery
    string public metaData;
    address public propertySeller;
    
    mapping(address => TimeShare) public timeShares;

    //no need to log block number explicitly
    event UpdateTimeShare(address indexed owner, uint256 balance);
    event ClaimTimeShareTokens(address indexed claimer, uint256 amount);

    constructor(
        address _propertySeller, 
        uint256 _totalSupply, 
        uint256 _tokensForEther, 
        string _metaData
    ) 
        public
        DetailedERC20("PoA Token", "PoA", 18)
    {
        propertySeller = _propertySeller;
        totalSupply_ = _totalSupply;
        tokensForEther = _tokensForEther;
        //TODO put metadata on swarm
        metaData = _metaData;
        balances[propertySeller] = totalSupply_;

        //if the code size grows, this would be better accomplished by deploying 
        //tokens separately, passing TST address to constructor 
        //and transfering ownership of TST to PoA
        timeShareToken = new TimeShareToken(); 

        updateTimeShare(propertySeller);

        emit Transfer(address(0), propertySeller, totalSupply_);
    }

    ///@notice fall back payable function to buy tokens for Ξ
    ///propertySeller can buy back the tokens and resell them, if it makes sense for him
    function() 
        external 
        payable 
    {
        uint256 buyAmount = msg.value.mul(tokensForEther);
        require(buyAmount <= balances[propertySeller], "Not enough tokens left");
        
        balances[propertySeller] = balances[propertySeller].sub(buyAmount);
        balances[msg.sender] = balances[msg.sender].add(buyAmount);

        updateTimeShare(propertySeller);
        updateTimeShare(msg.sender);
        
        propertySeller.transfer(msg.value);
    }

    ///@notice create TST for the message sender from available balance 
    function claimTimeShareTokens(uint256 _amount) 
        external 
    {
        require(address(timeShareToken) != address(0), "TST unavailable");

        uint256 currentBalance = timeShareBalanceOf(msg.sender); 
        require(_amount <= currentBalance, "insufficient balance");

        timeShares[msg.sender].lastBalance = currentBalance.sub(_amount);
        timeShares[msg.sender].lastBlockNumber = block.number;

        require(timeShareToken.mint(msg.sender, _amount), "minting TST failed");

        emit UpdateTimeShare(msg.sender, timeShares[msg.sender].lastBalance);
        emit ClaimTimeShareTokens(msg.sender, _amount);
    }

    ///@notice get amount of tokens available for sale
    ///@return number of tokens available for sale 
    function getTokensForSaleAvailable() 
        external 
        view 
        returns (uint256) 
    {
        return balances[propertySeller];
    }

    ///@notice get property meta data
    ///@return property meta data
    function getMetaData() 
        external 
        view 
        returns (string) 
    {
        return metaData;
    }

    ///@notice get the address of time share token
    ///@return TST address
    function getTimeShareTokenAddress() 
        external 
        view 
        returns (address) 
    {
        return address(timeShareToken);
    }

    ///@dev override standard transfer method
    function transfer(
        address _to, 
        uint256 _value
    ) 
        public 
        returns (bool) 
    {
        require(super.transfer(_to, _value), "transfer failed");

        updateTimeShare(msg.sender);
        updateTimeShare(_to);

        return true;
    }

    ///@dev override standard transferFrom method
    function transferFrom(
        address _from, 
        address _to, 
        uint256 _value
    ) 
        public 
        returns (bool) 
    {
        require(super.transferFrom(_from, _to, _value), "transferFrom failed");

        updateTimeShare(_from);
        updateTimeShare(_to);

        return true;
    }

    /**
      @notice get time share balance available to _address at current block
      @dev formula to calculate the amount of TST the address is entitled at block:
      x = last_updated_balance + holding_duration/blocks_in_year * days_in_year * percentage_of_tokens_owned
      where 
      holding_duration = block.number - last_updated_block_number
      percentage_of_tokens_owned = balance / total_supply
      @return time share balance
    */
    function timeShareBalanceOf(address _address) 
        public 
        view 
        returns (uint256) 
    {
        TimeShare storage timeShare = timeShares[_address];

        return timeShare.lastBlockNumber == 0 
            ? 0 
            : timeShare.lastBalance
            .add(
                block.number
                .sub(timeShare.lastBlockNumber)
                .mul(balances[_address])
                .mul(daysInYear)
                .mul(10e17)
                .div(blocksInYear.mul(totalSupply_))
            );
    }

    ///@notice update time share balance available to _address at current block
    function updateTimeShare(address _address) 
        internal 
    {
        TimeShare storage timeShare = timeShares[_address];

        if(timeShare.lastBlockNumber != 0) {
            timeShare.lastBalance = timeShareBalanceOf(_address);
        }
        
        timeShare.lastBlockNumber = block.number; 

        emit UpdateTimeShare(_address, timeShare.lastBalance);
    }
}