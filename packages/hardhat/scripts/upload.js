// Import the NFTStorage class and File constructor from the 'nft.storage' package
const { NFTStorage, File } = require('nft.storage');
const axios = require("axios");
const fetch = require('node-fetch');

// // The 'mime' npm package helps us set the correct file type on our File objects
const mime = require('mime');

// // The 'fs' builtin module on Node.js provides access to the file system
const fs = require("fs");
const { Blob } = require('buffer');

// // The 'path' module provides helpers for manipulating filesystem paths
const path = require("path");

// Paste your NFT.Storage API key into the quotes:
const NFT_STORAGE_KEY = process.env.NFT_STORAGE_KEY;

// -------------------------UTILS---------------------------
// Example "https://user-images.githubusercontent.com/87873179/144324736-3f09a98e-f5aa-4199-a874-13583bf31951.jpg"
const getImage = async (url) => {
  const response = await fetch(url);
  // const response = await axios.get(url, { responseType: 'blob' });
  if (response.status !== 200) {
    throw new Error(`error fetching image: [${response.statusCode}]: ${response.status}`)
  };

  // const type = mime.lookup(url)
  // return new File([response.data], path.basename(url), { type });
  const blob = await response.blob();
  let file = new File([blob], path.basename(url));
  // const blob = new Blob([response.data], { type: response.headers['content-type'] });
  // const file = blobToFile(blob, path.basename(url));
  return file;
}

function blobToFile(blob, fileName){
  //A Blob() is almost a File() - it's just missing the two properties below which we will add
  blob.lastModifiedDate = new Date();
  blob.name = fileName;
  return blob;
}

const fileFromPath = async (filePath) => {
  const content = await fs.promises.readFile(filePath)
  const type = mime.lookup(filePath)
  return new File([content], path.basename(filePath), { type })
}

// {
//   description: ''
//   image: 'ipfs://IMAGECID/filename.extension'
//   name: ''
// }
const fetchMetadata = async (cid) => {
  const response = await axios.get(buildIpfsMetadataUrl(cid));
  return response;
}

const buildImageUrl = (imageUri) => {
  const imageCidAndFilePath = String(imageUri).split('//')[1];
  return `https://nftstorage.link/ipfs/${imageCidAndFilePath}`;
}

const buildIpfsMetadataUrl = (cid) => {
  return `https://nftstorage.link/ipfs/${cid}/metadata.json`
}


//-----------------------END UTILS-----------------------------


// ---------------------- NFT STORAGE-------------------------

/**
 * Reads an image file from `imagePath` and stores an NFT with the given name and description.
 * @param {string} imagePathOrUrl the path to an image file or external url
 * @param {string} name a name for the NFT
 * @param {string} description a text description for the NFT
 */

//  {
//    ipnft: 'bafyreifrkkhbwkf3fibwhbzcmpqnmh3b4t5t4ig7qdtymkdoatcycwe6n4',
//    url: 'ipfs://bafyreifrkkhbwkf3fibwhbzcmpqnmh3b4t5t4ig7qdtymkdoatcycwe6n4/metadata.json'
//  }
const storeNFT = async (imagePathOrUrl, name, description, isExternalimage) => {
  let image = '';
  // load the file from disk
  if (isExternalimage) {
    image = await getImage(imagePathOrUrl);
  } else {
    image = await fileFromPath(imagePathOrUrl);
  }

  // create a new NFTStorage client using our API key
  const nftstorage = new NFTStorage({ token: NFT_STORAGE_KEY });

  // call client.store, passing in the image & metadata
  return nftstorage.store({
    image,
    name,
    description,
  });
};

// OPENDALLE
const generateImage = async () => {
  const { Configuration, OpenAIApi } = require("openai");
  const configuration = new Configuration({
    apiKey: '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',
  });
  const openai = new OpenAIApi(configuration);
  const response = await openai.createCompletion({
    model: "text-davinci-002",
    prompt: "Say this is a test",
    temperature: 0,
    max_tokens: 6,
  });
  return response;
}

const uploaditbro = async () => {
  // const something = await storeNFT('packages/react-app/public/mitch.png','fake nft', 'really fakely', false);
  // const something = await storeNFT('https://user-images.githubusercontent.com/87873179/144324736-3f09a98e-f5aa-4199-a874-13583bf31951.jpg','fake nft', 'really fakely', true);

  // const r = await axios.get(`https://nftstorage.link/ipfs/bafyreihfdjvwpony6aslehzexf4hisq7r2cdrkqyk5g7mqntpdmjhstwcu/metadata.json`);
  // const r = await axios.get(`https://nftstorage.link/ipfs/${something.ipnft}/metadata.json`);

  const something = await generateImage();
  console.log(something);
}

uploaditbro();