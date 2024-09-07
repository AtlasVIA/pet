// SPDX-License-Identifier: MIT
// (c)2024 Atlas (atlas@vialabs.io)
pragma solidity =0.8.17;

import "@vialabs-io/contracts/message/MessageClient.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "base64-sol/base64.sol";

contract PetNFT is ERC721, MessageClient {
    uint public nextNftId;

    constructor() ERC721("PetNFT", "PetNFT") {
        nextNftId = block.chainid * 10**4;
    }

    function mint() external {
        _mint(msg.sender, nextNftId);
        nextNftId++;
    }

    function walk(uint _nftId) external {
        require(ownerOf(_nftId) == msg.sender, "PetNFT: caller is not the owner of the nft");
    }

    function feed(uint _nftId) external {
        require(ownerOf(_nftId) == msg.sender, "PetNFT: caller is not the owner of the nft");
    }

    function play(uint _nftId) external {
        require(ownerOf(_nftId) == msg.sender, "PetNFT: caller is not the owner of the nft");
    }

    function treat(uint _nftId) external {
        require(ownerOf(_nftId) == msg.sender, "PetNFT: caller is not the owner of the nft");
    }

    function bridge(uint _destChainId, address _recipient, uint _nftId) external onlyActiveChain(_destChainId) {
        require(ownerOf(_nftId) == msg.sender, "PetNFT: caller is not the owner of the nft");

        _burn(_nftId);

        // send cross chain message
        _sendMessage(_destChainId, abi.encode(_recipient, _nftId));
    }

    function messageProcess(uint, uint _sourceChainId, address _sender, address, uint, bytes calldata _data) external override  onlySelf(_sender, _sourceChainId)  {
        // decode message
        (address _recipient, uint _nftId) = abi.decode(_data, (address, uint));

        // mint tokens
        _mint(_recipient, _nftId);
    }

    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        require(_exists(tokenId), "ERC721Metadata: URI query for nonexistent token");

        return string(abi.encodePacked('data:application/json;base64,', 
            Base64.encode(bytes(abi.encodePacked(
                '{"name":"PetNFT #', tokenId, '", "description":".PetNFT", "image":"https:///"}')
            )))
        );
    }
}