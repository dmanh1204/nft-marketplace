import { WalletConnectConnector } from "@web3-react/walletconnect-connector";
import { hexlify } from "@ethersproject/bytes";
import { formatBytes32String } from "@ethersproject/strings";

const signMessage = async (provider, connector, account, message) => {
  let signature;
  const hash = formatBytes32String(message);

  if (window.BinanceChain) {
    const { signature: _signature } = await window.BinanceChain.bnbSign(
      account,
      hash
    );
    signature = _signature;
    // return signature;
  }
  if (!provider) return;
  /**
   * Wallet Connect does not sign the message correctly unless you use their method
   * @see https://github.com/WalletConnect/walletconnect-monorepo/issues/462
   */
  if (connector instanceof WalletConnectConnector) {
    signature =
      await connector.walletConnectProvider.connector.signPersonalMessage([
        hash,
        account.toLowerCase(),
      ]);
  }

  signature = await provider.getSigner(account).signMessage(hash);
  return { signature, hash };
};

export default signMessage;
