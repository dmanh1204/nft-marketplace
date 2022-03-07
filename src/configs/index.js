if (!process.env.REACT_APP_RPC_CHAIN_ID) throw Error("RPC chainID is required");
if (!process.env.REACT_APP_RPC_NODE_1) throw Error("RPC node url is required");
if (!process.env.REACT_APP_NFT_MARKETPLACE_ADDRESS)
  throw Error("NFT contract is required");

export const RPC_CHAIN_ID = parseInt(process.env.REACT_APP_RPC_CHAIN_ID, 10);

export const RPC_NODE_1 = process.env.REACT_APP_RPC_NODE_1;

export const NFT_MARKETPLACE_ADDRESS =
  process.env.REACT_APP_NFT_MARKETPLACE_ADDRESS;

export const NFT_MARKETPLACE_METHODS = {
  mint: "mint",
  balanceOf: "balanceOf",
  tokenOfOwnerByIndex: "tokenOfOwnerByIndex",
  tokenURI: "tokenURI",
  ownerOf: "ownerOf",
  isOrdering: "isOrdering",
  approve: "approve",
  order: "order",
  cancelOrder: "cancelOrder",
  getOrdering: "getOrdering",
  buyOrder: "buyOrder",
  orderingPrices: "orderingPrices",
};
