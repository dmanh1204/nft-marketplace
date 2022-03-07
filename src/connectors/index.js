import { InjectedConnector } from "@web3-react/injected-connector";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";
import { StaticJsonRpcProvider } from "@ethersproject/providers";
import { ReactComponent as MetamaskIcon } from "assets/images/metamask.svg";
import { ReactComponent as WalletConnectIcon } from "assets/images/walletconnect.svg";
import { RPC_CHAIN_ID, RPC_NODE_1 } from "configs";

export const injected = new InjectedConnector({
  supportedChainIds: [RPC_CHAIN_ID],
});

export const walletconnect = new WalletConnectConnector({
  rpc: {
    RPC_CHAIN_ID: RPC_NODE_1,
  },
});

export const connectors = [
  {
    name: "Metamask",
    connector: injected,
    icon: <MetamaskIcon />,
  },
  {
    name: "WalletConnect",
    connector: walletconnect,
    icon: <WalletConnectIcon />,
  },
];

export const simpleRpcProvider = new StaticJsonRpcProvider(RPC_NODE_1, {
  chainId: RPC_CHAIN_ID,
});
