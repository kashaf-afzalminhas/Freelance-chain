import type { WalletConfig } from "@thirdweb-dev/react-core";
import { BloctoWallet } from "@thirdweb-dev/wallets";
/**
 * @wallet
 */
export type BloctoWalletConfigOptions = {
    /**
     * To get advanced features and support from Blocto, you can create an appId from [blocto dashboard](https://docs.blocto.app/blocto-sdk/register-app-id)
     */
    appId?: string;
    /**
     * If true, the wallet will be tagged as "recommended" in [`ConnectWallet`](https://portal.thirdweb.com/react/v4/components/ConnectWallet) Modal
     */
    recommended?: boolean;
};
/**
 * A wallet configurator for [Blocto Wallet](https://blocto.io/) which allows integrating the wallet with React.
 *
 * It returns a [`WalletConfig`](https://portal.thirdweb.com/references/react/v4/WalletConfig) object which can be used to connect the wallet to via [`ConnectWallet`](https://portal.thirdweb.com/react/v4/components/ConnectWallet) component or [`useConnect`](https://portal.thirdweb.com/references/react/v4/useConnect) hook as mentioned in [Connecting Wallets](https://portal.thirdweb.com/react/v4/connecting-wallets) guide
 *
 * @example
 * ```ts
 * bloctoWallet({
 *  appId: "my-app-id",
 *  recommended: true,
 * })
 * ```
 *
 * @param options -
 * Optional object containing the following properties to configure the wallet
 *
 * #### appId (optional)
 * To get advanced features and support from Blocto, you need to create an appId from [blocto dashboard](https://docs.blocto.app/blocto-sdk/register-app-id)
 *
 * #### recommended (optional)
 * If true, the wallet will be tagged as "recommended" in [`ConnectWallet`](https://portal.thirdweb.com/react/v4/components/ConnectWallet) Modal UI
 *
 * @wallet
 */
export declare const bloctoWallet: (options?: BloctoWalletConfigOptions) => WalletConfig<BloctoWallet>;
//# sourceMappingURL=bloctoWallet.d.ts.map