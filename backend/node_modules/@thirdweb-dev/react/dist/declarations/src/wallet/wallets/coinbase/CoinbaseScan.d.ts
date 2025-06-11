/// <reference types="react" />
import type { CoinbaseWallet } from "@thirdweb-dev/wallets";
import { ConnectUIProps, WalletConfig } from "@thirdweb-dev/react-core";
export declare const CoinbaseScan: React.FC<{
    onBack: () => void;
    onGetStarted: () => void;
    onConnected: () => void;
    walletConfig: WalletConfig<CoinbaseWallet>;
    hideBackButton: boolean;
    setConnectedWallet: ConnectUIProps<CoinbaseWallet>["setConnectedWallet"];
    setConnectionStatus: ConnectUIProps<CoinbaseWallet>["setConnectionStatus"];
}>;
//# sourceMappingURL=CoinbaseScan.d.ts.map