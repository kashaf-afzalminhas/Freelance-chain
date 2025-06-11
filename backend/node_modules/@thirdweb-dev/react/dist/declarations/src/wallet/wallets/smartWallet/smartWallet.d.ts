import { type WalletConfig, type ConnectUIProps } from "@thirdweb-dev/react-core";
import { SmartWallet } from "@thirdweb-dev/wallets";
import { SmartWalletConfigOptions } from "./types";
/**
 * A wallet configurator for [Smart Wallet](https://portal.thirdweb.com/references/wallets/v2/SmartWallet) which allows integrating the wallet with React
 *
 * It returns a [`WalletConfig`](https://portal.thirdweb.com/references/react/v4/WalletConfig) object which can be used to connect the wallet to via [`ConnectWallet`](https://portal.thirdweb.com/react/v4/components/ConnectWallet) component or [`useConnect`](https://portal.thirdweb.com/references/react/v4/useConnect) hook as mentioned in [Connecting Wallets](https://portal.thirdweb.com/react/v4/connecting-wallets) guide
 *
 * @example
 * ```ts
 * smartWallet(
 *  metamaskWallet(),
 *  {
 *    factoryAddress: '0x...',
 *    gasless: true,
 *  }
 * )
 * ```
 *
 * @param wallet -
 * Provide a [`WalletConfig`](https://portal.thirdweb.com/references/react/v4/WalletConfig) object to use as the personal wallet for the Smart Wallet.
 *
 * You can get this object by calling a wallet configurator function such as `metamaskWallet()`
 *
 * @param config -
 * Configuration options for the Smart Wallet
 *
 * ### factoryAddress
 * The address of the Smart Wallet Factory contract. Must be of type `string`
 *
 * ### gasless
 * Whether to turn on or off gasless transactions. Must be a `boolean`.
 *
 * - If set to `true`, all gas fees will be paid by a paymaster.
 * - If set to `false`, all gas fees will be paid by the Smart Wallet itself (needs to be funded).
 *
 * @wallet
 */
export declare const smartWallet: (walletConfig: WalletConfig<any>, config: SmartWalletConfigOptions) => WalletConfig<SmartWallet>;
export declare const SmartConnectUI: (props: ConnectUIProps<SmartWallet> & {
    personalWalletConfig: WalletConfig;
}) => import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=smartWallet.d.ts.map