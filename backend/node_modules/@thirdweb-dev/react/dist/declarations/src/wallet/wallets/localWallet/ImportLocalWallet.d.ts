/// <reference types="react" />
import { ConnectUIProps } from "@thirdweb-dev/react-core";
import { LocalWallet } from "@thirdweb-dev/wallets";
import type { LocalWalletConfig } from "./types";
export declare const ImportLocalWallet: React.FC<{
    onConnect: () => void;
    goBack: () => void;
    localWalletConf: LocalWalletConfig;
    persist: boolean;
    setConnectedWallet: ConnectUIProps<LocalWallet>["setConnectedWallet"];
    setConnectionStatus: ConnectUIProps<LocalWallet>["setConnectionStatus"];
}>;
//# sourceMappingURL=ImportLocalWallet.d.ts.map