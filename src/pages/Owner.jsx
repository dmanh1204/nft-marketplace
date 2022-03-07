import { Box, Grid, Image } from "@chakra-ui/react";
import { useActiveWeb3React } from "hooks/useActiveWeb3React";
import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { getOwners } from "utils/callContract";

const Owner = () => {
  const { account } = useParams();
  const { library } = useActiveWeb3React();

  const [owners, setOwners] = useState([]);

  useEffect(() => {
    (() => {
      if (!account || !library) return;
      getOwners(library, account).then(setOwners).catch(console.error);
    })();
  }, [account, library]);

  return (
    <Box>
      <Box pb={4}>Account: {account}</Box>
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

export default Owner;
