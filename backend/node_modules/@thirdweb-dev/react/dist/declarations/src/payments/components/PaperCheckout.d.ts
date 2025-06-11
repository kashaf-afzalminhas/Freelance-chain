import React from "react";
import type { ContractType, CustomContractArgWrapper, ReadMethodCallType, WriteMethodCallType } from "../interfaces/CustomContract";
import type { PaymentSuccessResult } from "../interfaces/PaymentSuccessResult";
import type { TransferSuccessResult } from "../interfaces/TransferSuccessResult";
export declare enum PaperCheckoutDisplay {
    /**
     * Open the checkout in a new popup centered over the parent window.
     */
    POPUP = "POPUP",
    /**
     * Open the checkout in a new browser tab.
     */
    NEW_TAB = "NEW_TAB",
    /**
     * Open the checkout in a modal on the parent page with a darkened background.
     *
     * NOTE: Pay with Crypto is disabled in this display mode.
     */
    MODAL = "MODAL",
    /**
     * Open the checkout in a drawer on the right side of the parent page with a darkened background.
     *
     * NOTE: Pay with Crypto is disabled in this display mode.
     */
    DRAWER = "DRAWER",
    /**
     * Embed the checkout directly on the parent page.
     *
     * NOTE: Pay with Crypto is disabled in this display mode.
     */
    EMBED = "EMBED"
}
export type PaperCheckoutProps<T extends ContractType> = CustomContractArgWrapper<{
    checkoutId: string;
    display?: PaperCheckoutDisplay;
    recipientWalletAddress?: string;
    emailAddress?: string;
    quantity?: number;
    mintMethod?: WriteMethodCallType;
    eligibilityMethod?: ReadMethodCallType;
    metadata?: Record<string, any>;
    appName?: string;
    onOpenCheckout?: () => void;
    onCloseCheckout?: () => void;
    onPaymentSuccess?: (result: PaymentSuccessResult) => void;
    onTransferSuccess?: (result: TransferSuccessResult) => void;
    options?: {
        width: number;
        height: number;
        colorPrimary: string;
        colorBackground: string;
        colorText: string;
        borderRadius: number;
        fontFamily: string;
    };
    children?: React.ReactNode;
}, T>;
export declare const PaperCheckout: <T extends ContractType>({ checkoutId, display, recipientWalletAddress, emailAddress, quantity, eligibilityMethod, mintMethod, metadata, appName, options, onOpenCheckout, onCloseCheckout, onPaymentSuccess, onTransferSuccess, children, ...props }: PaperCheckoutProps<T>) => import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=PaperCheckout.d.ts.map