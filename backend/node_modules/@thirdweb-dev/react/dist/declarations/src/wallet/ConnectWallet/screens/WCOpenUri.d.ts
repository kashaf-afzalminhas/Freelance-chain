/// <reference types="react" />
import type { ConnectUIProps, WalletConfig, WalletInstance } from "@thirdweb-dev/react-core";
export declare const WCOpenURI: React.FC<{
    onBack: () => void;
    onConnected: () => void;
    createWalletInstance: () => WalletInstance;
    setConnectedWallet: ConnectUIProps<WalletInstance>["setConnectedWallet"];
    setConnectionStatus: ConnectUIProps<WalletInstance>["setConnectionStatus"];
    appUriPrefix: {
        ios: string;
        android: string;
        other: string;
    };
    errorConnecting: boolean;
    onRetry: () => void;
    hideBackButton: boolean;
    onGetStarted: () => void;
    locale: {
        getStartedLink: string;
        tryAgain: string;
        instruction: string;
        failed: string;
        inProgress: string;
    };
    meta: WalletConfig["meta"];
}>;
//# sourceMappingURL=WCOpenUri.d.ts.map