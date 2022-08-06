import React from "react";
import { useState } from "react";
import { PAYMENT_TOKENS } from "../constants";

/**
 * web3 props can be passed from '../App.jsx' into your local view component for use
 * @param {*} yourLocalBalance balance on current network
 * @param {*} readContracts contracts from current chain already pre-loaded using ethers contract module. More here https://docs.ethers.io/v5/api/contract/contract/
 * @returns react component
 **/
function Home({ selectedNetwork, yourLocalBalance, readContracts, writeContracts }) {
  // const purpose = useContractReader(readContracts, "YourContract", "purpose");

  const { RatioFactory } = writeContracts;

  const [title, setTitle] = useState(null);
  const [description, setDescription] = useState(null);
  const [localImage, setLocalImage] = useState(null);
  const [generatedImage, setGeneratedImage] = useState(null);
  const [amount, setAmount] = useState(null);
  const [useDallE, setUseDallE] = useState(false);
  console.log({ selectedNetwork });
  const goDallE = async () => {
    if (!description) return alert("please set a description first");
    if (!!useDallE) {
      setUseDallE(false);
      setGeneratedImage(null);
      return;
    }
    //TODO: Dall-E magic goes here
    setUseDallE(!useDallE);
  };

  const mint = async () => {
    if (!title && !description && !amount) return alert("please fill all the fields");
    if (!localImage && !generatedImage) return alert("please add or generate an image to use as an NFT");
    // const ERC1155 = RatioFactory.deployERC1155(string memory _contractName, string memory _uri, uint _goalAmount, address _nftAddress, address _paymentToken)

    //Get URI and NFT
    const uri = "";
    const nftAddress = "";
    const ERC1155 = RatioFactory.deployERC1155(
      title,
      uri,
      amount * 10 ** 18,
      nftAddress,
      PAYMENT_TOKENS[selectedNetwork],
    );
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <img
        src="https://www.davidhodder.com/wp-content/uploads/2018/01/GoldenRatioPNG3000.png"
        width="250px"
        style={{ margin: "20px 0", objectFit: "contain", maxHeight: "300px" }}
      />
      <hr style={{ borderTop: "2px solid lightgray", width: "25%" }} />
      <div style={{ display: "flex", flexDirection: "column", width: "50%", margin: "20px 0", alignItems: "center" }}>
        <input
          placeholder="nft title"
          className="minimal-input required"
          type="text"
          onChange={e => setTitle(e.target.value)}
        />
        <input
          placeholder="a very short description"
          className="minimal-input required"
          type="text"
          onChange={e => setDescription(e.target.value)}
        />
        <input
          placeholder="dai $"
          className="minimal-input required"
          type="number"
          min="0"
          onChange={e => setAmount(e.target.value)}
        />
        {!useDallE && (
          <input
            type="file"
            id="image-input"
            accept="image/jpeg, image/png, image/jpg"
            style={{ margin: "20px 0 20px 60px" }}
          />
        )}
        <div style={{ margin: "20px 0" }}>
          <label className="switch">
            <input type="checkbox" checked={useDallE} onChange={() => goDallE()} />
            <span className="slider round"></span>
          </label>
          <p style={{ margin: "10px 0" }}>or generate an image with dall-e openai using your description</p>
        </div>
        <button className="button" onClick={() => mint()}>
          mint
        </button>
      </div>
    </div>
  );
}

export default Home;
