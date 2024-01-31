import { getFetchClient } from "../utils/fetch.js";
import { resolveScheme, type ResolveSchemeOptions } from "../utils/ipfs.js";

export type DownloadOptions = ResolveSchemeOptions;

/**
 * Downloads a file from the specified URI.
 * @param options - The download options.
 * @returns A Promise that resolves to the downloaded file.
 * @throws An error if the URI scheme is invalid.
 * @example
 * ```ts
 * import { download } from "thirdweb/storage";
 * const file = await download({
 *  client,
 *  uri: "ipfs://Qm...",
 * });
 * ```
 */
export async function download(options: DownloadOptions) {
  return await getFetchClient(options.client)(resolveScheme(options));
}
