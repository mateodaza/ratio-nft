import React from "react";
import { useEffect } from "react";

import { MediaConfiguration, NFTPreview } from "@zoralabs/nft-components";

const { ethers } = require("ethers");

function Ratios({ selectedNetwork, yourLocalBalance, readContracts, writeContracts, provider, tx }) {
  // const purpose = useContractReader(readContracts, "YourContract", "purpose");
  const { RatioFactory } = readContracts;

  console.log({ RatioFactory });

  const getAllRatios = async () => {
    const filter = RatioFactory?.filters?.ERC1155Created(null, null);
    const fromBlock = await provider?.getBlockNumber().then(b => b - 1000);
    const toBlock = "latest";
    RatioFactory?.queryFilter(filter, fromBlock, toBlock).then(logs => {
      console.log({ logs });
    });
  };

  useEffect(() => {
    getAllRatios();
  }, []);
  // ERC1155 0x3da09C9464680e9d234c161434e07D3F950791bC
  return (
    <MediaConfiguration networkId="80001">
      <NFTPreview contract="0xF7C3AacEEbD290e03276F4672b81141335e1c734" id="18" showBids={false} />
    </MediaConfiguration>
  );
}

export default Ratios;
