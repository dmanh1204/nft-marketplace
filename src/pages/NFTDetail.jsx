import {
  Box,
  Button,
  Grid,
  GridItem,
  HStack,
  Image,
  Input,
  InputGroup,
  InputRightAddon,
} from "@chakra-ui/react";
import { formatEther } from "ethers/lib/utils";
import { useActiveWeb3React } from "hooks/useActiveWeb3React";
import React, { useEffect } from "react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import {
  buyOrderNFT,
  cancelOrderNFT,
  getNftById,
  orderNFT,
} from "utils/callContract";

const NFTDetail = () => {
  const { nftId } = useParams();
  const { account, library } = useActiveWeb3React();

  const [nftInfo, setNftInfo] = useState();
  const [submitting, setSubmitting] = useState(false);
  const [price, setPrice] = useState("");

  useEffect(() => {
    (() => {
      if (!library) return;
      getNftById(library, nftId)
        .then((res) => res && setNftInfo(res))
        .catch(console.log);
    })();
  }, [library, nftId]);

  const handleOrderNFT = async () => {
    if (!library || !account) return alert("please connect wallet");
    if (!price || isNaN(price)) return alert("enter sell price");
    try {
      setSubmitting(true);
      await orderNFT(library, account, nftId, price);
      alert("order success");
      setSubmitting(false);
    } catch (error) {
      console.error(error);
      if (error.data?.message) {
        alert(error.data.message);
      }
      setSubmitting(false);
    }
  };

  const handleCancelOrderNFT = async () => {
    if (!library || !account) return alert("please connect wallet");
    try {
      setSubmitting(true);
      await cancelOrderNFT(library, account, nftId);
      alert("cancel order success");
      setSubmitting(false);
    } catch (error) {
      console.error(error);
      if (error.data?.message) {
        alert(error.data.message);
      }
      setSubmitting(false);
    }
  };

  const handleBuyOrderNFT = async (price) => {
    if (!library || !account) return alert("please connect wallet");
    if (!price) return;
    try {
      setSubmitting(true);
      await buyOrderNFT(library, account, nftId, price);
      alert("buy success");
      setSubmitting(false);
    } catch (error) {
      console.error(error);
      if (error.data?.message) {
        alert(error.data.message);
      }
      setSubmitting(false);
    }
  };

  return (
    <Grid templateColumns={"repeat(2,1fr)"} gap={8}>
      <Image border={"1px solid"} src={nftInfo?.url} />
      <Box>
        <Grid color="red.500" templateColumns={"repeat(6,1fr)"} gap={4}>
          <Box>ID: </Box>
          <GridItem colSpan={5}>{nftId.toString()}</GridItem>
          <Box>Owner: </Box>
          <GridItem colSpan={5}>{nftInfo?.owner}</GridItem>
          <Box>Price: </Box>
          <GridItem colSpan={5}>
            {nftInfo?.price?.toString()
              ? `${formatEther(nftInfo?.price?.toString())} BNB`
              : "N/A"}
          </GridItem>

          <GridItem colSpan={6}>
            {account && account === nftInfo?.owner ? (
              typeof nftInfo?.isOrdering === "boolean" &&
              nftInfo.isOrdering === false ? (
                <HStack>
                  <InputGroup maxW={64} borderColor="black">
                    <Input
                      border={"1px solid"}
                      placeholder="sell price"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                    />
                    <InputRightAddon
                      children="BNB"
                      bg={"gray.400"}
                      // color={"white"}
                    />
                  </InputGroup>
                  <Button
                    colorScheme={"orange"}
                    isLoading={submitting}
                    onClick={() => handleOrderNFT()}
                  >
                    Sell
                  </Button>
                </HStack>
              ) : (
                <Button
                  colorScheme={"yellow"}
                  isLoading={submitting}
                  onClick={() => handleCancelOrderNFT()}
                >
                  Cancel Sell
                </Button>
              )
            ) : (
              <Button
                colorScheme={"blue"}
                isLoading={submitting}
                onClick={() => handleBuyOrderNFT(nftInfo?.price)}
              >
                Buy
              </Button>
            )}
          </GridItem>
        </Grid>
      </Box>
    </Grid>
  );
};

export default NFTDetail;
