// SPDX-License-Identifier: MIT
// (c)2024 Atlas (atlas@vialabs.io)
pragma solidity =0.8.17;

import "@vialabs-io/contracts/message/MessageClient.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "base64-sol/base64.sol";

contract PetNFT is ERC721, MessageClient {
    struct ShelterData {
        string name;
        string location;
        string website;
        string email;
        string phone;
    }

    struct PetData {
        uint lastWalk;
        uint lastFeed;
        uint lastPlay;
        uint lastTreat;

        uint totalWalks;
        uint totalFeeds;
        uint totalPlays;
        uint totalTreats;

        string name;
        uint age;
        uint weight;
        string breed;
        string color;
        string personality;
        uint shelterId;
    }

    uint public nextNftId;
    mapping(uint => PetData) public pets;
    mapping(uint => ShelterData) public shelters;

    constructor() ERC721("PetNFT", "PetNFT") {
        nextNftId = block.chainid * 10**4;
    }

    function walk(uint _nftId) external {
        require(ownerOf(_nftId) == msg.sender, "PetNFT: caller is not the owner of the nft");

        PetData storage pet = pets[_nftId];
        pet.lastWalk = block.timestamp;
        pet.totalWalks++;
    }

    function feed(uint _nftId) external {
        require(ownerOf(_nftId) == msg.sender, "PetNFT: caller is not the owner of the nft");

        PetData storage pet = pets[_nftId];
        pet.lastFeed = block.timestamp;
        pet.totalFeeds++;
    }

    function play(uint _nftId) external {
        require(ownerOf(_nftId) == msg.sender, "PetNFT: caller is not the owner of the nft");

        PetData storage pet = pets[_nftId];
        pet.lastPlay = block.timestamp;
        pet.totalPlays++;
    }

    function treat(uint _nftId) external {
        require(ownerOf(_nftId) == msg.sender, "PetNFT: caller is not the owner of the nft");

        PetData storage pet = pets[_nftId];
        pet.lastTreat = block.timestamp;
        pet.totalTreats++;
    }

    // Admin Functions
    function addShelter(uint _nftId, string memory _name, string memory _location, string memory _website, string memory _email, string memory _phone) external onlyOwner {
        ShelterData storage shelter = shelters[_nftId];
        shelter.name = _name;
        shelter.location = _location;
        shelter.website = _website;
        shelter.email = _email;
        shelter.phone = _phone;
    }

    function addPet(string memory _name, uint _age, uint _weight, string memory _breed, string memory _color, string memory _personality, uint _shelterId) external onlyOwner {
        _mint(msg.sender, nextNftId);
        nextNftId++;

        PetData storage pet = pets[nextNftId];
        pet.name = _name;
        pet.age = _age;
        pet.weight = _weight;
        pet.breed = _breed;
        pet.color = _color;
        pet.personality = _personality;
        pet.shelterId = _shelterId;
    }

    function bridge(uint _destChainId, address _recipient, uint _nftId) external onlyActiveChain(_destChainId) {
        require(ownerOf(_nftId) == msg.sender, "PetNFT: caller is not the owner of the nft");

        string memory _nftMetadata = abi.encode(
            pets[_nftId].name,
            pets[_nftId].age,
            pets[_nftId].weight,
            pets[_nftId].breed,
            pets[_nftId].color,
            pets[_nftId].personality,
            pets[_nftId].shelterId,
            pets[_nftId].lastWalk,
            pets[_nftId].lastFeed,
            pets[_nftId].lastPlay,
            pets[_nftId].lastTreat,
            pets[_nftId].totalWalks,
            pets[_nftId].totalFeeds,
            pets[_nftId].totalPlays,
            pets[_nftId].totalTreats
        );

        _burn(_nftId);

        _sendMessage(_destChainId, abi.encode(_recipient, _nftId, _nftMetadata));
    }

    function messageProcess(uint, uint _sourceChainId, address _sender, address, uint, bytes calldata _data) external override  onlySelf(_sender, _sourceChainId)  {
        // decode message
        (address _recipient, uint _nftId, string memory _nftMetadata) = abi.decode(_data, (address, uint, string));

        // parse metadata
        (
            string memory _name, 
            uint _age, 
            uint _weight, 
            string memory _breed, 
            string memory _color, 
            string memory _personality, 
            uint _shelterId, 
            uint _lastWalk, 
            uint _lastFeed, 
            uint _lastPlay, 
            uint _lastTreat, 
            uint _totalWalks, 
            uint _totalFeeds, 
            uint _totalPlays, 
            uint _totalTreats
        ) = abi.decode(_nftMetadata, (string, uint, uint, string, string, string, uint, uint, uint, uint, uint, uint, uint, uint, uint));

        // mint tokens
        _mint(_recipient, _nftId);
    }

    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        require(_exists(tokenId), "ERC721Metadata: URI query for nonexistent token");

        return string(abi.encodePacked('data:application/json;base64,', 
            Base64.encode(bytes(abi.encodePacked(
                "{\"name\":\"Pet #", tokenId, "\",",
                "\"description\":\"Pet NFT\",",
                "\"image\":\"\",",
                "\"attributes\":[",
                    "{\"trait_type\":\"Name\",\"value\":\"", pets[tokenId].name, "\"},",
                    "{\"trait_type\":\"Age\",\"value\":\"", pets[tokenId].age, "\"},",
                    "{\"trait_type\":\"Weight\",\"value\":\"", pets[tokenId].weight, "\"},",
                    "{\"trait_type\":\"Breed\",\"value\":\"", pets[tokenId].breed, "\"},",
                    "{\"trait_type\":\"Color\",\"value\":\"", pets[tokenId].color, "\"},",
                    "{\"trait_type\":\"Personality\",\"value\":\"", pets[tokenId].personality, "\"}",
                    "{\"trait_type\":\"Shelter\",\"value\":\"", shelters[pets[tokenId].shelterId].name, "\"}",
                    "{\"trait_type\":\"Location\",\"value\":\"", shelters[pets[tokenId].shelterId].location, "\"}",
                    "{\"trait_type\":\"Website\",\"value\":\"", shelters[pets[tokenId].shelterId].website, "\"}",
                    "{\"trait_type\":\"Email\",\"value\":\"", shelters[pets[tokenId].shelterId].email, "\"}",
                "]}"
            )))
        ));
    }
}