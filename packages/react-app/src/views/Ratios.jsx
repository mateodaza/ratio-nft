import React from "react";
import { useEffect } from "react";

const { ethers } = require("ethers");

function Ratios({ selectedNetwork, yourLocalBalance, readContracts, writeContracts, provider, tx }) {
  // const purpose = useContractReader(readContracts, "YourContract", "purpose");
  const { RatioFactory } = readContracts;

  console.log({ RatioFactory });

  const getAllRatios = async () => {
    const filter = RatioFactory?.filters?.ERC1155Created(null, null);
    const fromBlock = await provider.getBlockNumber().then(b => b - 10000);
    const toBlock = "latest";
    RatioFactory.queryFilter(filter, fromBlock, toBlock).then(logs => {
      console.log({ logs });
    });
  };

  useEffect(() => {
    getAllRatios();
  }, []);

  return <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}></div>;
}

export default Ratios;
