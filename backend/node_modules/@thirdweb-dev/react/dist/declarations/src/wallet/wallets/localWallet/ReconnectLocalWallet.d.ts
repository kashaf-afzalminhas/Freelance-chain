/// <reference types="react" />
import { ConnectUIProps, WalletConfig, WalletInstance } from "@thirdweb-dev/react-core";
import type { LocalWalletConfig } from "./types";
import { LocalWallet } from "@thirdweb-dev/wallets";
type ReconnectLocalWalletProps = {
    onConnect: () => void;
    goBack: () => void;
    localWallet: LocalWalletConfig;
    supportedWallets: WalletConfig[];
    renderBackButton: boolean;
    persist: boolean;
    modalSize: "wide" | "compact";
    walletInstance?: WalletInstance;
    setConnectedWallet: ConnectUIProps<LocalWallet>["setConnectedWallet"];
    setConnectionStatus: ConnectUIProps<LocalWallet>["setConnectionStatus"];
    connectedWalletAddress: ConnectUIProps["connectedWalletAddress"];
};
/**
 * For No-Credential scenario
 */
export declare const ReconnectLocalWallet: React.FC<ReconnectLocalWalletProps>;
export {};
//# sourceMappingURL=ReconnectLocalWallet.d.ts.map