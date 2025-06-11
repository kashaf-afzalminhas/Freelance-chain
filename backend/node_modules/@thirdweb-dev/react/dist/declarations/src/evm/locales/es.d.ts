import { DeepPartial } from "../utils/applyOverrides";
import { ThirdwebLocale } from "./types";
export declare function esDefault(): ThirdwebLocale;
/**
 * Calling this function will return the default Spanish locale object to be set on [`ThirdwebProvider`](https://portal.thirdweb.com/react/v4/ThirdwebProvider) to localize the thirdweb components.
 *
 * You can also overrides parts of the default locale object by passing an object with the same structure as the default locale object and only those parts will be overridden.
 *
 * @example
 * ### Use default Locale
 * ```tsx
 * const spanish = es();
 * ```
 *
 * ### Override Locale
 * ```ts
 * const spanish = es({
 *  connectWallet: {
 *    signIn: "Iniciar sesión"
 *  }
 * })
 * ```
 *
 * Pass it to [`ThirdwebProvider`](https://portal.thirdweb.com/react/v4/ThirdwebProvider)'s `locale` prop to localize the thirdweb components.
 *
 * ```tsx
 * function Example() {
 *   return (
 *      <ThirdwebProvider locale={spanish}>
 *        <App />
 *      </ThirdwebProvider>
 *    )
 * }
 * ```
 *
 * @locale
 */
export declare function es(overrides?: DeepPartial<ThirdwebLocale>): ThirdwebLocale;
//# sourceMappingURL=es.d.ts.map