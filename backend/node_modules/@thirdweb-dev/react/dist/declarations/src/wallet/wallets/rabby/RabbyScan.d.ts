/// <reference types="react" />
import type { RabbyWallet } from "@thirdweb-dev/wallets";
import type { ConnectUIProps, WalletConfig } from "@thirdweb-dev/react-core";
export declare const RabbyScan: React.FC<{
    onBack: () => void;
    onGetStarted: () => void;
    onConnected: () => void;
    walletConfig: WalletConfig<RabbyWallet>;
    hideBackButton: boolean;
    setConnectedWallet: ConnectUIProps<RabbyWallet>["setConnectedWallet"];
    setConnectionStatus: ConnectUIProps<RabbyWallet>["setConnectionStatus"];
}>;
//# sourceMappingURL=RabbyScan.d.ts.map