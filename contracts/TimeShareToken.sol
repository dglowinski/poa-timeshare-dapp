pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/token/ERC20/PausableToken.sol";
import "openzeppelin-solidity/contracts/token/ERC20/DetailedERC20.sol";
import "openzeppelin-solidity/contracts/token/ERC20/MintableToken.sol";
import "openzeppelin-solidity/contracts/token/ERC20/BurnableToken.sol";
import "./libraries/DateTime.sol";

interface IParentToken {
    function getMetaData() external view returns (string);
}

//TODO deploy DateTime as external library
contract TimeShareToken is PausableToken, DetailedERC20, MintableToken, BurnableToken, DateTime {

    //booking one day costs one token
    uint256 public constant costPerDay = 10e17;

    //mapping from timestamp to address whiched booked the day
    mapping(uint256 => address) public renters;
    //is day rented by address
    mapping(address => mapping(uint256 => bool)) public daysBookedByAddress;

    modifier onlyIfSufficientBalance() {
        require(balances[msg.sender] >= costPerDay, "insufficient balance");
        _;
    }

    modifier onlyIfValidDate(uint256 _year, uint256 _month, uint256 _day) {
        require(_year >= 2018, "invalid year");
        require(_month >= 1 && _month <= 12, "invalid month");
        require(_day >= 1 && _day <= getDaysInMonth(uint8(_month), uint16(_year)), "invalid day");
        _;
    }

    event BookDay(address indexed renter, uint256 year, uint256 month, uint256 day);

    constructor()
        public
        DetailedERC20("Time share token", "TST", 18)
    {}

    ///@dev token cannot own Ξ (unless is a target of mining reward or self-destruct)
    function() external payable {
        revert("we don't accept ether, thank you");
    }
    
    ///@notice book the date to use the property
    ///@dev TODO - unbook the date, mint the token back to renter
    function bookDay(uint256 _year, uint256 _month, uint256 _day) 
        external 
        onlyIfSufficientBalance 
        onlyIfValidDate(_year, _month, _day) 
    {
        uint256 timestamp = toTimestamp(uint16(_year), uint8(_month), uint8(_day));
        require(renters[timestamp] == address(0), "date already booked");

        renters[timestamp] = msg.sender;
        daysBookedByAddress[msg.sender][timestamp] = true;

        burn(10e17);

        emit BookDay(msg.sender, _year, _month, _day);
    }

    ///@notice check if the date is available
    function isDayBooked(uint256 _year, uint256 _month, uint256 _day) 
        external 
        view
        onlyIfValidDate(_year, _month, _day) 
        returns (bool)
    {
        return renters[toTimestamp(uint16(_year), uint8(_month), uint8(_day))] != address(0);
    }

    ///@notice check if the access key is valid ie. that the signee did book this date
    ///Called by smart lock to open the door. 
    function isValidAccessKey(bytes32 data, uint8 v, bytes32 r, bytes32 s)
        external 
        view
        returns (bool)
    {
        address signee = ecrecover(data, v, r, s);
        return daysBookedByAddress[signee][uint256(data)];
    }

//     function verify(bytes32 hash, uint8 v, bytes32 r, bytes32 s) constant returns(bool) {
//     bytes memory prefix = "\x19Ethereum Signed Message:\n32";
//     bytes32 prefixedHash = keccak256(prefix, hash);
//     return ecrecover(prefixedHash, v, r, s) == (Your Address);
// }

    ///@notice get metadata of the property, it's the same as in the parent contract
    function getMetaData() external view returns (string) {
        return IParentToken(owner).getMetaData();
    }
}