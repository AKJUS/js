import { withCache } from "~thirdweb/utils/promise/withCache.js";
import type { ThirdwebClient } from "~thirdweb/client/client.js";
import type { ApiChain } from "./types.js";

export type Chain =
  | {
      id: bigint | number;
      rpc: string;
      nativeCurrency?: {
        name?: string;
        symbol?: string;
        decimals?: number;
      };
    }
  // TODO: add all possible chainIds somehow for autocompletion
  // eslint-disable-next-line @typescript-eslint/ban-types
  | ((number | bigint) & {});

/**
 * Defines a chain based on the provided options.
 * @param options - The options for defining the chain.
 * @returns The defined chain.
 * @example
 * ```ts
 * import { defineChain } from "thirdweb";
 *
 * const chain = defineChain(1);
 * // or with custom RPC
 * const chain = defineChain({ id: 1, rpc: "https:..." });
 * ```
 */
export function defineChain(options: Chain): Readonly<Chain> {
  // this does... nothing right now, but it may in the future?
  return options;
}

type GetRpcUrlForChainOptions = {
  client: ThirdwebClient;
  chain: Chain;
};

/**
 * Retrieves the RPC URL for the specified chain.
 * If a custom RPC URL is defined in the options, it will be used.
 * Otherwise, a thirdweb RPC URL will be constructed using the chain ID and client ID.
 * @param options - The options object containing the chain and client information.
 * @returns The RPC URL for the specified chain.
 * @internal
 */
export function getRpcUrlForChain(options: GetRpcUrlForChainOptions): string {
  // if the chain is just the chainId use the thirdweb rpc
  if (typeof options.chain === "bigint" || typeof options.chain === "number") {
    return `https://${options.chain.toString()}.rpc.thirdweb.com/${
      options.client.clientId
    }`;
  }
  // otherwise if custom rpc is defined use that.
  if (!!options.chain.rpc.length) {
    return options.chain.rpc;
  }
  // otherwise construct thirdweb RPC url from the chain object
  return `https://${options.chain.id.toString()}.rpc.thirdweb.com/${
    options.client.clientId
  }`;
}

/**
 * Retrieves the chain ID from the provided chain.
 * @param chain - The chain.
 * @returns The chain ID.
 * @internal
 */
export function getChainIdFromChain(chain: Chain): bigint {
  if (typeof chain === "bigint" || typeof chain === "number") {
    return BigInt(chain);
  }
  return BigInt(chain.id);
}

/**
 * Retrieves the chain symbol from the provided chain.
 * @param chain - The chain.
 * @returns The chain symbol.
 * @internal
 */
export async function getChainSymbol(chain: Chain): Promise<string> {
  if (
    typeof chain === "bigint" ||
    typeof chain === "number" ||
    !chain.nativeCurrency?.symbol
  ) {
    const chainId = getChainIdFromChain(chain);
    return getChainDataForChainId(chainId)
      .then((data) => data.nativeCurrency.symbol)
      .catch(() => {
        // if we fail to fetch the chain data, return "ETH" as a fallback
        return "ETH";
      });
  }
  // if we have a symbol, return it
  return chain.nativeCurrency.symbol;
}

/**
 * Retrieves the number of decimals for the native currency of a given chain.
 * If the chain is not recognized or the data cannot be fetched, it returns a fallback value of 18.
 * @param chain - The chain for which to retrieve the decimals.
 * @returns A promise that resolves to the number of decimals for the native currency of the chain.
 * @internal
 */
export async function getChainDecimals(chain: Chain): Promise<number> {
  if (
    typeof chain === "bigint" ||
    typeof chain === "number" ||
    !chain.nativeCurrency?.decimals
  ) {
    const chainId = getChainIdFromChain(chain);
    return getChainDataForChainId(chainId)
      .then((data) => data.nativeCurrency.decimals)
      .catch(() => {
        // if we fail to fetch the chain data, return 18 as a fallback (most likely it's 18)
        return 18;
      });
  }
  // if we have a symbol, return it
  return chain.nativeCurrency.decimals;
}

type FetchChainResponse =
  | {
      data: ApiChain;
      error?: never;
    }
  | {
      data?: never;
      error: unknown;
    };

/**
 * @internal
 */
export function getChainDataForChainId(chainId: bigint): Promise<ApiChain> {
  return withCache(
    async () => {
      const res = await fetch(`https://api.thirdweb.com/v1/chains/${chainId}`);
      if (!res.ok) {
        throw new Error(`Failed to fetch chain data for chainId ${chainId}`);
      }

      const response = (await res.json()) as FetchChainResponse;
      if (response.error) {
        throw new Error(`Failed to fetch chain data for chainId ${chainId}`);
      }
      if (!response.data) {
        throw new Error(`Failed to fetch chain data for chainId ${chainId}`);
      }
      return response.data;
    },
    {
      cacheKey: `chain:${chainId}`,
      cacheTime: 5 * 60 * 1000, // 5 minutes
    },
  );
}
