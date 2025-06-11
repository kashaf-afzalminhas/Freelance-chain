/// <reference types="react" />
import type { OKXWallet } from "@thirdweb-dev/wallets";
import type { ConnectUIProps, WalletConfig } from "@thirdweb-dev/react-core";
export declare const OKXScan: React.FC<{
    onBack: () => void;
    onGetStarted: () => void;
    onConnected: () => void;
    walletConfig: WalletConfig<OKXWallet>;
    hideBackButton: boolean;
    createWalletInstance: () => OKXWallet;
    setConnectedWallet: ConnectUIProps<OKXWallet>["setConnectedWallet"];
    setConnectionStatus: ConnectUIProps<OKXWallet>["setConnectionStatus"];
}>;
//# sourceMappingURL=OKXScan.d.ts.map