/// <reference types="react" />
import { WalletInstance, WalletConfig } from "@thirdweb-dev/react-core";
import { SmartWallet } from "@thirdweb-dev/wallets";
export declare const SmartWalletConnecting: React.FC<{
    onBack: () => void;
    onConnect: () => void;
    smartWallet: WalletConfig<SmartWallet>;
    personalWalletConfig: WalletConfig;
    personalWallet: WalletInstance;
    personalWalletChainId: number;
    switchChainPersonalWallet: (chainId: number) => void;
}>;
//# sourceMappingURL=SmartWalletConnecting.d.ts.map