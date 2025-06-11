/// <reference types="react" />
import { SelectUIProps, WalletConfig, WalletInstance } from "@thirdweb-dev/react-core";
type WalletSelectUIProps = {
    connect: (walletConfig: WalletConfig, options?: any) => Promise<WalletInstance>;
    connectionStatus: SelectUIProps<any>["connectionStatus"];
    createWalletInstance: (walletConfig: WalletConfig) => WalletInstance;
    setConnectedWallet: SelectUIProps<any>["setConnectedWallet"];
    setConnectionStatus: SelectUIProps<any>["setConnectionStatus"];
    connectedWallet?: WalletInstance;
    connectedWalletAddress?: string;
};
export declare const WalletSelector: React.FC<{
    walletConfigs: WalletConfig[];
    selectWallet: (wallet: WalletConfig) => void;
    onGetStarted: () => void;
    title: string;
    selectUIProps: WalletSelectUIProps;
}>;
export declare const WalletSelection: React.FC<{
    walletConfigs: WalletConfig[];
    selectWallet: (wallet: WalletConfig) => void;
    maxHeight?: string;
    selectUIProps: WalletSelectUIProps;
}>;
export declare function WalletEntryButton(props: {
    walletConfig: WalletConfig<any>;
    selectWallet: () => void;
}): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=WalletSelector.d.ts.map