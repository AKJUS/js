import { readContract } from "../../../../../transaction/read-contract.js";
import type { BaseTransactionOptions } from "../../../../../transaction/types.js";

import { decodeAbiParameters } from "viem";
import type { Hex } from "../../../../../utils/encoding/hex.js";

const FN_SELECTOR = "0x8971e55c" as const;
const FN_INPUTS = [] as const;
const FN_OUTPUTS = [
  {
    name: "",
    type: "uint256",
    internalType: "uint256",
  },
] as const;

/**
 * Decodes the result of the BEFORE_APPROVE_ERC20_FLAG function call.
 * @param result - The hexadecimal result to decode.
 * @returns The decoded result as per the FN_OUTPUTS definition.
 * @extension HOOKS
 * @example
 * ```ts
 * import { decodeBEFORE_APPROVE_ERC20_FLAGResult } from "thirdweb/extensions/hooks";
 * const result = decodeBEFORE_APPROVE_ERC20_FLAGResult("...");
 * ```
 */
export function decodeBEFORE_APPROVE_ERC20_FLAGResult(result: Hex) {
  return decodeAbiParameters(FN_OUTPUTS, result)[0];
}

/**
 * Calls the "BEFORE_APPROVE_ERC20_FLAG" function on the contract.
 * @param options - The options for the BEFORE_APPROVE_ERC20_FLAG function.
 * @returns The parsed result of the function call.
 * @extension HOOKS
 * @example
 * ```ts
 * import { BEFORE_APPROVE_ERC20_FLAG } from "thirdweb/extensions/hooks";
 *
 * const result = await BEFORE_APPROVE_ERC20_FLAG();
 *
 * ```
 */
export async function BEFORE_APPROVE_ERC20_FLAG(
  options: BaseTransactionOptions,
) {
  return readContract({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: [],
  });
}
