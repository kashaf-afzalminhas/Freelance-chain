import { PaperWallet } from "@thirdweb-dev/wallets";
import { WalletConfig } from "@thirdweb-dev/react-core";
import { PaperWalletConfigOptions } from "./types";
/**
 * A wallet configurator for [Paper Wallet](https://withpaper.com/) which allows integrating the wallet with React.
 *
 * @deprecated We have deprecated PaperWallet in favor of our {@link EmbeddedWallet} which adds support for more sign in methods.
 * Learn more here: https://portal.thirdweb.com/embedded-wallet
 *
 * @wallet
 * @internal
 */
export declare const paperWallet: (options?: PaperWalletConfigOptions) => WalletConfig<PaperWallet>;
//# sourceMappingURL=paperWallet.d.ts.map