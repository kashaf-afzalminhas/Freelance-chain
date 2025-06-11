import type { ICheckoutWithCardConfigs, PaymentsSDKError, PriceSummary, ReviewResult, ICustomizationOptions, Locale } from "@thirdweb-dev/payments";
interface CheckoutWithCardProps {
    clientId?: string;
    sdkClientSecret?: string;
    onPaymentSuccess: (result: {
        transactionId: string;
    }) => void;
    appName?: string;
    options?: ICustomizationOptions;
    onReview?: (result: ReviewResult) => void;
    onError?: (error: PaymentsSDKError) => void;
    onBeforeModalOpen?: (props: {
        url: string;
    }) => void;
    onPriceUpdate?: (priceSummary: PriceSummary) => void;
    configs?: ICheckoutWithCardConfigs;
    /**
     * @deprecated No longer used.
     */
    experimentalUseAltDomain?: boolean;
    /**
     * Sets the locale to a supported language.
     * NOTE: Localization is in early alpha and many languages are not yet supported.
     *
     * Defaults to English.
     */
    locale?: Locale;
}
export declare function CheckoutWithCard(props: CheckoutWithCardProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=CheckoutWithCard.d.ts.map