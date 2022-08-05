pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract RatioNFT is ERC1155, Ownable {

    string[] public names; //string array of names [0,1] = [NFT, FRACTION] = [ERC721, ERC20]
    uint[] public ids; //uint array of ids
    string public baseMetadataURI; //the token metadata URI
    string public name; //the token mame
    uint public mintFee = 0 wei; //mintfee, 0 by default. only used in mint function, not batch.
    uint public goalAmount;
    uint public totalRaised;
    bool public goalMet = false;
    address paymentToken = 0x6b15A1104c7Fa74c8f6C7349D5A924C896a6ee44; // Fake DAI Mumbai
    address rewardToken;

    mapping(string => uint) public nameToId; //name to id mapping
    mapping(uint => string) public idToName; //id to name mapping

    mapping(address => uint) public supporters;
    mapping(address => uint) public supportersClaims;
    /*
    constructor is executed when the factory contract calls its own deployERC1155 method
    */
    constructor(string memory _contractName, string memory _uri, uint _goalAmount) ERC1155(_uri) {
        names = ["NFT", "FRACTIONS"];
        ids = [0, 1];
        // paymentToken = _paymentToken;
        goalAmount = _goalAmount;
        createMapping();
        setURI(_uri);
        baseMetadataURI = _uri;
        name = _contractName;
        transferOwnership(tx.origin);
    }   

    /*
    creates a mapping of strings to ids (i.e ["one","two"], [1,2] - "one" maps to 1, vice versa.)
    */
    function createMapping() private {
        for (uint id = 0; id < ids.length; id++) {
            nameToId[names[id]] = ids[id];
            idToName[ids[id]] = names[id];
        }
    }
    /*
    sets our URI and makes the ERC1155 OpenSea compatible
    */
    function uri(uint256 _tokenid) override public view returns (string memory) {
        return string(
            abi.encodePacked(
                baseMetadataURI,
                Strings.toString(_tokenid),".json"
            )
        );
    }

    function getNames() public view returns(string[] memory) {
        return names;
    }

    /*
    used to change metadata, only owner access
    */
    function setURI(string memory newuri) public onlyOwner {
        _setURI(newuri);
    }

    /*
    set a mint fee. only used for mint, not batch.
    */
    function setFee(uint _fee) public onlyOwner {
        mintFee = _fee;
    }

        /*
    mintRatio(address account, uint _id, uint256 amount)

    account - address to mint the token to
    _id - the ID being minted
    amount - amount of tokens to mint
    */
    function mintRatio(address account, uint _id, uint256 amount) 
        public payable onlyOwner returns (uint)
    {
        _mint(account, _id, amount, "");
        return _id;
    }

    // Use transfer method to withdraw an amount of money and for updating automatically the balance
    function withdrawAllFundsToAddress(address _to) public onlyOwner {
        IERC20 tokenContract = IERC20(paymentToken);        
        // transfer the token from address of this contract
        // to address of the user (executing the withdrawToken() function)
        tokenContract.transfer(_to, tokenContract.balanceOf(address(this)));
    }

    function deposit(uint _amount) public payable {
      // Check if goal is fulfilled
      require(totalRaised < goalAmount, "Goal already met");
      // Set the minimum amount to 1 token 
      uint _minAmount = 1*(10**18);
      require(_amount >= _minAmount, "Amount less than minimum amount");
      // I call the function of IERC20 contract to transfer the token from the user (that he's interacting with the contract) to
      // the smart contract  
      IERC20(paymentToken).transferFrom(msg.sender, address(this), _amount);
      // assigns supporter to map
      supporters[msg.sender] = _amount;
      // increases raised
      totalRaised += _amount;
      if(totalRaised >= goalAmount) goalMet = true;
    }

    // This function allow you to see how many tokens have the smart contract 
    function getContractBalance() public onlyOwner view returns(uint){
      return IERC20(paymentToken).balanceOf(address(this));
    }

    // to = Account B's address
    function transferFunds(address to, uint amount) public onlyOwner {
        IERC20(paymentToken).transfer(to, amount);
    }

    function claimFractions() public returns(uint){
      require(goalMet == true, "Funding goal haven't been met");
      uint fractions = supporters[msg.sender] / totalRaised * 100;
      require(fractions != supportersClaims[msg.sender], "User already claimed");
      _mint(msg.sender, 1, fractions, "");
      supportersClaims[msg.sender] = fractions;
      return fractions;
    }

    /*
    mint(address account, uint _id, uint256 amount)

    account - address to mint the token to
    _id - the ID being minted
    amount - amount of tokens to mint
    */
    // function mint(address account, uint _id, uint256 amount) 
    //     public payable returns (uint)
    // {
    //     require(msg.value == mintFee);
    //     _mint(account, _id, amount, "");
    //     return _id;
    // }

    /*
    mintBatch(address to, uint256[] memory _ids, uint256[] memory amounts, bytes memory data)

    to - address to mint the token to
    _ids - the IDs being minted
    amounts - amount of tokens to mint given ID
    bytes - additional field to pass data to function
    */
    // function mintBatch(address to, uint256[] memory _ids, uint256[] memory amounts, bytes memory data)
    //     public
    // {
    //     _mintBatch(to, _ids, amounts, data);
    // }
}