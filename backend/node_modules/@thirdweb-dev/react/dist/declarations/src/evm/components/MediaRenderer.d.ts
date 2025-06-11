import React from "react";
import type { MediaRendererProps } from "./types";
/**
 * Component that renders any asset stored on IPFS (or anywhere else), given the IPFS URI / URL.
 *
 * Under the hood, the asset is fetched from IPFS through the thirdweb IPFS gateway (or just
 * a regular fetch if the `src` is not an IPFS URI).
 * The [mime type](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types) of the
 * asset is determined and the appropriate component is rendered on the UI.
 *
 * For example, if the URI points to an image, the `img` tag will be used. If it is a video, the `video` tag will be used, etc.
 * The component currently supports:
 *
 * - Images
 * - Videos
 * - Audio files
 * - 3D Models
 * - SVGs (for [on-chain NFTs](https://blog.thirdweb.com/guides/how-to-create-on-chain-nfts-with-thirdweb/))
 * - `iframes` and `HTML`
 * - If none of these are appropriate, the fallback is a link to the asset
 *
 * @example
 *
 * Provide the IPFS URI (or any URL that points to media) to the `src` prop to render the asset.
 *
 * ```jsx
 * import { MediaRenderer } from "@thirdweb-dev/react";
 *
 * function Home() {
 * 	return (
 * 		// Any URL that points to media (IPFS URI, HTTP URL, etc.)
 * 		<MediaRenderer src="ipfs://QmV4HC9fNrPJQeYpbW55NLLuSBMyzE11zS1L4HmL6Lbk7X" />
 * 	);
 * }
 * ```
 *
 * @remarks
 * The default size of rendered media is 300px x 300px, but this can be changed using the `width` and `height` props.
 *
 * You can use `npx thirdweb upload <path/to/file>` to upload any file to IPFS and get the IPFS URI.
 *
 * @param props -
 * The props for the component
 *
 * ### src (required)
 *
 * The [src](https://www.w3schools.com/tags/att_img_src.asp) attribute specifies the URL of the media.
 *
 * This can be an IPFS URI, or any URL that points to media (e.g. HTTP URL, etc.).
 *
 * ```jsx
 * import { MediaRenderer } from "@thirdweb-dev/react";
 *
 * function Home() {
 * 	return (
 * 		<MediaRenderer
 * 			// highlight-next-line
 * 			src="ipfs://QmV4HC9fNrPJQeYpbW55NLLuSBMyzE11zS1L4HmL6Lbk7X"
 * 		/>
 * 	);
 * }
 * ```
 *
 *
 * ### alt (recommended)
 *
 * The [alt](https://www.w3schools.com/tags/att_img_alt.asp) attributes provides alternative
 * information for the media, if a user for some reason cannot view it
 * (due to slow connection, an error in the `src` attribute, or if the user is visually impaired).
 *
 * The default value is `""`.
 *
 * ```jsx
 * import { MediaRenderer } from "@thirdweb-dev/react";
 *
 * function Home() {
 * 	return (
 * 		// Any URL that points to media (IPFS URI, HTTP URL, etc.)
 * 		<MediaRenderer
 * 			src="ipfs://QmV4HC9fNrPJQeYpbW55NLLuSBMyzE11zS1L4HmL6Lbk7X"
 * 			// highlight-next-line
 * 			alt="A red circle"
 * 		/>
 * 	);
 * }
 * ```
 *
 *
 * ### poster (optional)
 *
 * The [poster](https://www.w3schools.com/tags/att_video_poster.asp) is the image
 * that is shown before the video is played.
 *
 * The default value is the first frame of the video.
 *
 * If the `src` is not a video, this prop is ignored.
 *
 * ```jsx
 * import { MediaRenderer } from "@thirdweb-dev/react";
 *
 * function Home() {
 * 	return (
 * 		// Any URL that points to media (IPFS URI, HTTP URL, etc.)
 * 		<MediaRenderer
 * 			src="ipfs://Qmb9ZV5yznE4C4YvyJe8DVFv1LSVkebdekY6HjLVaKmHZi"
 * 			// highlight-next-line
 * 			poster="ipfs://QmV4HC9fNrPJQeYpbW55NLLuSBMyzE11zS1L4HmL6Lbk7X"
 * 		/>
 * 	);
 * }
 * ```
 *
 *
 * ### controls (optional)
 *
 * Show the media controls (play, pause, etc.) for the media, where applicable.
 *
 * The default value is `false`.
 *
 * ```jsx
 * import { ThirdwebNftMedia } from "@thirdweb-dev/react";
 *
 * function Home() {
 * 	// ... Get the NFT metadata
 *
 * 	return (
 * 		<ThirdwebNftMedia
 * 			metadata={metadata}
 * 			// highlight-next-line
 * 			controls={true}
 * 		/>
 * 	);
 * }
 * ```
 *
 *
 * ### height (optional)
 *
 * The height of the rendered media.
 *
 * The default value is `auto`.
 *
 * ```jsx
 * import { ThirdwebNftMedia } from "@thirdweb-dev/react";
 *
 * function Home() {
 * 	// ... Get the NFT metadata
 *
 * 	return (
 * 		<ThirdwebNftMedia
 * 			metadata={metadata}
 * 			// highlight-next-line
 * 			height={500}
 * 		/>
 * 	);
 * }
 * ```
 *
 * ### width (optional)
 *
 * The width of the rendered media.
 *
 * The default value is `auto`.
 *
 * ```jsx
 * import { ThirdwebNftMedia } from "@thirdweb-dev/react";
 *
 * function Home() {
 * 	// ... Get the NFT metadata
 *
 * 	return (
 * 		<ThirdwebNftMedia
 * 			metadata={metadata}
 * 			// highlight-next-line
 * 			width={500}
 * 		/>
 * 	);
 * }
 * ```
 *
 *
 * ### requireInteraction (optional)
 *
 * Require user interaction to play the media (i.e. disable autoplay).
 *
 * The default value is `false`.
 *
 * ```jsx
 * import { ThirdwebNftMedia } from "@thirdweb-dev/react";
 *
 * function Home() {
 * 	// ... Get the NFT metadata
 *
 * 	return (
 * 		<ThirdwebNftMedia
 * 			metadata={metadata}
 * 			// highlight-next-line
 * 			requireInteraction={true}
 * 		/>
 * 	);
 * }
 * ```
 *
 *
 * ### className (optional)
 *
 * Apply custom CSS styles to the button using a class name.
 *
 * ```jsx
 * import { ThirdwebNftMedia } from "@thirdweb-dev/react";
 *
 * function Home() {
 * 	// ... Get the NFT metadata
 *
 * 	return (
 * 		<ThirdwebNftMedia
 * 			metadata={metadata}
 * 			// highlight-next-line
 * 			className="my-custom-class"
 * 		/>
 * 	);
 * }
 * ```
 *
 * ### style (optional)
 *
 * Apply custom CSS styles to the button using an inline style.
 *
 * ```jsx
 * import { ThirdwebNftMedia } from "@thirdweb-dev/react";
 *
 * function Home() {
 * 	// ... Get the NFT metadata
 *
 * 	return (
 * 		<ThirdwebNftMedia
 * 			metadata={metadata}
 * 			// highlight-next-line
 * 			style={{ backgroundColor: "red" }}
 * 		/>
 * 	);
 * }
 * ```
 */
