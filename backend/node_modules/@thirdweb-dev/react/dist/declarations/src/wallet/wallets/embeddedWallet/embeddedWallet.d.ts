import { WalletConfig } from "@thirdweb-dev/react-core";
import { EmbeddedWallet } from "@thirdweb-dev/wallets";
import { EmbeddedWalletConfigOptions } from "./types";
/**
 * A wallet configurator for [Embedded Wallet](https://portal.thirdweb.com/wallet/embedded-wallet) which allows integrating the wallet with React.
 *
 * It returns a [`WalletConfig`](https://portal.thirdweb.com/references/react/v4/WalletConfig) object which can be used to connect the wallet to via [`ConnectWallet`](https://portal.thirdweb.com/react/v4/components/ConnectWallet) component or [`useConnect`](https://portal.thirdweb.com/references/react/v4/useConnect) hook as mentioned in [Connecting Wallets](https://portal.thirdweb.com/react/v4/connecting-wallets) guide
 *
 * You can also connect this wallet using the [`useEmbeddedWallet`](https://portal.thirdweb.com/references/react/v4/useEmbeddedWallet) hook
 *
 * @example
 * ```ts
 * embeddedWallet({
 *   auth: {
 *     options: ["email", "google", "facebook", "apple"],
 *   },
 *   recommended: true,
 * });
 * ```
 *
 * @param options -
 * Optional object containing the following properties to configure the wallet
 *
 * ### auth (optional)
 * Choose which auth providers to show in the wallet connection UI
 *
 * By default, all auth methods are enabled, which is equivalent to setting the following:
 * ```ts
 * {
 *  options: ["email", "google", "apple", "facebook"]
 * }
 * ```
 *
 * ### recommended (optional)
 * If true, the wallet will be tagged as "recommended" in [`ConnectWallet`](https://portal.thirdweb.com/react/v4/components/ConnectWallet) Modal UI
 *
 * ### onAuthSuccess (optional)
 * A callback function that will be called when the user successfully authenticates with the wallet. The callback is called with the `authResult` object
 *
 * @wallet
 */
export declare const embeddedWallet: (options?: EmbeddedWalletConfigOptions) => WalletConfig<EmbeddedWallet>;
//# sourceMappingURL=embeddedWallet.d.ts.map