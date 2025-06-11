/// <reference types="react" />
export declare const ModalTitle: import("@emotion/styled").StyledComponent<{
    theme?: import("@emotion/react").Theme | undefined;
    as?: import("react").ElementType<any> | undefined;
} & {
    centerOnMobile?: boolean | undefined;
}, import("react").DetailedHTMLProps<import("react").HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>, {}>;
type ModalDescriptionProps = {
    centerOnMobile?: boolean;
    sm?: boolean;
};
export declare const ModalDescription: import("@emotion/styled").StyledComponent<{
    theme?: import("@emotion/react").Theme | undefined;
    as?: import("react").ElementType<any> | undefined;
} & ModalDescriptionProps, import("react").DetailedHTMLProps<import("react").HTMLAttributes<HTMLParagraphElement>, HTMLParagraphElement>, {}>;
export declare const BackButton: React.FC<{
    onClick: () => void;
    style?: React.CSSProperties;
}>;
export declare const HelperLink: import("@emotion/styled").StyledComponent<{
    theme?: import("@emotion/react").Theme | undefined;
    as?: import("react").ElementType<any> | undefined;
} & {
    md?: boolean | undefined;
}, import("react").DetailedHTMLProps<import("react").AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>, {}>;
export {};
//# sourceMappingURL=modalElements.d.ts.map