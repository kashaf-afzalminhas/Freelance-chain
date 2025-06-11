import { UseQueryResult } from "@tanstack/react-query";
import { PaperWallet, PaperWalletAdditionalOptions } from "@thirdweb-dev/wallets";
type PaperConfig = Omit<PaperWalletAdditionalOptions, "chain">;
/**
 * @internal
 * @deprecated We have deprecated `PaperWallet` in favor of our `EmbeddedWallet` which adds support for more sign in methods. use the [`useEmbeddedWallet`](https://portal.thirdweb.com/references/react/v4/useEmbeddedWallet) hook instead
 */
export declare function usePaperWallet(): (options: {
    chainId?: number;
    email?: string;
} & PaperConfig) => Promise<PaperWallet>;
/**
 * @internal
 * @deprecated We have deprecated `PaperWallet` in favor of our `EmbeddedWallet` which adds support for more sign in methods. use the [`useEmbeddedWallet`](https://portal.thirdweb.com/references/react/v4/useEmbeddedWallet) hook instead
 */
export declare function usePaperWalletUserEmail(): UseQueryResult<string | undefined, string>;
export {};
//# sourceMappingURL=usePaper.d.ts.map