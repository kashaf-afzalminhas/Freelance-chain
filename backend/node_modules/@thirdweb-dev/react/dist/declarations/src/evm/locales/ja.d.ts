import { DeepPartial } from "../utils/applyOverrides";
import { ThirdwebLocale } from "./types";
export declare function jaDefault(): ThirdwebLocale;
/**
 * Calling this function will return the default Japanese locale object to be set on [`ThirdwebProvider`](https://portal.thirdweb.com/react/v4/ThirdwebProvider) to localize the thirdweb components.
 *
 * You can also overrides parts of the default locale object by passing an object with the same structure as the default locale object and only those parts will be overridden.
 *
 * @example
 * ### Use default Locale
 * ```tsx
 * const japanese = ja();
 * ```
 *
 * ### Override Locale
 * ```ts
 * const japanese = ja({
 *  connectWallet: {
 *    signIn: "サインイン"
 *  }
 * })
 * ```
 *
 * Pass it to [`ThirdwebProvider`](https://portal.thirdweb.com/react/v4/ThirdwebProvider)'s `locale` prop to localize the thirdweb components.
 *
 * ```tsx
 * function Example() {
 *   return (
 *      <ThirdwebProvider locale={japanese}>
 *        <App />
 *      </ThirdwebProvider>
 *    )
 * }
 * ```
 *
 * @locale
 */
export declare function ja(overrides?: DeepPartial<ThirdwebLocale>): ThirdwebLocale;
//# sourceMappingURL=ja.d.ts.map