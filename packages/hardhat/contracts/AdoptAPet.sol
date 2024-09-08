// SPDX-License-Identifier: MIT
// (c)2024 Atlas (atlas@vialabs.io)
pragma solidity =0.8.17;

import "@vialabs-io/contracts/message/MessageClient.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "base64-sol/base64.sol";

contract AdoptAPet is ERC721, ERC721Enumerable, Ownable, MessageClient {
    struct ShelterData {
        string name;
        string location;
        string website;
        string email;
        address accountant;
    }

    struct PetData {
        uint lastWalk;
        uint lastFeed;
        uint lastTreat;

        uint totalWalks;
        uint totalFeeds;
        uint totalTreats;

        uint totalDonations;

        string name;
        string personality;
        string image;
        uint shelterId;
        bool adopted;
    }

    uint public nextNftId;
    uint public nextShelterId;
    mapping(uint => string) public messages;
    mapping(uint => PetData) public pets;
    mapping(uint => ShelterData) public shelters;
    mapping(uint => mapping(address => bool)) public shelterManagers;
    mapping(uint => address) public shelterAccountant;

    uint[] public allShelters;
    uint[] public availablePets;

    uint public actionCost = 0.0001 ether;

    event MetadataUpdate(uint256 _nftId);
    event ShelterAdded(uint256 _shelterId);
    event ShelterManagerAdded(uint256 _shelterId, address _manager);
    event ShelterManagerRemoved(uint256 _shelterId, address _manager);
    event PetAdded(uint256 _nftId);
    event PetAdopted(uint256 _nftId);
    event PetRescued(uint256 _nftId);
    event PetWalked(uint256 _nftId);
    event PetFed(uint256 _nftId);
    event PetTreated(uint256 _nftId);
    event PetBridged(uint256 _nftId, uint256 _destChainId, address _recipient);
    event ActionCostSet(uint256 _actionCost);

    constructor() ERC721("Adopt A Pet", "AAP") {
        nextNftId = block.chainid * 10**4;
        nextShelterId = block.chainid * 10**4;
    }

    function walk(uint _nftId) external payable {
        require(msg.value >= actionCost, "AdoptAPet: Insufficient funds");
        require(ownerOf(_nftId) == msg.sender, "AdoptAPet: caller is not the owner of the nft");

        payable(shelterAccountant[pets[_nftId].shelterId]).transfer(msg.value);

        pets[_nftId].lastWalk = block.timestamp;
        pets[_nftId].totalWalks++;
        pets[_nftId].totalDonations += msg.value;

        emit MetadataUpdate(_nftId);
        emit PetWalked(_nftId);
    }

    function feed(uint _nftId) external payable {
        require(msg.value >= actionCost, "AdoptAPet: Insufficient funds");
        require(ownerOf(_nftId) == msg.sender, "AdoptAPet: caller is not the owner of the nft");

        payable(shelterAccountant[pets[_nftId].shelterId]).transfer(msg.value);

        PetData storage pet = pets[_nftId];
        pet.lastFeed = block.timestamp;
        pet.totalFeeds++;
        pets[_nftId].totalDonations += msg.value;

        emit MetadataUpdate(_nftId);
        emit PetFed(_nftId);
    }

    function treat(uint _nftId) external payable {
        require(msg.value >= actionCost, "AdoptAPet: Insufficient funds");
        require(ownerOf(_nftId) == msg.sender, "AdoptAPet: caller is not the owner of the nft");

        payable(shelterAccountant[pets[_nftId].shelterId]).transfer(msg.value);

        PetData storage pet = pets[_nftId];
        pet.lastTreat = block.timestamp;
        pet.totalTreats++;
        pets[_nftId].totalDonations += msg.value;

        emit MetadataUpdate(_nftId);
        emit PetTreated(_nftId);
    }

    function rescue(uint _nftId) external payable {
        require(msg.value >= actionCost, "AdoptAPet: Insufficient funds");
        require(_exists(_nftId), "AdoptAPet: Pet does not exist");

        PetData storage pet = pets[_nftId];
        require(pet.adopted == false, "AdoptAPet: Pet is already adopted");

        if(
            pet.lastFeed < block.timestamp - 7 days ||
            pet.lastWalk < block.timestamp - 7 days ||
            pet.lastTreat < block.timestamp - 7 days
         ) {
            _transfer(ownerOf(_nftId), msg.sender, _nftId);
            emit PetRescued(_nftId);
        } else {
            revert("AdoptAPet: Pet is being taken care of. Cannot return to shelter.");
        }
    }

    function getLastMessage(uint _nftId) external view returns (string memory) {
        return messages[_nftId];
    }

    function getAllShelters() external view returns (uint[] memory) {
        return allShelters;
    }

    function getShelter(uint _shelterId) external view returns (ShelterData memory) {
        return shelters[_shelterId];
    }

    function getAvailablePets() external view returns (uint[] memory) {
        return availablePets;
    }

    function getPet(uint _nftId) external view returns (PetData memory) {
        return pets[_nftId];
    }

    function adoptPet(uint _nftId) external payable {
        require(_exists(_nftId), "AdoptAPet: Pet does not exist");
        require(msg.value >= actionCost, "AdoptAPet: Insufficient funds");
        require(ownerOf(_nftId) == address(this), "AdoptAPet: Already adopted by someone");

        payable(shelterAccountant[pets[_nftId].shelterId]).transfer(msg.value);

        pets[_nftId].lastWalk = block.timestamp - 1 days;
        pets[_nftId].lastFeed = block.timestamp - 3 days;
        pets[_nftId].lastTreat = block.timestamp - 5 days;
        pets[_nftId].totalDonations += msg.value;

        _transfer(address(this), msg.sender, _nftId);
        
        emit PetAdopted(_nftId);
    }

    // Admin Functions
    function addShelter(address _accountant, string memory _name, string memory _location, string memory _website, string memory _email) external onlyOwner {
        ShelterData storage shelter = shelters[nextShelterId];
        shelters[nextShelterId].name = _name;
        shelter.location = _location;
        shelter.website = _website;
        shelter.email = _email;
        shelter.accountant = _accountant;

        allShelters.push(nextShelterId);
        emit ShelterAdded(nextShelterId);
        
        nextShelterId++;
    }

    function setActionCost(uint _actionCost) external onlyOwner {
        actionCost = _actionCost;
        emit ActionCostSet(actionCost);
    }

    function addShelterManager(uint _shelterId, address _manager) external onlyOwner {
        shelterManagers[_shelterId][_manager] = true;
        emit ShelterManagerAdded(_shelterId, _manager);
    }

    function removeShelterManager(uint _shelterId, address _manager) external onlyOwner {
        delete shelterManagers[_shelterId][_manager];
        emit ShelterManagerRemoved(_shelterId, _manager);
    }

    // Shelter Functions
    function addPet(uint _shelterId, string memory _name, string memory _image, string memory _personality) external {
        require(shelterManagers[_shelterId][msg.sender], "AdoptAPet: caller is not a manager of the shelter");

        _mint(address(this), nextNftId);

        PetData storage pet = pets[nextNftId];
        pet.name = _name;
        pet.personality = _personality;
        pet.shelterId = _shelterId;
        pet.image = _image;

        availablePets.push(nextNftId);
        emit PetAdded(nextNftId);

        nextNftId++;
    }

    function bridge(uint _destChainId, address _recipient, uint _nftId) external onlyActiveChain(_destChainId) {
        require(ownerOf(_nftId) == msg.sender, "AdoptAPet: caller is not the owner of the nft");

        bytes memory _nftMetadata = abi.encode(
            pets[_nftId].name,
            pets[_nftId].image,
            pets[_nftId].personality,
            pets[_nftId].shelterId,
            pets[_nftId].lastWalk,
            pets[_nftId].lastFeed,
            pets[_nftId].lastTreat,
            pets[_nftId].totalDonations,
            pets[_nftId].totalWalks,
            pets[_nftId].totalFeeds,
            pets[_nftId].totalTreats,
            pets[_nftId].adopted
        );

        _burn(_nftId);

        _sendMessage(_destChainId, abi.encode(_recipient, _nftId, _nftMetadata));

        emit PetBridged(_nftId, _destChainId, _recipient);
    }

    function messageProcess(uint, uint _sourceChainId, address _sender, address, uint, bytes calldata _data) external override  onlySelf(_sender, _sourceChainId)  {
        // decode message
        (address _recipient, uint _nftId, bytes memory _nftMetadata) = abi.decode(_data, (address, uint, bytes));

        // parse metadata
        (
            string memory _name, 
            string memory _image,
            string memory _personality, 
            uint _shelterId, 
            uint _lastWalk, 
            uint _lastFeed, 
            uint _lastTreat, 
            uint _totalDonations,
            uint _totalWalks, 
            uint _totalFeeds, 
            uint _totalTreats,
            bool _adopted
        ) = abi.decode(_nftMetadata, (string, string, string, uint, uint,  uint, uint, uint, uint, uint, uint, bool));

        // store metadata
        pets[_nftId] = PetData({
            name: _name,
            image: _image,
            personality: _personality,
            shelterId: _shelterId,
            lastWalk: _lastWalk,
            lastFeed: _lastFeed,
            lastTreat: _lastTreat,
            totalDonations: _totalDonations,
            totalWalks: _totalWalks,
            totalFeeds: _totalFeeds,
            totalTreats: _totalTreats,
            adopted: _adopted
        });

        // mint tokens
        _mint(_recipient, _nftId);
    }

    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        require(_exists(tokenId), "ERC721Metadata: URI query for nonexistent token");

        return string(abi.encodePacked('data:application/json;base64,', 
            Base64.encode(bytes(abi.encodePacked(
                "{\"name\":\"Adopt A Pet #", uint2str(tokenId), "\",",
                "\"description\":\"Adopt A Pet NFT\",",
                "\"image\":\"", string(pets[tokenId].image), "\",",
                "\"attributes\":[",
                    "{\"trait_type\":\"Name\",\"value\":\"", string(pets[tokenId].name), "\"},",
                    "{\"trait_type\":\"Last Walk\",\"value\":\"", uint2str(pets[tokenId].lastWalk), "\"},",
                    "{\"trait_type\":\"Last Feed\",\"value\":\"", uint2str(pets[tokenId].lastFeed), "\"},",
                    "{\"trait_type\":\"Last Treat\",\"value\":\"", uint2str(pets[tokenId].lastTreat), "\"},",
                    "{\"trait_type\":\"Total Walks\",\"value\":\"", uint2str(pets[tokenId].totalWalks), "\"},",
                    "{\"trait_type\":\"Total Feeds\",\"value\":\"", uint2str(pets[tokenId].totalFeeds), "\"},",
                    "{\"trait_type\":\"Total Treats\",\"value\":\"", uint2str(pets[tokenId].totalTreats), "\"},",
                    "{\"trait_type\":\"Adopted\",\"value\":\"", pets[tokenId].adopted ? "true" : "false", "\"},",
                    "{\"trait_type\":\"Shelter\",\"value\":\"", string(shelters[pets[tokenId].shelterId].name), "\"},",
                    "{\"trait_type\":\"Location\",\"value\":\"", string(shelters[pets[tokenId].shelterId].location), "\"},",
                    "{\"trait_type\":\"Website\",\"value\":\"", string(shelters[pets[tokenId].shelterId].website), "\"},",
                    "{\"trait_type\":\"Email\",\"value\":\"", string(shelters[pets[tokenId].shelterId].email), "\"}",
                "]}"
            )))
        ));

    }

    function walletOfOwner(address owner) public view returns (uint256[] memory) {
        uint256 ownerTokenCount = balanceOf(owner);
        uint256[] memory tokenIds = new uint256[](ownerTokenCount);
        for (uint256 i = 0; i < ownerTokenCount; i++) {
            tokenIds[i] = tokenOfOwnerByIndex(owner, i);
        }
        return tokenIds;
    }

    function _beforeTokenTransfer(address from, address to, uint256 tokenId, uint256 batchSize) internal override(ERC721, ERC721Enumerable) {
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
    }

    function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC721Enumerable) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    function uint2str(uint _i) internal pure returns (string memory) {
        if (_i == 0) return "0";
    
        uint j = _i;
        uint len;
        while (j != 0) {
            len++;
            j /= 10;
        }
        
        bytes memory bstr = new bytes(len);
        while (_i != 0) {
            len -= 1;
            bstr[len] = bytes1(uint8(48 + _i % 10));
            _i /= 10;
        }
        return string(bstr);
    }
}