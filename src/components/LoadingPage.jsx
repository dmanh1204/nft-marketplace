import { Box } from "@chakra-ui/layout";
import { Spinner } from "@chakra-ui/spinner";
import React from "react";

const LoadingPage = () => {
  return (
    <Box
      pos="fixed"
      top="0"
      left="0"
      right="0"
      bottom="0"
      bg="gray.600"
      opacity="0.5"
    >
      <Spinner
        pos="fixed"
        top="50%"
        left="50%"
        transform="translate(-50%,-50%)"
        opacity="1"
      />
    </Box>
  );
};

export default LoadingPage;
