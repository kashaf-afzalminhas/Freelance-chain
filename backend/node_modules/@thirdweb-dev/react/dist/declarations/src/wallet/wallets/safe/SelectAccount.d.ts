/// <reference types="react" />
import { ConnectUIProps, WalletConfig } from "@thirdweb-dev/react-core";
import { SafeWallet } from "@thirdweb-dev/wallets";
export declare const SelectAccount: React.FC<{
    onBack: () => void;
    onConnect: () => void;
    renderBackButton?: boolean;
    connect: ConnectUIProps<SafeWallet>["connect"];
    connectionStatus: ConnectUIProps<SafeWallet>["connectionStatus"];
    meta: WalletConfig["meta"];
}>;
//# sourceMappingURL=SelectAccount.d.ts.map