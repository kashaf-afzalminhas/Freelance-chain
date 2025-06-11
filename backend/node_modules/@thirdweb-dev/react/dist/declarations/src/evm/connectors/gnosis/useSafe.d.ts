import type { SafeConnectionArgs } from "@thirdweb-dev/wallets";
/**
 * @deprecated use [`ConnectWallet`](https://portal.thirdweb.com/react/v4/components/ConnectWallet) or [`useConnect`](https://portal.thirdweb.com/references/react/v4/useConnect) instead
 * @walletConnection
 * @internal
 */
export declare function useSafe(): (connectProps: SafeConnectionArgs) => Promise<import("@thirdweb-dev/wallets").SafeWallet>;
/**
 * @deprecated use [`ConnectWallet`](https://portal.thirdweb.com/react/v4/components/ConnectWallet) or [`useConnect`](https://portal.thirdweb.com/references/react/v4/useConnect) instead
 * @walletConnection
 * @internal
 */
export declare const useGnosis: typeof useSafe;
//# sourceMappingURL=useSafe.d.ts.map