const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("FileRegistry", function () {
  let registry, owner, addr1;

  beforeEach(async () => {
    [owner, addr1] = await ethers.getSigners();
    const FileRegistry = await ethers.getContractFactory("FileRegistry");
    registry = await FileRegistry.deploy();

    if (typeof registry.waitForDeployment === "function") {
      await registry.waitForDeployment();
    }
  });

  it("should register a file", async () => {
    const cid = "bafybeiexample";
    // ethers v6 style
    const fileHash = ethers.keccak256(ethers.toUtf8Bytes("dummy"));

    const tx = await registry.registerFile(cid, fileHash);
    const receipt = await tx.wait();
    const event = receipt.logs
      .map(log => {
        try { return registry.interface.parseLog(log); } catch { return null; }
      })
      .find(e => e && e.name === "FileRegistered");

    const fileId = event.args.fileId;

    const file = await registry.getFile(fileId);
    expect(file.owner).to.equal(owner.address);
    expect(file.cid).to.equal(cid);
    expect(file.fileHash).to.equal(fileHash);
  });

  it("should grant and revoke access", async () => {
    const cid = "bafybeiexample";
    const fileHash = ethers.keccak256(ethers.toUtf8Bytes("dummy"));
    const tx = await registry.registerFile(cid, fileHash);
    const receipt = await tx.wait();
    const event = receipt.logs
      .map(log => {
        try { return registry.interface.parseLog(log); } catch { return null; }
      })
      .find(e => e && e.name === "FileRegistered");

    const fileId = event.args.fileId;

    await registry.grantAccessKeyPointer(fileId, addr1.address, "keyCID");
    expect(await registry.checkAccess(fileId, addr1.address)).to.equal(true);

    await registry.revokeAccess(fileId, addr1.address);
    expect(await registry.checkAccess(fileId, addr1.address)).to.equal(false);
  });
});
