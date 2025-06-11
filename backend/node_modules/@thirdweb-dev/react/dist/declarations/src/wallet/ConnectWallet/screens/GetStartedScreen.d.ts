/// <reference types="react" />
export declare const GetStartedScreen: React.FC<{
    onBack?: () => void;
    walletName: string;
    walletIconURL: string;
    chromeExtensionLink?: string;
    googlePlayStoreLink?: string;
    appleStoreLink?: string;
    header?: React.ReactNode;
    footer?: React.ReactNode;
    showBack?: boolean;
    locale: {
        scanToDownload: string;
    };
}>;
export declare const ButtonLink: import("@emotion/styled").StyledComponent<{
    theme?: import("@emotion/react").Theme | undefined;
    as?: import("react").ElementType<any> | undefined;
}, import("react").DetailedHTMLProps<import("react").ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>, {}>;
//# sourceMappingURL=GetStartedScreen.d.ts.map