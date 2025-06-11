import { ConnectUIProps, WalletConfig } from "@thirdweb-dev/react-core";
import { WCConnectableWallet } from "./WCConnectableWallet";
import { ExtensionAndQRScreensLocale } from "../../../evm/locales/types";
export declare const ExtensionOrWCConnectionUI: (props: {
    walletConnectUris: {
        ios: string;
        android: string;
        other: string;
    };
    walletLocale: ExtensionAndQRScreensLocale;
    meta: WalletConfig["meta"];
    isInstalled?: () => boolean;
    supportedWallets: WalletConfig[];
    connect: ConnectUIProps<WCConnectableWallet>["connect"];
    connected: ConnectUIProps<WCConnectableWallet>["connected"];
    goBack: ConnectUIProps<WCConnectableWallet>["goBack"];
    setConnectedWallet: ConnectUIProps<WCConnectableWallet>["setConnectedWallet"];
    setConnectionStatus: ConnectUIProps<WCConnectableWallet>["setConnectionStatus"];
    createWalletInstance: () => WCConnectableWallet;
}) => import("react/jsx-runtime").JSX.Element | null;
//# sourceMappingURL=ExtensionORWCConnectionUI.d.ts.map