import type { SupportedChainName } from "@thirdweb-dev/payments";
import type { Dispatch, SetStateAction } from "react";
import React from "react";
interface SDKContext {
    chainName: SupportedChainName;
    setChainName: Dispatch<SetStateAction<SupportedChainName>>;
    clientId: string;
    appName: string;
}
export interface PaymentsProviderProps {
    chainName?: SupportedChainName;
    appName?: string;
    clientId?: string;
}
export declare const PaymentsSDKProvider: ({ appName, chainName, clientId, children, }: React.PropsWithChildren<PaymentsProviderProps>) => import("react/jsx-runtime").JSX.Element;
export declare const usePaymentsSDKContext: () => SDKContext;
export {};
//# sourceMappingURL=Provider.d.ts.map