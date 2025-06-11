/// <reference types="react" />
import type { ConnectionStatus, WalletConfig, WalletInstance } from "@thirdweb-dev/react-core";
import { WCConnectableWallet } from "./WCConnectableWallet";
import { ExtensionAndQRScreensLocale } from "../../../evm/locales/types";
export declare const WalletConnectScanUI: React.FC<{
    onBack: () => void;
    onGetStarted: () => void;
    onConnected: () => void;
    hideBackButton: boolean;
    setConnectionStatus: (status: ConnectionStatus) => void;
    setConnectedWallet: (wallet: WalletInstance) => void;
    walletLocale: ExtensionAndQRScreensLocale;
    createWalletInstance: () => WCConnectableWallet;
    meta: WalletConfig["meta"];
}>;
//# sourceMappingURL=WalletConnectScanUI.d.ts.map