import { useQueries, useQuery } from "@tanstack/react-query";
import { getChainDataForChain } from "../../../chains/utils.js";
import type { Chain } from "../../../chains/types.js";
import pLimit from "p-limit";
import { useMemo } from "react";

function getQueryOptions(chain?: Chain) {
  return {
    queryKey: ["chain", chain],
    enabled: !!chain,
    staleTime: 1000 * 60 * 60, // 1 hour
  } as const;
}

/**
 * @internal
 */
export function useChainQuery(chain?: Chain) {
  return useQuery({
    ...getQueryOptions(chain),
    queryFn: async () => {
      if (!chain) {
        throw new Error("chainId is required");
      }
      return getChainDataForChain(chain);
    },
  });
}

/**
 * @param chains - array of `Chains`
 * @param maxConcurrency - maximum number of concurrent requests to make
 * @internal
 */
export function useChainsQuery(chains: Chain[], maxConcurrency: number) {
  const queryList = useMemo(() => {
    const limit = pLimit(maxConcurrency);
    return chains.map((chain) => {
      return {
        ...getQueryOptions(chain),
        queryFn: () => limit(() => getChainDataForChain(chain)),
      };
    });
  }, [chains, maxConcurrency]);

  return useQueries({
    queries: queryList,
  });
}
