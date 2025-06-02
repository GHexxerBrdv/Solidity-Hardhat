const { assert } = require("chai");
const { ethers } = require("hardhat");

describe("Basic NFT test", () => {
  let nft, deployer;
  beforeEach(async () => {
    [deployer] = await ethers.getSigners();
    const deployment = await hre.ignition.deploy(require("../ignition/modules/basicNft"));
    nft = deployment.basicNft;
    console.log("deployed.......");
  })

  it("Mint", async () => {
    await nft.mintNft();
    const tokenId = await nft.getTokenCounter();
    assert.equal(tokenId.toString(), "1");
  })

  it("Token uri", async () => {
    await nft.mintNft();
    const tokenUri = await nft.tokenURI();
    assert.equal(tokenUri, await nft.TOKEN_URI())
  })
})