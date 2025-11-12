
🔐 Blockchain-Based Secure File Sharing System

This project is a decentralized file storage and sharing application built using Ethereum, IPFS (Pinata), and React.js.
It provides a secure and transparent way to upload, store, and share files over a blockchain network without relying on any centralized server.

All files are first encrypted locally in the browser using AES-GCM encryption to ensure privacy before being uploaded to IPFS (InterPlanetary File System) through Pinata.
The system then registers each file’s encrypted CID (Content Identifier) and SHA-256 file hash on the Ethereum blockchain using a Solidity smart contract.
This guarantees both data integrity and tamper-proof access control.


---

✨ Features

🔒 Client-side AES Encryption — Files are encrypted before upload, ensuring that no unencrypted data ever leaves the user’s device.

🌐 Decentralized Storage (IPFS + Pinata) — Files are stored on IPFS for distributed availability and durability.

⛓ Blockchain Integration (Ethereum) — Smart contract handles file registration, metadata, access permissions, and version tracking.

🧾 Integrity Verification (SHA-256) — Every file’s hash is stored on-chain to verify authenticity and prevent tampering.

👥 Access Management — File owners can grant or revoke access for specific users directly through the smart contract.

🕓 Version Control — Owners can upload new versions of files while keeping the same file ID.

💻 User Interface — React.js frontend with MetaMask integration for wallet authentication and smooth blockchain interaction.



---

⚙ Tech Stack

Layer	Technology

Frontend	React.js, Ethers.js, Crypto-JS, Web Crypto API
Backend	Node.js, Express.js, Multer, Pinata API
Blockchain	Solidity Smart Contract, Hardhat, Ethereum Sepolia Testnet
Storage	IPFS via Pinata
Hashing Algorithm	SHA-256



---

🧠 How It Works

1. User Uploads File → The file is first encrypted in the browser using AES-GCM with a random phrase and recipient address.


2. Upload to IPFS → The encrypted file is pinned to IPFS through the backend using the Pinata API.


3. Register on Blockchain → The encrypted CID and file hash are stored on the Ethereum blockchain via the smart contract.


4. Grant / Revoke Access → File owner can manage access permissions for other wallet addresses.


5. Download and Decrypt → Authorized users can fetch the file CID, decrypt it using the same phrase and address, and download the original file.




---

🔍 Use Cases

Secure academic document or research paper sharing

Decentralized data backup systems

Legal and confidential document storage

Privacy-focused file sharing between organizations



---

🧾 Future Enhancements

Implement chunked uploads for larger files

Integrate multi-recipient encryption (same file for multiple users)

Add decentralized identity (DID) or NFT-based ownership

Improve UI/UX for file version history and activity tracking



