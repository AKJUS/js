import { type TxOpts } from "../../../transaction/transaction.js";
import { readContract } from "../../../transaction/actions/read.js";

export type TokenUriParams = { tokenId: bigint };

/**
 * Retrieves the URI associated with a specific ERC721 token.
 * @param options - The transaction options.
 * @returns A Promise that resolves to the token URI.
 * @example
 * ```ts
 * import { tokenURI } from "thirdweb/extensions/erc721";
 * const uri = await tokenURI({ contract, tokenId: 1n });
 * ```
 */
export function tokenURI(options: TxOpts<TokenUriParams>): Promise<string> {
  return readContract({
    ...options,
    method:
      "function tokenURI(uint256 tokenId) external view returns (string memory)",
    params: [BigInt(options.tokenId)],
  });
}
