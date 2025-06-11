/// <reference types="react" />
import { ConnectUIProps } from "@thirdweb-dev/react-core";
import type { LocalWalletConfig } from "./types";
import { LocalWallet } from "@thirdweb-dev/wallets";
export declare const CreateLocalWallet_Password: React.FC<{
    onConnect: () => void;
    goBack: () => void;
    localWalletConf: LocalWalletConfig;
    renderBackButton: boolean;
    persist: boolean;
    setConnectedWallet: ConnectUIProps<LocalWallet>["setConnectedWallet"];
    setConnectionStatus: ConnectUIProps<LocalWallet>["setConnectionStatus"];
}>;
export declare const CreateLocalWallet_Guest: React.FC<{
    onConnect: () => void;
    goBack: () => void;
    localWallet: LocalWalletConfig;
    persist: boolean;
    setConnectedWallet: ConnectUIProps<LocalWallet>["setConnectedWallet"];
    setConnectionStatus: ConnectUIProps<LocalWallet>["setConnectionStatus"];
}>;
//# sourceMappingURL=CreateLocalWallet.d.ts.map