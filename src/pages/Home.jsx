import { Box, Text, Button, Grid, Image } from "@chakra-ui/react";
import { formatEther } from "ethers/lib/utils";
import { useActiveWeb3React } from "hooks/useActiveWeb3React";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { getOrdering, mintNFT, getOwners } from "utils/callContract";
const Home = () => {
  const { account, library } = useActiveWeb3React();

  const [nft, setNFT] = useState();
  const [minting, setMinting] = useState(false);
  const [nftOrdering, setNftOrdering] = useState([]);
  const [owners, setOwners] = useState([]);

  useEffect(() => {
    (() => {
      if (!account || !library) return;
      getOwners(library, account).then(setOwners).catch(console.error);
    })();
  }, [account, library]);
  useEffect(() => {
    if (!library) return;
    getOrdering(library)
      .then((res) => res && setNftOrdering(res))
      .catch(console.error);
    console.log(nftOrdering);
  }, [library]);

  const handleMintNFT = async () => {
    if (!account || !library) return alert("please connect wallet");
    if (!nft) return alert("please choose a nft image");
    try {
      setMinting(true);
      await mintNFT(library, account, nft);
      alert("mint success");
      setMinting(false);
    } catch (error) {
      console.log(error);
      setMinting(false);
      if (error.data?.message) {
        alert(error.data.message);
      }
    }
  };

  return (
    <Box>
      <Box textAlign={"center"} color={"brown"} pb={4}>
        <input type="file" onChange={(e) => setNFT(e.target.files[0])} />
        <Button
          colorScheme="purple"
          isLoading={minting}
          onClick={() => handleMintNFT()}
        >
          Mint
        </Button>
      </Box>
      <Text color="red.500" fontSize="xl">
        Ordering
      </Text>
      <Grid templateColumns={"repeat(3,1fr)"} gap={8}>
        {nftOrdering.map((e, idx) => (
          <Link to={`/nft/${e.id?.toString()}`} key={idx} cursor={"pointer"}>
            <Image border={"1px solid"} src={e.url} />
            <Box textAlign={"center"}>ID: {e.id?.toString()}</Box>
            <Box textAlign={"center"}>
              Price:{" "}
              {e.price?.toString() ? formatEther(e.price.toString()) : ""} BNB
            </Box>
          </Link>
        ))}
      </Grid>
      <hr />
      <Text color="red.500" fontSize="xl">
        Mint
      </Text>
      <Grid templateColumns={"repeat(3,1fr)"} gap={8}>
        {owners.map((e, idx) => (
          <Link to={`/nft/${e.id?.toString()}`} key={idx} cursor={"pointer"}>
            <Image border={"1px solid"} src={e.url} />
            <Box textAlign={"center"}>ID: {e.id?.toString()}</Box>
          </Link>
        ))}
      </Grid>
    </Box>
  );
};

export default Home;
