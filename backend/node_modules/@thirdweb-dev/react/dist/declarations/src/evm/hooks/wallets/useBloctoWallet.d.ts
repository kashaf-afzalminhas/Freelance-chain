import { BloctoWalletConfigOptions } from "../../../wallet/wallets/blocto/bloctoWallet";
/**
 * @internal
 * @deprecated use the [`ConnectWallet`](https://portal.thirdweb.com/react/v4/components/ConnectWallet) component or [`useConnect`](https://portal.thirdweb.com/references/react/v4/useConnect) hook instead
 * @walletConnection
 */
export declare function useBloctoWallet(): (options?: {
    chainId?: number;
} & BloctoWalletConfigOptions) => Promise<import("@thirdweb-dev/wallets").BloctoWallet>;
//# sourceMappingURL=useBloctoWallet.d.ts.map