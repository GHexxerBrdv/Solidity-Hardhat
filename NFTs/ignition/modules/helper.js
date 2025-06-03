const pinataSdk = require("@pinata/sdk");
const fs = require("fs")
const path = require("path") 
require("dotenv").config();

const pinataKey = process.env.PINATA_API_KEY || "";
const pianataSecret = process.env.PINATA_SECRET || ""

const pinata = new pinataSdk(pinataKey, pianataSecret);

async function storeImage(imagePath) {
    const fullImagePath = path.resolve(__dirname,imagePath);

    const files = fs.readdirSync(fullImagePath);
    const response = [];

    console.log("uploading images");

    for(const index in files) {
        const readableStramForFile = fs.createReadStream(`${fullImagePath}/${files[index]}`);

        const options = {
            pinataMetadata : {
                name: files[index]
            }
        }

        try {
            await pinata.pinFileToIPFS(readableStramForFile, options).then((result) =>{
                response.push(result)
            }).catch((err) => {
                console.log(err);
            })
        } catch (error) {
            console.log(error);
        }

    }

    return {response, files}

}

async function storeTokenUriMetadata(metadata) {
    const options = {
        pianataMetadata: {
            name: metadata.name
        }

    }

    try {
        const responses = await pinata.pinJSONToIPFS(metadata, options)
        return responses
    } catch (error) {
        console.log(error);
    }

    return null;
}

module.exports = {storeImage, storeTokenUriMetadata}