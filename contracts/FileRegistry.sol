// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract FileRegistry
{
    uint256 public nextFileId = 1;

    struct File
    {
        address owner;
        string cid;          // IPFS CID for encrypted file
        bytes32 fileHash;    // SHA-256 of file
        uint256 createdAt;
        uint256 version;
        bool exists;
    }

    mapping(uint256 => File) public files;
    mapping(uint256 => mapping(address => string)) public keyPointers;
    mapping(uint256 => mapping(address => bool)) public hasAccess;

    event FileRegistered(uint256 indexed fileId, address indexed owner, string cid, bytes32 fileHash, uint256 timestamp);
    event AccessGranted(uint256 indexed fileId, address indexed grantee, string keyPointer, uint256 timestamp);
    event AccessRevoked(uint256 indexed fileId, address indexed grantee, uint256 timestamp);
    event FileVersionAdded(uint256 indexed fileId, uint256 version, string cid, bytes32 fileHash, uint256 timestamp);

    modifier onlyOwner(uint256 fileId)
    {
        require(files[fileId].exists, "File does not exist");
        require(files[fileId].owner == msg.sender, "Not owner");
        _;
    }

    function registerFile(string calldata cid, bytes32 fileHash) external returns (uint256 fileId)
    {
        fileId = nextFileId++;
        files[fileId] = File({
            owner: msg.sender,
            cid: cid,
            fileHash: fileHash,
            createdAt: block.timestamp,
            version: 1,
            exists: true
        });

        emit FileRegistered(fileId, msg.sender, cid, fileHash, block.timestamp);
        return fileId;
    }

    function grantAccessKeyPointer(uint256 fileId, address grantee, string calldata keyPointer) external onlyOwner(fileId)
    {
        keyPointers[fileId][grantee] = keyPointer;
        hasAccess[fileId][grantee] = true;
        emit AccessGranted(fileId, grantee, keyPointer, block.timestamp);
    }

    function revokeAccess(uint256 fileId, address grantee) external onlyOwner(fileId)
    {
        hasAccess[fileId][grantee] = false;
        emit AccessRevoked(fileId, grantee, block.timestamp);
    }

    function addVersion(uint256 fileId, string calldata cid, bytes32 fileHash) external onlyOwner(fileId)
    {
        files[fileId].version += 1;
        files[fileId].cid = cid;
        files[fileId].fileHash = fileHash;
        emit FileVersionAdded(fileId, files[fileId].version, cid, fileHash, block.timestamp);
    }

    function getFile(uint256 fileId) external view returns (
        address owner,
        string memory cid,
        bytes32 fileHash,
        uint256 createdAt,
        uint256 version,
        bool exists
    )
    {
        File storage f = files[fileId];
        return (f.owner, f.cid, f.fileHash, f.createdAt, f.version, f.exists);
    }

    function checkAccess(uint256 fileId, address user) external view returns (bool)
    {
        return hasAccess[fileId][user] || files[fileId].owner == user;
    }
}
