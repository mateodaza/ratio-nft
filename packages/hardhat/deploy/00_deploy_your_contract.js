// deploy/00_deploy_your_contract.js

const { ethers } = require("hardhat");
import { storeNFT, buildIpfsMetadataUrl, buildImageUrl } from '../scripts/upload';

const localChainId = "31337";

// const sleep = (ms) =>
//   new Promise((r) =>
//     setTimeout(() => {
//       console.log(`waited for ${(ms / 1000).toFixed(3)} seconds`);
//       r();
//     }, ms)
//   );

module.exports = async ({ getNamedAccounts, deployments, getChainId }) => {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = await getChainId();

  await deploy("YourContract", {
    // Learn more about args here: https://www.npmjs.com/package/hardhat-deploy#deploymentsdeploy
    from: deployer,
    // args: [ "Hello", ethers.utils.parseEther("1.5") ],
    log: true,
    waitConfirmations: 5,
  });

  await deploy("ERC20Mock", {
    from: deployer,
    log: true,
    waitConfirmations: 5,
    gasLimit: 10000000,
    args: [
      "Fake DAI",
      "fDAI",
      "0x0392c78869A3718bA8285EF849f024DEE0c44AD4",
      ethers.utils.parseUnits("10000", 18),
    ],
  });

  const Token = await ethers.getContract("ERC20Mock", deployer);

  const nftMetadata = await storeNFT('packages/react-app/public/mitch.png','fake nft', 'really fakely', false);
  const imageUrl = buildImageUrl(nftMetadata.data.image);

  await deploy("RatioNFT", {
    // Learn more about args here: https://www.npmjs.com/package/hardhat-deploy#deploymentsdeploy
    from: deployer,
    args: [
      "My NFT", // NAME
      "oneNFT", // SYMBOL
      buildIpfsMetadataUrl(nftMetadata.ipnft) // "https://gateway.pinata.cloud/ipfs/QmTN32qBKYqnyvatqfnU8ra6cYUGNxpYziSddCatEmopLR/metadata/api/item/1.json", // URI
    ],
    log: true,
    waitConfirmations: 5,
  });

  const NFT = await ethers.getContract("RatioNFT", deployer);

  await deploy("RatioEdition", {
    // Learn more about args here: https://www.npmjs.com/package/hardhat-deploy#deploymentsdeploy
    from: deployer,
    args: [
      "My Test Ratio NFT",
      "https://gateway.pinata.cloud/ipfs/QmTN32qBKYqnyvatqfnU8ra6cYUGNxpYziSddCatEmopLR/metadata/api/item/",
      10,
      NFT.address,
      Token.address,
    ],
    log: true,
    waitConfirmations: 5,
  });

  await deploy("RatioFactory", {
    // Learn more about args here: https://www.npmjs.com/package/hardhat-deploy#deploymentsdeploy
    from: deployer,
    // args: [ "Hello", ethers.utils.parseEther("1.5") ],
    log: true,
    waitConfirmations: 5,
  });

  // Getting a previously deployed contract
  const YourContract = await ethers.getContract("YourContract", deployer);
  // const RatioNFT = await ethers.getContract("RatioNFT", deployer);
  // const RatioEdition = await ethers.getContract("RatioEdition", deployer);
  // const RatioFactory = await ethers.getContract("RatioFactory", deployer);
  /*  await YourContract.setPurpose("Hello");
  
    // To take ownership of yourContract using the ownable library uncomment next line and add the 
    // address you want to be the owner. 
    
    await YourContract.transferOwnership(
      "ADDRESS_HERE"
    );

    //const YourContract = await ethers.getContractAt('YourContract', "0xaAC799eC2d00C013f1F11c37E654e59B0429DF6A") //<-- if you want to instantiate a version of a contract at a specific address!
  */

  /*
  //If you want to send value to an address from the deployer
  const deployerWallet = ethers.provider.getSigner()
  await deployerWallet.sendTransaction({
    to: "0x34aA3F359A9D614239015126635CE7732c18fDF3",
    value: ethers.utils.parseEther("0.001")
  })
  */

  /*
  //If you want to send some ETH to a contract on deploy (make your constructor payable!)
  const yourContract = await deploy("YourContract", [], {
  value: ethers.utils.parseEther("0.05")
  });
  */

  /*
  //If you want to link a library into your contract:
  // reference: https://github.com/austintgriffith/scaffold-eth/blob/using-libraries-example/packages/hardhat/scripts/deploy.js#L19
  const yourContract = await deploy("YourContract", [], {}, {
   LibraryName: **LibraryAddress**
  });
  */

  // Verify from the command line by running `yarn verify`

  // You can also Verify your contracts with Etherscan here...
  // You don't want to verify on localhost
  // try {
  //   if (chainId !== localChainId) {
  //     await run("verify:verify", {
  //       address: YourContract.address,
  //       contract: "contracts/YourContract.sol:YourContract",
  //       constructorArguments: [],
  //     });
  //   }
  // } catch (error) {
  //   console.error(error);
  // }
};
module.exports.tags = ["YourContract"];
