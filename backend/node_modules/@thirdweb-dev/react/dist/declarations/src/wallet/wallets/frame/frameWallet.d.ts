import type { WalletConfig } from "@thirdweb-dev/react-core";
import { FrameWallet } from "@thirdweb-dev/wallets";
/**
 * @wallet
 */
export type FrameWalletConfigOptions = {
    /**
     * If true, the wallet will be tagged as "recommended" in ConnectWallet Modal
     */
    recommended?: boolean;
};
/**
 * A wallet configurator for [Frame Wallet](https://frame.sh/) which allows integrating the wallet with React.
 *
 * It returns a [`WalletConfig`](https://portal.thirdweb.com/references/react/v4/WalletConfig) object which can be used to connect the wallet to via [`ConnectWallet`](https://portal.thirdweb.com/react/v4/components/ConnectWallet) component or [`useConnect`](https://portal.thirdweb.com/references/react/v4/useConnect) hook as mentioned in [Connecting Wallets](https://portal.thirdweb.com/react/v4/connecting-wallets) guide
 *
 * @example
 * ```ts
 * frameWallet({
 *  recommended: true,
 * })
 * ```
 *
 * @param config -
 * Optional object containing the following properties to configure the wallet
 *
 * ### recommended (optional)
 * If true, the wallet will be tagged as "recommended" in [`ConnectWallet`](https://portal.thirdweb.com/react/v4/components/ConnectWallet) Modal UI
 *
 * @wallet
 */
export declare const frameWallet: (config?: FrameWalletConfigOptions) => WalletConfig<FrameWallet>;
//# sourceMappingURL=frameWallet.d.ts.map