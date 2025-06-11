import { WalletConnect } from "@thirdweb-dev/wallets";
import type { WalletConfig } from "@thirdweb-dev/react-core";
import type { WC2_QRModalOptions } from "@thirdweb-dev/wallets";
/**
 * @wallet
 */
export type walletConnectConfigOptions = {
    /**
     * Your project’s unique identifier that can be obtained at https://cloud.walletconnect.com/
     *
     * Enables following functionalities within Web3Modal: wallet and chain logos, optional WalletConnect RPC, support for all wallets from our Explorer and WalletConnect v2 support. Defaults to undefined.
     *
     * https://docs.walletconnect.com/2.0/web3modal/options#projectid-required
     */
    projectId?: string;
    /**
     * options to customize QR Modal.
     *
     * https://docs.walletconnect.com/2.0/web3modal/options
     */
    qrModalOptions?: WC2_QRModalOptions;
    /**
     * If true, the wallet will be tagged as "recommended" in ConnectWallet Modal
     */
    recommended?: boolean;
    /**
     * Specify wheher a custom QR Modal or the Official WalletConnect Modal should be used on desktop. The custom screen has an option to open the official WalletConnect Modal too.
     *
     * Note that the official WalletConnect Modal is always used on mobile devices.
     *
     * The default is `"custom"` ( for desktop )
     */
    qrModal?: "custom" | "walletConnect";
};
/**
 * A wallet configurator for [WalletConnect](https://walletconnect.com/) which allows integrating the wallet with React.
 *
 * It returns a [`WalletConfig`](https://portal.thirdweb.com/references/react/v4/WalletConfig) object which can be used to connect the wallet to via [`ConnectWallet`](https://portal.thirdweb.com/react/v4/components/ConnectWallet) component or [`useConnect`](https://portal.thirdweb.com/references/react/v4/useConnect) hook as mentioned in [Connecting Wallets](https://portal.thirdweb.com/react/v4/connecting-wallets) guide
 *
 * @example
 * ```ts
 * walletConnect({
 *   projectId: "your_project_id",
 *   qrModal: "custom", // or "walletConnect"
 *   qrModalOptions: {
 *     themeMode: "dark",
 *   },
 *   recommended: true,
 * });
 * ```
 *
 * @param config -
 * Optional configuration options for the wallet
 *
 * ### projectId (optional)
 * When connecting Trust using the QR Code - Wallet Connect connector is used which requires a project id.
 * This project id is Your project’s unique identifier for wallet connect that can be obtained at cloud.walletconnect.com.
 *
 * ### qrModal (optional)
 * Specify wheher a custom QR Modal or the Official WalletConnect Modal should be used on desktop. The custom screen has an option to open the official WalletConnect Modal too.
 *
 * Note that the official WalletConnect Modal is always used on mobile devices.
 *
 * The default is `"custom"` ( for desktop )
 *
 * ### qrModalOptions (optional)
 * The [WalletConnect Modal options](https://docs.walletconnect.com/advanced/walletconnectmodal/options) to customize the official WalletConnect Modal.
 *
 * ### recommended (optional)
 * If true, the wallet will be tagged as "recommended" in [`ConnectWallet`](https://portal.thirdweb.com/react/v4/components/ConnectWallet) Modal UI
 *
 * @wallet
 */
export declare const walletConnect: (config?: walletConnectConfigOptions) => WalletConfig<WalletConnect>;
//# sourceMappingURL=walletConnect.d.ts.map