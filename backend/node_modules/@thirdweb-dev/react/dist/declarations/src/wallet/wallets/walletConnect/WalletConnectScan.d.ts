/// <reference types="react" />
import type { WalletConnect } from "@thirdweb-dev/wallets";
import type { ConnectUIProps, WalletConfig } from "@thirdweb-dev/react-core";
export declare const WalletConnectScan: React.FC<{
    onBack: () => void;
    onConnected: () => void;
    walletConfig: WalletConfig<WalletConnect>;
    hideBackButton: boolean;
    modalSize: "wide" | "compact";
    hide: ConnectUIProps["hide"];
    show: ConnectUIProps["show"];
    setConnectedWallet: ConnectUIProps<WalletConnect>["setConnectedWallet"];
    setConnectionStatus: ConnectUIProps<WalletConnect>["setConnectionStatus"];
    createWalletInstance: ConnectUIProps<WalletConnect>["createWalletInstance"];
}>;
//# sourceMappingURL=WalletConnectScan.d.ts.map