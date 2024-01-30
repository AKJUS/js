export { ThirdwebProvider } from "./providers/thirdweb-provider.js";

export {
  useSetActiveWallet,
  useActiveWalletChainId,
  useConnect,
  useDisconnect,
  useActiveWallet,
  useConnectedWallets,
  useActiveWalletAddress,
  useSwitchActiveWalletChain,
} from "./providers/wallet-provider.js";

// contract related
export { useContractRead } from "./hooks/contract/useRead.js";
export { useSendTransaction } from "./hooks/contract/useSend.js";
export { useEstimateGas } from "./hooks/contract/useEstimate.js";
export { useWaitForReceipt } from "./hooks/contract/useWaitForReceipt.js";
export { useWatchEvents } from "./hooks/contract/useWatchContractEvents.js";

// rpc related
export { useWatchBlockNumber } from "./hooks/rpc/useWatchBlockNumber.js";
