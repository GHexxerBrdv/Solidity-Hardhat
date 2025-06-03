const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");
const { VrfMockModule } = require("./vrfMock");
const { storeImage, storeTokenUriMetadata } = require("./helper");
require("dotenv").config()

module.exports = buildModule("randomNftModule", (m) => {

    let tokenUris = [
        "ipfs://QmaVkBn2tKmjbhphU7eyztbvSQU5EXDdqRyXZtRhSGgJGo",
        "ipfs://QmYQC5aGZu2PTH8XzbJrbDnvhj3gVs7ya33H9mqUNvST3d",
        "ipfs://QmZYmH5iDbD6v3U2ixoVAjioSzvWJszDzYdbeCLquGSpVm",
    ]

    const imagesLocation = "../../images";

    const metadataTemplate = {
        name: "",
        description: "",
        image: "",
        attributes: [
            {
                trait_type: "Cuteness",
                value: 100,
            },
        ],
    }

    if(process.env.UPLOAD_TO_PINATA == "true") {
        tokenUris = handleTokenUri(imagesLocation, metadataTemplate);
    }


    const { vrfMock } = m.useModule(VrfMockModule);

    const subId = m.getParameter("subId", "1");
    const mintFee = m.getParameter("mintFee", "10000000000000000");
    const gasLane = m.getParameter("gasLane", "0x0000000000000000000000000000000000000000000000000000000000000000");
    const callbackGasLimit = m.getParameter("callbackGasLimit", "500000");

    const randomNft = m.contract("RandomIpfsNft", [
        vrfMock,
        subId,
        gasLane,
        mintFee,
        callbackGasLimit,
        tokenUris
    ]);
    return { randomNft, vrfMock};
});

async function handleTokenUri(imagePath, metadata) {
    const tokenUris = [];

    const {response, files} = await storeImage(imagePath);
    
    for(const imageResponseIndex in response) {
        let tokenMetadat = {...metadata};
        tokenMetadat.name = files[imageResponseIndex].replace(/\b.png/, "");
        tokenMetadat.description = `An adorable ${tokenMetadat.name} pup!`
        tokenMetadat.image = `ipfs://${imageResponse[imageResponseIndex].IpfsHash}`
        console.log(`Uploading ${tokenMetadat.name}...`)
        const metadataUploadResponse = await storeTokenUriMetadata(tokenMetadat)
        tokenUris.push(`ipfs://${metadataUploadResponse.IpfsHash}`)
    }
    console.log("Token URIs uploaded! They are:")
    console.log(tokenUris)
    return tokenUris

}