import type { LocalWalletConfigOptions, LocalWalletConfig } from "./types";
/**
 * A wallet configurator for Local wallet which allows integrating a "Guest Login" experience to app.
 *
 * It returns a [`WalletConfig`](https://portal.thirdweb.com/references/react/v4/WalletConfig) object which can be used to connect the wallet to via [`ConnectWallet`](https://portal.thirdweb.com/react/v4/components/ConnectWallet) component or [`useConnect`](https://portal.thirdweb.com/references/react/v4/useConnect) hook as mentioned in [Connecting Wallets](https://portal.thirdweb.com/react/v4/connecting-wallets) guide
 *
 * @example
 * ```ts
 * localWallet({
 *  persist: true,
 * })
 * ```
 *
 * @param config -
 * Optional object containing the following properties to configure the wallet
 *
 * ### persist (optional)
 *
 * If `true`, the encrypted wallet JSON will be stored on localStorage with user's password.
 * the user will not need to enter their password again when they visit the site. Because of this, the wallet can not be auto connected.
 *
 * If `false`, wallet will not be stored, and no password will be required to connect.
 * the wallet will be lost when the user leaves or reloads the page.
 *
 * By default, it is set to `true`.
 *
 * @wallet
 */
export declare const localWallet: (config?: LocalWalletConfigOptions) => LocalWalletConfig;
//# sourceMappingURL=localWallet.d.ts.map