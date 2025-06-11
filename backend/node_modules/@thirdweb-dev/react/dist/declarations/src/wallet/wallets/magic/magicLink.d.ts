import { MagicLinkAdditionalOptions } from "@thirdweb-dev/wallets";
import type { ConfiguredMagicLinkWallet } from "./types";
/**
 * @wallet
 */
export type MagicWalletConfigOptions = MagicLinkAdditionalOptions & {
    /**
     * If true, the wallet will be tagged as "recommended" in ConnectWallet Modal
     */
    recommended?: boolean;
};
/**
 * A wallet configurator for [Magic Link](https://magic.link/) which allows integrating the wallet with React.
 *
 * It returns a [`WalletConfig`](https://portal.thirdweb.com/references/react/v4/WalletConfig) object which can be used to connect the wallet to via [`ConnectWallet`](https://portal.thirdweb.com/react/v4/components/ConnectWallet) component or [`useConnect`](https://portal.thirdweb.com/references/react/v4/useConnect) hook as mentioned in [Connecting Wallets](https://portal.thirdweb.com/react/v4/connecting-wallets) guide
 *
 * @example
 * ```ts
 * magicLink({
 *   apiKey: "pk_test_123",
 *   emailLogin: true,
 *   smsLogin: true,
 *   oauthOptions: {
 *     providers: ["google", "facebook"],
 *     redirectURI: "https://example.com/foo/bar",
 *   },
 *   type: "auth", // or 'connect'
 * });
 * ```
 *
 * @param config -
 * Object containing the following properties to configure the wallet
 *
 * ### apiKey
 * Your Magic Link apiKey
 *
 * You can get an API key by signing up for an account on [Magic Link's website](https://magic.link/).
 *
 * Must be a `string`
 *
 * ### magicSdkConfiguration (optional)
 * Configuration for [Magic Auth](https://magic.link/docs/auth/overview) SDK
 *
 * This is only relevant if you are using `type: 'auth'` in your config
 *
 * ```ts
 * {
 *   locale?: string;
 *   endpoint?: string;
 *   testMode?: boolean;
 * }
 * ```
 *
 * * `locale` - Customize the language of Magic's modal, email and confirmation screen. See [Localization](https://magic.link/docs/auth/more/customization/localization) for more.
 *
 * * `endpoint` - A URL pointing to the Magic iframe application
 *
 * * `testMode` - Enable [testMode](https://magic.link/docs/auth/introduction/test-mode) to assert the desired behavior through the email address you provide to `loginWithMagicLink` without having to go through the auth flow.
 *
 * ### smsLogin (optional)
 * Specify whether you want to allow users to login with their phone number or not. It is `true` by default
 *
 * This is only relevant if you are using `type: 'auth'`
 *
 * Must be a `boolean`
 *
 * ### emailLogin (optional)
 * Specify whether you want to allow users to login with their email or not. It is `true` by default
 *
 * This is only relevant if you are using `type: 'auth'`
 *
 * Must be a `boolean`
 *
 * ### oauthOptions (optional)
 * Specify which oauth providers you support in `providers` array.
 *
 * Specify which URI to redirect to after the oauth flow is complete in `redirectURI` option. If no `redirectURI` is specified, the user will be redirected to the current page.
 *
 * You must pass full URL and not just a relative path. For example, `"https://example.com/foo"` is valid but `"/foo"` is not.
 * You can use `new URL("/foo", window.location.origin).href` to get the full URL from a relative path based on the current origin.
 *
 * This is only relevant if you are using `type: 'auth'`
 *
 * You also need to enable the oauth providers for your apiKey from [Magic dashboard](https://dashboard.magic.link/).
 *
 * ```ts
 * type OauthOptions = {
 *   redirectURI?: string;
 *   providers: OauthProvider[];
 * };
 *
 * type OauthProvider =
 *   | "google"
 *   | "facebook"
 *   | "apple"
 *   | "github"
 *   | "bitbucket"
 *   | "gitlab"
 *   | "linkedin"
 *   | "twitter"
 *   | "discord"
 *   | "twitch"
 *   | "microsoft";
 * ```
 *
 * ### recommended (optional)
 * Show this wallet as "recommended" in the [`ConnectWallet`](https://portal.thirdweb.com/react/v4/components/ConnectWallet) Modal UI
 *
 * @wallet
 */
export declare function magicLink(config: MagicWalletConfigOptions): ConfiguredMagicLinkWallet;
//# sourceMappingURL=magicLink.d.ts.map