import { WC2_QRModalOptions } from "@thirdweb-dev/wallets";
/**
 * @internal
 * @deprecated use the `useWalletConnect` hook instead
 */
export declare function useWalletConnectV1(): (options?: {
    chainId?: number;
}) => Promise<import("@thirdweb-dev/wallets").WalletConnect>;
/**
 * @internal
 * @walletConnection
 * @deprecated use the [`ConnectWallet`](https://portal.thirdweb.com/react/v4/components/ConnectWallet) component or [`useConnect`](https://portal.thirdweb.com/references/react/v4/useConnect) hook instead
 */
export declare function useWalletConnect(): (options?: {
    chainId?: number;
    projectId?: string;
    qrModalOptions?: WC2_QRModalOptions;
}) => Promise<import("@thirdweb-dev/wallets").WalletConnect>;
//# sourceMappingURL=useWalletConnect.d.ts.map