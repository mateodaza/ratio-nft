pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract RatioNFT is ERC721 {
    // uint256 public totalMints = 0;
    // address public owner;
    uint256 public maxSupply = 1;
    string public URI;

    constructor(string memory _name, string memory _symbol, string memory _uri) ERC721(_name, _symbol) {
        URI = _uri;
        _safeMint(msg.sender, 1);
    }


    // function mintUniqueEdition() public {
    //     require(totalMints == 0, "Already minted");
    //     _safeMint(msg.sender, 1);
    //     totalMints++;
    //     owner = msg.sender;
    // }
}