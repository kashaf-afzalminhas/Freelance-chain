/// <reference types="react" />
import { ConnectUIProps, WalletConfig } from "@thirdweb-dev/react-core";
import { EmbeddedWallet } from "@thirdweb-dev/wallets";
import type { AuthOption, EmbeddedWalletLoginType } from "./types";
export declare const EmbeddedWalletFormUI: (props: {
    onSelect: (loginType: EmbeddedWalletLoginType) => void;
    walletConfig: WalletConfig<EmbeddedWallet>;
    authOptions: AuthOption[];
    modalSize: "compact" | "wide";
    createWalletInstance: ConnectUIProps<EmbeddedWallet>["createWalletInstance"];
    setConnectionStatus: ConnectUIProps<EmbeddedWallet>["setConnectionStatus"];
    setConnectedWallet: ConnectUIProps<EmbeddedWallet>["setConnectedWallet"];
}) => import("react/jsx-runtime").JSX.Element;
export declare const EmbeddedWalletFormUIScreen: React.FC<{
    onSelect: (loginType: EmbeddedWalletLoginType) => void;
    onBack: () => void;
    modalSize: "compact" | "wide";
    walletConfig: WalletConfig<EmbeddedWallet>;
    authOptions: AuthOption[];
    createWalletInstance: ConnectUIProps<EmbeddedWallet>["createWalletInstance"];
    setConnectionStatus: ConnectUIProps<EmbeddedWallet>["setConnectionStatus"];
    setConnectedWallet: ConnectUIProps<EmbeddedWallet>["setConnectedWallet"];
}>;
//# sourceMappingURL=EmbeddedWalletFormUI.d.ts.map