// Import the NFTStorage class and File constructor from the 'nft.storage' package
// const { NFTStorage, File } = require('nft.storage');
import { NFTStorage, File } from "nft.storage";
import axios from "axios";
// const fetch = require('node-fetch');
// import fetch from "node-fetch";

// // The 'mime' npm package helps us set the correct file type on our File objects
// const mime = require('mime');
import mime from "mime";
// const { Blob } = require('buffer');
// import { Blob } from "buffer";
// // The 'path' module provides helpers for manipulating filesystem paths
// const path = require("path");
import path from "path";

// // The 'fs' builtin module on Node.js provides access to the file system
const fs = require("fs");
// import fs from "fs";

// Paste your NFT.Storage API key into the quotes:
const NFT_STORAGE_KEY = process.env.NFT_STORAGE_KEY;

// -------------------------UTILS---------------------------
// Example "https://user-images.githubusercontent.com/87873179/144324736-3f09a98e-f5aa-4199-a874-13583bf31951.jpg"
// const getImage = async url => {
//   const response = await fetch(url);
//   // const response = await axios.get(url, { responseType: 'blob' });
//   if (response.status !== 200) {
//     throw new Error(`error fetching image: [${response.statusCode}]: ${response.status}`);
//   }

//   // const type = mime.lookup(url)
//   // return new File([response.data], path.basename(url), { type });
//   const blob = await response.blob();
//   let file = new File([blob], path.basename(url));
//   // const blob = new Blob([response.data], { type: response.headers['content-type'] });
//   // const file = blobToFile(blob, path.basename(url));
//   return file;
// };

function blobToFile(blob, fileName) {
  //A Blob() is almost a File() - it's just missing the two properties below which we will add
  blob.lastModifiedDate = new Date();
  blob.name = fileName;
  return blob;
}

const fileFromPath = async filePath => {
  const content = await fs.promises.readFile(filePath);
  const type = mime.lookup(filePath);
  return new File([content], path.basename(filePath), { type });
};

// {
//   description: ''
//   image: 'ipfs://IMAGECID/filename.extension'
//   name: ''
// }
const fetchMetadata = async cid => {
  const response = await axios.get(buildIpfsMetadataUrl(cid));
  return response;
};

export const buildImageUrl = imageUri => {
  const imageCidAndFilePath = String(imageUri).split("//")[1];
  return `https://nftstorage.link/ipfs/${imageCidAndFilePath}`;
};

export const buildIpfsMetadataUrl = cid => {
  return `https://nftstorage.link/ipfs/${cid}/metadata.json`;
};

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
export const storeNFT = async (imagePathOrUrl, name, description, isExternalimage) => {
  let image = "";
  // load the file from disk
  if (isExternalimage) {
    // image = await getImage(imagePathOrUrl);
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

// const uploaditbro = async () => {
//   // const something = await storeNFT('packages/react-app/public/mitch.png','fake nft', 'really fakely', false);
//   const something = await storeNFT('https://user-images.githubusercontent.com/87873179/144324736-3f09a98e-f5aa-4199-a874-13583bf31951.jpg','fake nft', 'really fakely', true);

//   // const r = await axios.get(`https://nftstorage.link/ipfs/bafyreihfdjvwpony6aslehzexf4hisq7r2cdrkqyk5g7mqntpdmjhstwcu/metadata.json`);
//   // const r = await axios.get(`https://nftstorage.link/ipfs/${something.ipnft}/metadata.json`);

//   console.log(something);
// }

// uploaditbro();
