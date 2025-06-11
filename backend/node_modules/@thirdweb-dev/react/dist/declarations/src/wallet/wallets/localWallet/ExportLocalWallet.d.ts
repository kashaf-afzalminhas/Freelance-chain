/// <reference types="react" />
import { WalletInstance } from "@thirdweb-dev/react-core";
import type { LocalWalletConfig } from "./types";
export declare const ExportLocalWallet: React.FC<{
    onBack?: () => void;
    onExport: () => void;
    localWalletConfig: LocalWalletConfig;
    modalSize: "wide" | "compact";
    walletInstance?: WalletInstance;
    walletAddress?: string;
}>;
//# sourceMappingURL=ExportLocalWallet.d.ts.map