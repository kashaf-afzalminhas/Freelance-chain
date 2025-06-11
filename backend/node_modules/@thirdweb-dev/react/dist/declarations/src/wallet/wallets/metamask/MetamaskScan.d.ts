/// <reference types="react" />
import type { MetaMaskWallet } from "@thirdweb-dev/wallets";
import type { ConnectUIProps, WalletConfig } from "@thirdweb-dev/react-core";
export declare const MetamaskScan: React.FC<{
    onBack: () => void;
    onGetStarted: () => void;
    onConnected: () => void;
    walletConfig: WalletConfig<MetaMaskWallet>;
    hideBackButton: boolean;
    setConnectedWallet: ConnectUIProps<MetaMaskWallet>["setConnectedWallet"];
    setConnectionStatus: ConnectUIProps<MetaMaskWallet>["setConnectionStatus"];
    createWalletInstance: () => MetaMaskWallet;
}>;
//# sourceMappingURL=MetamaskScan.d.ts.map