export declare const MediaRenderer: React.ForwardRefExoticComponent<MediaRendererProps & React.RefAttributes<HTMLMediaElement>>;
export interface MediaType {
    url?: string;
    mimeType?: string;
}
/**
 * Hook for resolving the media type and URL of a given URI (including IPFS URIs).
 *
 * The `<MediaRenderer />` component renders the relevant.
 * HTML element for a given URL, including IPFS URIs. e.g. `<img>` for images, `<video>` for videos, etc.
 *
 * @example
 * ### Usage with fully formed url
 * ```jsx
 * const Component = () => {
 *   const resolved = useResolvedMediaType("https://example.com/video.mp4");
 *   console.log("mime type", resolved.data.mimeType);
 *   console.log("url", resolved.data.url);
 *   return null;
 * }
 * ```
 *
 * ### Usage with IPFS cid
 * ```jsx
 * const Component = () => {
 *   const resolved = useResolvedMediaType("ipfs://QmWATWQ7fVPP2EFGu71UkfnqhYXDYH566qy47CnJDgvsd");
 *   console.log("mime type", resolved.data.mimeType);
 *   console.log("url", resolved.data.url);
 *   return null;
 * }
 * ```
 *
 * @param uri - The uri to resolve (can be a url or a `ipfs://\<cid\>`)
 * @param mimeType - The mime type of the media
 * @param gatewayUrl - The url of the IPFS gateway to use (defaults to `https://ipfs.io/ipfs/`)
 *
 * @returns
 * The hook returns an object containing two properties:
 * - `url`: The fully resolved URL, or `undefined` if the URI is invalid.
 * - `mimeType`: The mime type of the media, or `undefined` if the URI is invalid.
 *
 * @metadata
 */
export declare function useResolvedMediaType(uri?: string, mimeType?: string, gatewayUrl?: string): {
    url: string;
    mimeType: string | undefined;
};
//# sourceMappingURL=MediaRenderer.d.ts.map