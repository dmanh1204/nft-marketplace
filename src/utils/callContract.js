import { NFT_MARKETPLACE_ADDRESS, NFT_MARKETPLACE_METHODS } from "configs";
import { parseEther } from "ethers/lib/utils";
import { callContract, getNFTMarketplaceContract } from "hooks/useContract";
import { uploadIPFS } from "services/upload-ipfs";

export const mintNFT = async (library, account, nft) => {
  if (!library || !account) throw Error("no signer or provider");
  try {
    const nftMarketplaceContract = await getNFTMarketplaceContract(
      library,
      account
    );
    const url = await uploadIPFS(nft);
    console.log(url);
    return callContract(nftMarketplaceContract, NFT_MARKETPLACE_METHODS.mint, [
      account,
      url,
    ]);
  } catch (error) {
    throw error;
  }
};

export const getOwners = async (library, account) => {
  if (!library || !account) return;
  const nftMarketplaceContract = await getNFTMarketplaceContract(library);
  const balanceOf = await callContract(
    nftMarketplaceContract,
    NFT_MARKETPLACE_METHODS.balanceOf,
    [account]
  );
  const nftIds = await Promise.all(
    new Array(+balanceOf.toString())
      .fill("")
      .map((_, idx) =>
        callContract(
          nftMarketplaceContract,
          NFT_MARKETPLACE_METHODS.tokenOfOwnerByIndex,
          [account, idx]
        )
      )
  );
  return Promise.all(
    nftIds.map(async (id) => {
      const url = await callContract(
        nftMarketplaceContract,
        NFT_MARKETPLACE_METHODS.tokenURI,
        [id]
      );
      return { id, url };
    })
  );
};

export const getNftById = async (library, nftId) => {
  if (!library) return;
  const nftMarketplaceContract = await getNFTMarketplaceContract(library);
  const [owner, url, isOrdering, price] = await Promise.all([
    callContract(nftMarketplaceContract, NFT_MARKETPLACE_METHODS.ownerOf, [
      nftId,
    ]),
    callContract(nftMarketplaceContract, NFT_MARKETPLACE_METHODS.tokenURI, [
      nftId,
    ]),
    callContract(nftMarketplaceContract, NFT_MARKETPLACE_METHODS.isOrdering, [
      nftId,
    ]),
    callContract(
      nftMarketplaceContract,
      NFT_MARKETPLACE_METHODS.orderingPrices,
      [nftId]
    ),
  ]);
  return { owner, url, isOrdering, price };
};

export const orderNFT = async (library, account, nftId, price) => {
  if (!library || !account || !price) return;
  const nftMarketplaceContract = await getNFTMarketplaceContract(
    library,
    account
  );
  await callContract(nftMarketplaceContract, NFT_MARKETPLACE_METHODS.approve, [
    NFT_MARKETPLACE_ADDRESS,
    nftId,
  ]);
  const _price = parseEther(price);
  return callContract(nftMarketplaceContract, NFT_MARKETPLACE_METHODS.order, [
    nftId,
    _price,
  ]);
};

export const cancelOrderNFT = async (library, account, nftId) => {
  if (!library || !account) return;
  const nftMarketplaceContract = await getNFTMarketplaceContract(
    library,
    account
  );
  return callContract(
    nftMarketplaceContract,
    NFT_MARKETPLACE_METHODS.cancelOrder,
    [nftId]
  );
};

export const getOrdering = async (library) => {
  if (!library) return;
  const nftMarketplaceContract = await getNFTMarketplaceContract(library);
  const nftIds = await callContract(
    nftMarketplaceContract,
    NFT_MARKETPLACE_METHODS.getOrdering,
    []
  );
  console.log(nftIds);
  return Promise.all(
    nftIds.map(async (id) => {
      const [url, price] = await Promise.all([
        callContract(nftMarketplaceContract, NFT_MARKETPLACE_METHODS.tokenURI, [
          id,
        ]),
        callContract(
          nftMarketplaceContract,
          NFT_MARKETPLACE_METHODS.orderingPrices,
          [id]
        ),
      ]);
      return { id, url, price };
    })
  );
};

export const buyOrderNFT = async (library, account, nftId, price) => {
  if (!library || !account || !price) return;
  const nftMarketplaceContract = await getNFTMarketplaceContract(
    library,
    account
  );
  return callContract(
    nftMarketplaceContract,
    NFT_MARKETPLACE_METHODS.buyOrder,
    [nftId],
    {
      value: price,
    }
  );
};
