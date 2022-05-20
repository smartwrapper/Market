// //SPDX-License-Identifier: MIT
 pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol"; // security against transactions for multiple requests
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";


import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "./NFT.sol";

contract Marketplace is Ownable, ReentrancyGuard {
    using Counters for Counters.Counter;

    Counters.Counter public itemIds;
    Counters.Counter public Count_Minted;
    Counters.Counter public Count_listed;
    address public ArtLuxNFTAddr;

    uint256 public royalties = 10;

    struct MarketItem {
        address nftContract;
        uint256 tokenId;
        address payable holder;
        uint256 price;
        bool listed;
    }

    // tokenId return which MarketToken
    mapping(uint256 => MarketItem) public idToMarketItem;
    // Id List return by holder
    mapping(address => uint256[]) private holderToItems;

    // listen to events from front end applications
    event MarketItemMinted(
        address indexed nftContract,
        uint256 indexed tokenId,
        address holder,
        uint256 price,
        uint256 timeStamp
    );

    event MarketItemListed(
        address indexed nftContract,
        uint256 indexed tokenId,
        address holder,
        uint256 price,
        uint256 timeStamp
    );

    event MarketItemPurchased(
        address indexed nftContract,
        uint256 indexed tokenId,
        address from,
        address to,
        uint256 price,
        uint256 timeStamp
    );

    constructor() {

    }
    
    function setArtlux(address addr) public onlyOwner {
        ArtLuxNFTAddr = addr;
    }

    // function check_minted(uint256 id) public view returns (bool) {
    //     return idToMarketItem[id].minted;
    // }


    // function makeMarketItem(uint256 id) public onlyOwner {
    //     uint256 price = 1 ether;
    //     idToMarketItem[id] = MarketItem(
    //         address(0),
    //         id,
    //         payable(address(0)),
    //         price
    //     );
    // }
   
    function claim(address payable receiver) external onlyOwner {
        receiver.transfer(address(this).balance);
    }

    // @notice function to create a market to put it up for sale
    // @params _nftContract
    function mintMarketItem(
        string memory _tokenURI
    ) public /*payable nonReentrant*/ onlyOwner{
        uint256 _tokenId=ArtLuxNFT(ArtLuxNFTAddr).mintToken(_tokenURI);

        uint256 id = Count_Minted.current();
        //putting it up for sale
        
        idToMarketItem[id] = MarketItem(
            ArtLuxNFTAddr,
            _tokenId,
            payable(msg.sender),
            1 ether,
            false
        );

        IERC721(ArtLuxNFTAddr).transferFrom(address(this), msg.sender, _tokenId);
        
        addItemsbyHolder(msg.sender, _tokenId);

        emit MarketItemMinted(
            ArtLuxNFTAddr,
            _tokenId,
            msg.sender,
            0,
            block.timestamp
        );
        
        ArtLuxNFT(ArtLuxNFTAddr).setApprovalForAll(ArtLuxNFTAddr, true);
        Count_Minted.increment();
    }

    function gettokenURI(uint256 _id) public view returns(string memory) {
        string memory result_str = ArtLuxNFT(ArtLuxNFTAddr).tokenURI(_id);
        return result_str;
    }

    function ownerOf(uint256 _id) public view returns(address){
        address addr = ArtLuxNFT(ArtLuxNFTAddr).ownerOf(_id);
        return addr;
    }

    function balanceOf(address _addr) public view returns(uint256){
        return ArtLuxNFT(ArtLuxNFTAddr).balanceOf(_addr);
    }

//     function dropNFTById(uint256 _id) public onlyHolder(_id){
//         idToMarketItem[_id].listed = false;
//         Count_Listed.decrement();
//     }

    function updatePriceById(uint256 _id, uint256 _price,bool listed) public onlyHolder(_id) {
        require(msg.sender == ownerOf(_id), "2.You are not owner of Token.");

        idToMarketItem[_id].price = _price;
        idToMarketItem[_id].listed=listed;
        Count_listed.increment();
        emit MarketItemListed(
            ArtLuxNFTAddr,
            _id,
            msg.sender,
            _price,
            block.timestamp
        );
    }

    function getPriceById(uint256 _id) public view returns (uint256) {
        return idToMarketItem[_id].price;
    }

    function purchaseItem(uint256 _id) public payable {
        require(idToMarketItem[_id].price <= msg.value, "Not enough BNB to purchase item.");
        require(idToMarketItem[_id].listed == true);

        IERC721(ArtLuxNFTAddr).transferFrom(idToMarketItem[_id].holder, msg.sender, _id);

        addItemsbyHolder(msg.sender, _id);
        removeItemsbyHolder(idToMarketItem[_id].holder, _id);
        uint256 totalprice = idToMarketItem[_id].price * 98 / 100;

        payable(idToMarketItem[_id].holder).transfer(totalprice);

        emit MarketItemPurchased(
            ArtLuxNFTAddr,
            _id,
            idToMarketItem[_id].holder,
            msg.sender,
            idToMarketItem[_id].price,
            block.timestamp
        );

        idToMarketItem[_id].holder = payable(msg.sender);
        idToMarketItem[_id].listed=false;
        Count_listed.decrement();
        ArtLuxNFT(ArtLuxNFTAddr).setApprovalForAll(ArtLuxNFTAddr, true);
    }

    function addItemsbyHolder(address _holder, uint256 _id) private {
        holderToItems[_holder].push(_id);
    }

    function itemsbyholder(address _holder) public view returns (uint256[] memory) {
        return holderToItems[_holder];
    }

    function removeItemsbyHolder(address _holder, uint256 _id) private {
        uint256 _len = holderToItems[_holder].length;
        for (uint256 index = 0; index < _len; index++) {
            if(holderToItems[_holder][index] == _id){
                holderToItems[_holder][index] = holderToItems[_holder][_len-1];
                holderToItems[_holder].pop();
                break;
            }
        }
    }

    // return nfts that the user has purchased
    function fetchMyNFTs(address _holder) public view returns (MarketItem[] memory) {
        uint256[] memory tmp_items = itemsbyholder(_holder);
        MarketItem[] memory items = new MarketItem[](tmp_items.length);
        
        for (uint256 index = 0; index < tmp_items.length; index++) {
            items[index] = idToMarketItem[tmp_items[index]];
        }

        return items;
    }

    function setRoyalties(uint256 _royalties) external onlyOwner {
        royalties = _royalties;
    }
    function getListedNFTs() public view returns(MarketItem[] memory){
        MarketItem[] memory items = new MarketItem[](Count_listed.current()+1);
        uint256 cc=0;
        for(uint index=0;index<=Count_Minted.current();index++){
            if(idToMarketItem[index].listed){
                items[cc] = idToMarketItem[index];
                cc++;
            }
        }
        return items;
    }
    modifier onlyHolder(uint256 _nftId) {
        require(
            msg.sender == idToMarketItem[_nftId].holder,
            "Authorization denied"
        );
        _;
    }
}
