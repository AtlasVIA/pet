// SPDX-License-Identifier: MIT
// (c)2024 Atlas (atlas@vialabs.io)
pragma solidity =0.8.17;

import "@vialabs-io/contracts/message/MessageClient.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "base64-sol/base64.sol";

contract PetNFT is ERC721, Ownable, MessageClient {
    struct ShelterData {
        string name;
        string location;
        string website;
        string email;
    }

    struct PetData {
        uint lastWalk;
        uint lastFeed;
        uint lastTreat;

        uint totalWalks;
        uint totalFeeds;
        uint totalTreats;

        string name;
        string personality;
        uint shelterId;
    }

    uint public nextNftId;
    uint public nextShelterId;
    mapping(uint => PetData) public pets;
    mapping(uint => ShelterData) public shelters;
    mapping(uint => mapping(address => bool)) public shelterManagers;

    constructor() ERC721("PetNFT", "PetNFT") {
        nextNftId = block.chainid * 10**4;
        nextShelterId = block.chainid * 10**4;
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

    function treat(uint _nftId) external {
        require(ownerOf(_nftId) == msg.sender, "PetNFT: caller is not the owner of the nft");

        PetData storage pet = pets[_nftId];
        pet.lastTreat = block.timestamp;
        pet.totalTreats++;
    }

    // Admin Functions
    function addShelter(string memory _name, string memory _location, string memory _website, string memory _email) external onlyOwner {
        ShelterData storage shelter = shelters[nextShelterId];
        shelter.name = _name;
        shelter.location = _location;
        shelter.website = _website;
        shelter.email = _email;

        nextShelterId++;
    }

    function addShelterManager(uint _shelterId, address _manager) external onlyOwner {
        shelterManagers[_shelterId][_manager] = true;
    }

    function removeShelterManager(uint _shelterId, address _manager) external onlyOwner {
        delete shelterManagers[_shelterId][_manager];
    }

    // Shelter Functions
    function addPet(string memory _name, string memory _personality, uint _shelterId) external {
        require(shelterManagers[_shelterId][msg.sender], "PetNFT: caller is not a manager of the shelter");

        _mint(msg.sender, nextNftId);
        nextNftId++;

        PetData storage pet = pets[nextNftId];
        pet.name = _name;
        pet.personality = _personality;
        pet.shelterId = _shelterId;
    }

    function bridge(uint _destChainId, address _recipient, uint _nftId) external onlyActiveChain(_destChainId) {
        require(ownerOf(_nftId) == msg.sender, "PetNFT: caller is not the owner of the nft");

        bytes memory _nftMetadata = abi.encode(
            pets[_nftId].name,
            pets[_nftId].personality,
            pets[_nftId].shelterId,
            pets[_nftId].lastWalk,
            pets[_nftId].lastFeed,
            pets[_nftId].lastTreat,
            pets[_nftId].totalWalks,
            pets[_nftId].totalFeeds,
            pets[_nftId].totalTreats
        );

        _burn(_nftId);

        _sendMessage(_destChainId, abi.encode(_recipient, _nftId, _nftMetadata));
    }

    function messageProcess(uint, uint _sourceChainId, address _sender, address, uint, bytes calldata _data) external override  onlySelf(_sender, _sourceChainId)  {
        // decode message
        (address _recipient, uint _nftId, bytes memory _nftMetadata) = abi.decode(_data, (address, uint, bytes));

        // parse metadata
        (
            string memory _name, 
            string memory _personality, 
            uint _shelterId, 
            uint _lastWalk, 
            uint _lastFeed, 
            uint _lastTreat, 
            uint _totalWalks, 
            uint _totalFeeds, 
            uint _totalTreats
        ) = abi.decode(_nftMetadata, (string, string, uint, uint, uint, uint, uint, uint, uint));

        // store metadata
        pets[_nftId] = PetData({
            name: _name,
            personality: _personality,
            shelterId: _shelterId,
            lastWalk: _lastWalk,
            lastFeed: _lastFeed,
            lastTreat: _lastTreat,
            totalWalks: _totalWalks,
            totalFeeds: _totalFeeds,
            totalTreats: _totalTreats
        });

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
                    "{\"trait_type\":\"Last Walk\",\"value\":\"", pets[tokenId].lastWalk, "\"}",
                    "{\"trait_type\":\"Last Feed\",\"value\":\"", pets[tokenId].lastFeed, "\"}",
                    "{\"trait_type\":\"Last Treat\",\"value\":\"", pets[tokenId].lastTreat, "\"}",
                    "{\"trait_type\":\"Total Walks\",\"value\":\"", pets[tokenId].totalWalks, "\"}",
                    "{\"trait_type\":\"Total Feeds\",\"value\":\"", pets[tokenId].totalFeeds, "\"}",
                    "{\"trait_type\":\"Total Treats\",\"value\":\"", pets[tokenId].totalTreats, "\"}",
                    "{\"trait_type\":\"Shelter\",\"value\":\"", shelters[pets[tokenId].shelterId].name, "\"}",
                    "{\"trait_type\":\"Location\",\"value\":\"", shelters[pets[tokenId].shelterId].location, "\"}",
                    "{\"trait_type\":\"Website\",\"value\":\"", shelters[pets[tokenId].shelterId].website, "\"}",
                    "{\"trait_type\":\"Email\",\"value\":\"", shelters[pets[tokenId].shelterId].email, "\"}",
                "]}"
            )))
        ));
    }
}