import React, { useState, useEffect } from "react";
import axios from "axios";
import { MediaConfiguration, NFTPreview } from "@zoralabs/nft-components";

const { ethers } = require("ethers");

function Ratios({ selectedNetwork, yourLocalBalance, readContracts, writeContracts, provider, tx }) {
  // const purpose = useContractReader(readContracts, "YourContract", "purpose");
  const { RatioFactory } = writeContracts;
  const [ratios, setRatios] = useState([]);
  console.log({ RatioFactory });

  const getAllRatios = async () => {
    const filter = RatioFactory?.filters?.ERC1155Created(null, null);

    const fromBlock = await provider?.getBlockNumber().then(b => b - 1000);
    const toBlock = "latest";
    RatioFactory?.queryFilter(filter, fromBlock, toBlock).then(logs => {
      setRatios(logs);
    });
  };

  const getImage = async uri => {
    const json = await axios.get(uri);
    const res = json.data;
    console.log({ res });
    return res.image;
  };

  useEffect(() => {
    getAllRatios();
  }, []);
  // ERC1155 0x3da09C9464680e9d234c161434e07D3F950791bC

  console.log({ ratios });
  return (
    // <MediaConfiguration networkId="80001">
    //   <NFTPreview contract="0xF7C3AacEEbD290e03276F4672b81141335e1c734" id="18" showBids={false} />
    // </MediaConfiguration>
    <div style={{ marginTop: "20px" }}>
      {ratios?.map(ratio => {
        const img = getImage(ratio?.args?.uri);
        return (
          <div>
            <p>Name: {ratio?.args?.contractName}</p>
            <p>URI: {ratio?.args?.uri}</p>
            <p>NFT: {ratio?.args?.nftAddress}</p>
            <p>TokenId: {ratio?.args?.nftTokenId?.toNumber()}</p>
            <p>ERC1155: {ratio?.args?.tokenContract}</p>
            <hr style={{ borderTop: "2px solid lightgray", width: "25%" }} />
          </div>
        );
      })}
    </div>
  );
}

export default Ratios;
