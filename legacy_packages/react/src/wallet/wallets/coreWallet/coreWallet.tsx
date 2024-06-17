import type {
  WalletOptions,
  WalletConfig,
  ConnectUIProps,
} from "@thirdweb-dev/react-core";
import {
  CoreWallet,
  getInjectedCoreWalletProvider,
} from "@thirdweb-dev/wallets";
import { handelWCSessionRequest } from "../handleWCSessionRequest";
import { useTWLocale } from "../../../evm/providers/locale-provider";
import { ExtensionOrWCConnectionUI } from "../_common/ExtensionORWCConnectionUI";
import type { QRModalOptions } from "@thirdweb-dev/wallets/src/evm/connectors/wallet-connect/qrModalOptions";

const coreWalletUris = {
  ios: "core://",
  android: "core://",
  other: "core://",
};

/**
 * @wallet
 */
export type CoreWalletConfigOptions = {
  /**
   * When connecting Core using the QR Code - Wallet Connect connector is used which requires a project id.
   * This project id is Your project’s unique identifier for wallet connect that can be obtained at cloud.walletconnect.com.
   *
   * https://docs.walletconnect.com/2.0/web3modal/options#projectid-required
   */
  projectId?: string;

  /**
   * If true, the wallet will be tagged as "recommended" in ConnectWallet Modal
   */
  recommended?: boolean;

  /**
   * Specify whether to open the official Wallet Connect  Modal when connecting the wallet if no injected MetaMask provider is found when connecting the wallet.
   *
   * This should not be set if you are using ConnectWallet component and only when manually connecting the wallet using a hook like `useConnect`.
   *
   * You can set it to `true` or a configuration object to enable the Wallet Connect Modal.
   */
  wcModal?:
    | {
        /**
         * Configure the style of Wallet Connect Modal.
         */
        qrModalOptions?: QRModalOptions;
      }
    | boolean;
};

/**
 * A wallet configurator for [Core Wallet](https://core.app/) which allows integrating the wallet with React.
 *
 * It returns a [`WalletConfig`](https://portal.thirdweb.com/references/react/v4/WalletConfig) object which can be used to connect the wallet to via [`ConnectWallet`](https://portal.thirdweb.com/react/v4/components/ConnectWallet) component or [`useConnect`](https://portal.thirdweb.com/references/react/v4/useConnect) hook as mentioned in [Connecting Wallets](https://portal.thirdweb.com/react/v4/connecting-wallets) guide
 *
 * @example
 * ```ts
 * coreWallet({
 *  projectId: "my-project-id",
 *  recommended: true,
 * })
 * ```
 *
 * @param options -
 * Optional object containing the following properties to configure the wallet
 *
 * ### projectId (optional)
 * When connecting Core using the QR Code - Wallet Connect connector is used which requires a project id.
 * This project id is Your project’s unique identifier for wallet connect that can be obtained at cloud.walletconnect.com.
 *
 * ### recommended (optional)
 * If true, the wallet will be tagged as "recommended" in [`ConnectWallet`](https://portal.thirdweb.com/react/v4/components/ConnectWallet) Modal UI
 *
 * @wallet
 */
export const coreWallet = (
  options?: CoreWalletConfigOptions,
): WalletConfig<CoreWallet> => {
  return {
    id: CoreWallet.id,
    recommended: options?.recommended,
    meta: {
      name: "Core Wallet",
      urls: {
        chrome:
          "https://chrome.google.com/webstore/detail/core-crypto-wallet-nft-ex/agoakfejjabomempkjlepdflaleeobhb",
        android: "https://play.google.com/store/apps/details?id=com.avaxwallet",
        ios: "https://apps.apple.com/us/app/core-crypto-wallet-nfts/id6443685999",
      },
      iconURL:
        "data:image/png;base64,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",
    },
    create: (walletOptions: WalletOptions) => {
      const wallet = new CoreWallet({
        ...walletOptions,
        projectId: options?.projectId,
        qrcode: options?.wcModal ? true : false,
        qrModalOptions:
          typeof options?.wcModal === "object"
            ? options?.wcModal?.qrModalOptions
            : undefined,
      });

      handelWCSessionRequest(wallet, coreWalletUris);

      return wallet;
    },
    connectUI: ConnectUI,
    isInstalled: isCoreWalletInstalled,
  };
};

function isCoreWalletInstalled() {
  return !!getInjectedCoreWalletProvider();
}

function ConnectUI(props: ConnectUIProps<CoreWallet>) {
  const locale = useTWLocale();
  return (
    <ExtensionOrWCConnectionUI
      connect={props.connect}
      connected={props.connected}
      createWalletInstance={props.createWalletInstance}
      goBack={props.goBack}
      meta={props.walletConfig["meta"]}
      setConnectedWallet={(w) => props.setConnectedWallet(w as CoreWallet)}
      setConnectionStatus={props.setConnectionStatus}
      supportedWallets={props.supportedWallets}
      walletConnectUris={coreWalletUris}
      walletLocale={locale.wallets.coreWallet}
      isInstalled={isCoreWalletInstalled}
    />
  );
}
