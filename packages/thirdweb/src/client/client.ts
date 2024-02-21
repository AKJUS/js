import { computeClientIdFromSecretKey } from "../utils/client-id.js";
import type { Prettify } from "../utils/type-utils.js";

type FetchConfig = {
  requestTimeoutMs?: number;
  keepalive?: boolean;
  headers?: HeadersInit;
};

type ClientOptions = Prettify<{
  config?: {
    rpc?: {
      fetch?: FetchConfig;
    };
    storage?: {
      fetch?: FetchConfig;
      gateway?: string;
    };
  };
}>;

export type CreateThirdwebClientOptions = Prettify<
  (
    | {
        clientId: string;
        secretKey?: never;
      }
    | {
        clientId?: never;
        secretKey: string;
      }
  ) &
    ClientOptions
>;

export type ThirdwebClient = {
  readonly clientId: string;
  readonly secretKey: string | undefined;
} & Readonly<ClientOptions>;

/**
 * Creates a Thirdweb client with the provided options.
 * @param options - The options for creating the client.
 * @returns The created Thirdweb client.
 * @throws An error if neither `clientId` nor `secretKey` is provided.
 * @example
 * ```ts
 * import { createThirdwebClient } from "thirdweb";
 * const client = createThirdwebClient({ clientId: "..." });
 * ```
 */
export function createThirdwebClient(
  options: CreateThirdwebClientOptions,
): ThirdwebClient {
  const { clientId, secretKey, ...rest } = options;
  // if secretKey is provided, compute the clientId from it (and ignore any clientId passed in)
  if (secretKey) {
    return {
      ...rest,
      clientId: computeClientIdFromSecretKey(secretKey),
      secretKey,
    } as const;
  }
  // otherwise if clientId is provided, use it
  if (clientId) {
    return {
      ...rest,
      clientId: options.clientId,
      secretKey: undefined,
    } as const;
  }

  // otherwise throw an error
  throw new Error("clientId or secretKey must be provided");
}
