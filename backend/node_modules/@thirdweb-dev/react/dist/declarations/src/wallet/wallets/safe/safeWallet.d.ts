import { SafeWallet } from "@thirdweb-dev/wallets";
import { WalletConfig, ConnectUIProps } from "@thirdweb-dev/react-core";
import type { SafeWalletConfig } from "./types";
/**
 * @wallet
 */
export type SafeWalletConfigOptions = {
    /**
     * An array of personalWallets to show in ConnectWallet Modal to use with SafeWallet
     */
    personalWallets?: WalletConfig<any>[];
    /**
     * If true, the wallet will be tagged as "recommended" in ConnectWallet Modal
     */
    recommended?: boolean;
};
/**
 * A wallet configurator for [Safe](https://safe.global/) which allows integrating the wallet with React.
 *
 * It returns a [`WalletConfig`](https://portal.thirdweb.com/references/react/v4/WalletConfig) object which can be used to connect the wallet to via [`ConnectWallet`](https://portal.thirdweb.com/react/v4/components/ConnectWallet) component or [`useConnect`](https://portal.thirdweb.com/references/react/v4/useConnect) hook as mentioned in [Connecting Wallets](https://portal.thirdweb.com/react/v4/connecting-wallets) guide
 *
 * @example
 * ```ts
 * safeWallet({
 *  personalWallets: [
 *    metamaskWallet(),
 *    coinbaseWallet(),
 *    walletConnect()
 *  ],
 * })
 * ```
 *
 * @param config -
 * Optional configuration options for the wallet
 *
 * ### personalWallets (optional)
 * An array of personal wallets to show in [`ConnectWallet`](https://portal.thirdweb.com/react/v4/components/ConnectWallet) Modal for personal wallet selection
 *
 * ### recommended (optional)
 * If true, the wallet will be tagged as "recommended" in [`ConnectWallet`](https://portal.thirdweb.com/react/v4/components/ConnectWallet) Modal UI
 *
 * @wallet
 */
export declare const safeWallet: (config?: SafeWalletConfigOptions) => SafeWalletConfig;
export declare const SafeConnectUI: (props: ConnectUIProps<SafeWallet> & {
    personalWallets: WalletConfig[];
}) => import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=safeWallet.d.ts.map