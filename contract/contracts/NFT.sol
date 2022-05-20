//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
contract ArtLuxNFT is ERC721URIStorage , Ownable {
    using Counters for Counters.Counter;
    using Strings for uint256;
    Counters.Counter private _tokenIds;
    string public _artluxURI;   //base uri

    constructor() ERC721("ArtLuxNFT", "ALN") {
        _artluxURI = "";
    }
    
    /**
     * @dev Base URI for computing {tokenURI}. If set, the resulting URI for each
     * token will be the concatenation of the `baseURI` and the `tokenId`. Empty
     * by default, can be overriden in child contracts.
     */
    function _baseURI() internal view override returns (string memory) {
        return _artluxURI;
    }

    // function mintToken(uint256 id) public {
    //     _mint(msg.sender, id);
    // }
    function mintToken(string memory token_uri) public onlyOwner returns(uint256) {
        
        uint256 newItemId = _tokenIds.current();
        _mint(msg.sender,newItemId);
        _setTokenURI(newItemId,token_uri);
        _tokenIds.increment();
        return newItemId;

    }
    function burnToken (uint256 token_id) public onlyOwner {
        if(!_exists(token_id))
        return;
        _burn(token_id);
    }
}
