import QRCodeUtil from "qrcode";
import React from "react";
export declare const QRCode: React.FC<{
    qrCodeUri?: string;
    QRIcon?: React.ReactNode;
    size?: number;
}>;
type Props = {
    ecl?: QRCodeUtil.QRCodeErrorCorrectionLevel;
    size?: number;
    uri: string;
    clearSize?: number;
    image?: React.ReactNode;
    imageBackground?: string;
};
export declare const PlaceholderKeyframes: import("@emotion/react").Keyframes;
export declare const QRPlaceholder: import("@emotion/styled").StyledComponent<{
    theme?: import("@emotion/react").Theme | undefined;
    as?: React.ElementType<any> | undefined;
}, React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>, {}>;
export declare function QRCodeRenderer({ ecl, size: sizeProp, uri, clearSize, image, imageBackground, }: Props): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=QRCode.d.ts.map