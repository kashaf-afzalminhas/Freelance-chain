import type { WalletConfig } from "@thirdweb-dev/react-core";
import { CoinbaseWallet } from "@thirdweb-dev/wallets";
import { ConnectUIProps } from "@thirdweb-dev/react-core";
/**
 * @wallet
 */
export type CoinbaseWalletConfigOptions = {
    /**
     * Whether to use the Coinbase's default QR Code modal or show the custom UI in ConnectWallet Modal
     *
     * The default is `"custom"`
     */
    qrmodal?: "coinbase" | "custom";
    /**
     * If true, the wallet will be tagged as "recommended" in ConnectWallet Modal
     */
    recommended?: boolean;
};
/**
 * A wallet configurator for [Coinbase Wallet](https://www.coinbase.com/wallet) which allows integrating the wallet with React.
 *
 * It returns a [`WalletConfig`](https://portal.thirdweb.com/references/react/v4/WalletConfig) object which can be used to connect the wallet to via [`ConnectWallet`](https://portal.thirdweb.com/react/v4/components/ConnectWallet) component or [`useConnect`](https://portal.thirdweb.com/references/react/v4/useConnect) hook as mentioned in [Connecting Wallets](https://portal.thirdweb.com/react/v4/connecting-wallets) guide
 *
 * @example
 * ```ts
 * coinbaseWallet({
 *  qrmodal: "custom",
 *  recommended: true,
 * })
 * ```
 *
 * @param options -
 * Optional object containing the following properties to configure the wallet
 *
 * ### qrmodal (optional)
 * Whether to use the Coinbase's default QR Code modal or show the custom UI in ConnectWallet Modal.
 *
 * The default is `"custom"`
 *
 * ### recommended (optional)
 * If true, the wallet will be tagged as "recommended" in [`ConnectWallet`](https://portal.thirdweb.com/react/v4/components/ConnectWallet) Modal UI
 *
 * @wallet
 */
export declare const coinbaseWallet: (options?: CoinbaseWalletConfigOptions) => WalletConfig<CoinbaseWallet>;
export declare const CoinbaseNativeModalConnectUI: ({ connected, walletConfig, show, hide, supportedWallets, theme, goBack, setConnectionStatus, setConnectedWallet, }: ConnectUIProps<CoinbaseWallet>) => null;
//# sourceMappingURL=coinbaseWallet.d.ts.map