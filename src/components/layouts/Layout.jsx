import { Button } from "@chakra-ui/button";
import { useDisclosure } from "@chakra-ui/hooks";
import { Box, Grid, HStack, Text, VStack } from "@chakra-ui/layout";
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/modal";
import { connectors } from "connectors";
import { useWallet } from "connectors/hooks";
import { useActiveWeb3React } from "hooks/useActiveWeb3React";
import React from "react";
import { Link } from "react-router-dom";

export const Layout = ({ children }) => {
  const { account } = useActiveWeb3React();
  const { connect } = useWallet();
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Box minH="100vh" bg="blue.200">
      <Modal size="sm" isOpen={isOpen && !account} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Connect Wallet</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Grid templateColumns="repeat(2, 1fr)" gap="12">
              {connectors.map((c, idx) => (
                <VStack
                  key={idx}
                  cursor="pointer"
                  p="4"
                  borderRadius="md"
                  _hover={{
                    bg: "gray.300",
                  }}
                  onClick={() => connect(c.connector)}
                >
                  <Box h="12">{c.icon}</Box>
                  <Text as="b" textAlign="center">
                    {c.name}
                  </Text>
                </VStack>
              ))}
            </Grid>
          </ModalBody>
        </ModalContent>
      </Modal>

      <HStack
        h="14"
        px="8"
        py="4"
        align="center"
        flex="1"
        justify="space-between"
        spacing="4"
      >
        <Link to="/">
          <Button colorScheme="purple">Home</Button>
        </Link>
        {account ? (
          // <Link to={`/${account}`}>
          //   <Button colorScheme="purple">{account}</Button>
          // </Link>
          <Button colorScheme="purple">{account}</Button>
        ) : (
          <Button colorScheme="purple" onClick={onOpen}>
            Connect wallet
          </Button>
        )}
      </HStack>
      <Box minH="calc(100vh - 6em)" px="8" py="4" pos="relative">
        {children}
      </Box>
    </Box>
  );
};
