/// <reference types="react" />
import { ConnectUIProps, WalletConfig } from "@thirdweb-dev/react-core";
import { PaperWallet } from "@thirdweb-dev/wallets";
import { PaperLoginType } from "./types";
export declare const PaperFormUI: (props: {
    onSelect: (loginType: PaperLoginType) => void;
    googleLoginSupported: boolean;
    walletConfig: WalletConfig<PaperWallet>;
    setConnectionStatus: ConnectUIProps<PaperWallet>["setConnectionStatus"];
    setConnectedWallet: ConnectUIProps<PaperWallet>["setConnectedWallet"];
    createWalletInstance: ConnectUIProps<PaperWallet>["createWalletInstance"];
}) => import("react/jsx-runtime").JSX.Element;
export declare const PaperFormUIScreen: React.FC<{
    onSelect: (loginType: PaperLoginType) => void;
    onBack: () => void;
    modalSize: "compact" | "wide";
    googleLoginSupported: boolean;
    walletConfig: WalletConfig<PaperWallet>;
    setConnectionStatus: ConnectUIProps<PaperWallet>["setConnectionStatus"];
    setConnectedWallet: ConnectUIProps<PaperWallet>["setConnectedWallet"];
    createWalletInstance: ConnectUIProps<PaperWallet>["createWalletInstance"];
}>;
//# sourceMappingURL=PaperFormUI.d.ts.map