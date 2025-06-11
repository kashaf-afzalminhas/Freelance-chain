import type { PaymentsSDKError, SupportedChainName } from "@thirdweb-dev/payments";
import React from "react";
interface VerifyOwnershipWithPaperProps {
    onSuccess?: (code: string) => void;
    onError?: (error: PaymentsSDKError) => void;
    onWindowClose?: () => void;
    children?: ({ onClick, }: {
        onClick: () => void;
    }) => React.ReactNode | React.ReactNode;
    redirectUrl?: string;
    className?: string;
    chainName?: SupportedChainName;
    clientId?: string;
}
export declare const VerifyOwnershipWithPaper: React.FC<VerifyOwnershipWithPaperProps>;
export {};
//# sourceMappingURL=VerifyOwnershipWithPaper.d.ts.map