import type { AbiParameterToPrimitiveType } from "abitype";
import type {
  BaseTransactionOptions,
  WithOverrides,
} from "../../../../../transaction/types.js";
import { prepareContractCall } from "../../../../../transaction/prepare-contract-call.js";
import { encodeAbiParameters } from "../../../../../utils/abi/encodeAbiParameters.js";
import { once } from "../../../../../utils/promise/once.js";
import type { ThirdwebContract } from "../../../../../contract/contract.js";
import { detectMethod } from "../../../../../utils/bytecode/detectExtension.js";

/**
 * Represents the parameters for the "initialize" function.
 */
export type InitializeParams = WithOverrides<{
  name: AbiParameterToPrimitiveType<{
    type: "string";
    name: "_name";
    internalType: "string";
  }>;
  symbol: AbiParameterToPrimitiveType<{
    type: "string";
    name: "_symbol";
    internalType: "string";
  }>;
  contractURI: AbiParameterToPrimitiveType<{
    type: "string";
    name: "_contractURI";
    internalType: "string";
  }>;
  owner: AbiParameterToPrimitiveType<{
    type: "address";
    name: "_owner";
    internalType: "address";
  }>;
  extensions: AbiParameterToPrimitiveType<{
    type: "address[]";
    name: "_extensions";
    internalType: "address[]";
  }>;
  extensionInstallData: AbiParameterToPrimitiveType<{
    type: "bytes[]";
    name: "_extensionInstallData";
    internalType: "bytes[]";
  }>;
}>;

export const FN_SELECTOR = "0x62835ade" as const;
const FN_INPUTS = [
  {
    type: "string",
    name: "_name",
    internalType: "string",
  },
  {
    type: "string",
    name: "_symbol",
    internalType: "string",
  },
  {
    type: "string",
    name: "_contractURI",
    internalType: "string",
  },
  {
    type: "address",
    name: "_owner",
    internalType: "address",
  },
  {
    type: "address[]",
    name: "_extensions",
    internalType: "address[]",
  },
  {
    type: "bytes[]",
    name: "_extensionInstallData",
    internalType: "bytes[]",
  },
] as const;
const FN_OUTPUTS = [] as const;

/**
 * Checks if the `initialize` method is supported by the given contract.
 * @param contract The ThirdwebContract.
 * @returns A promise that resolves to a boolean indicating if the `initialize` method is supported.
 * @extension MODULAR
 * @example
 * ```ts
 * import { isInitializeSupported } from "thirdweb/extensions/modular";
 *
 * const supported = await isInitializeSupported(contract);
 * ```
 */
export async function isInitializeSupported(contract: ThirdwebContract<any>) {
  return detectMethod({
    contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
  });
}

/**
 * Encodes the parameters for the "initialize" function.
 * @param options - The options for the initialize function.
 * @returns The encoded ABI parameters.
 * @extension MODULAR
 * @example
 * ```ts
 * import { encodeInitializeParams } "thirdweb/extensions/modular";
 * const result = encodeInitializeParams({
 *  name: ...,
 *  symbol: ...,
 *  contractURI: ...,
 *  owner: ...,
 *  extensions: ...,
 *  extensionInstallData: ...,
 * });
 * ```
 */
export function encodeInitializeParams(options: InitializeParams) {
  return encodeAbiParameters(FN_INPUTS, [
    options.name,
    options.symbol,
    options.contractURI,
    options.owner,
    options.extensions,
    options.extensionInstallData,
  ]);
}

/**
 * Encodes the "initialize" function into a Hex string with its parameters.
 * @param options - The options for the initialize function.
 * @returns The encoded hexadecimal string.
 * @extension MODULAR
 * @example
 * ```ts
 * import { encodeInitialize } "thirdweb/extensions/modular";
 * const result = encodeInitialize({
 *  name: ...,
 *  symbol: ...,
 *  contractURI: ...,
 *  owner: ...,
 *  extensions: ...,
 *  extensionInstallData: ...,
 * });
 * ```
 */
export function encodeInitialize(options: InitializeParams) {
  // we do a "manual" concat here to avoid the overhead of the "concatHex" function
  // we can do this because we know the specific formats of the values
  return (FN_SELECTOR +
    encodeInitializeParams(options).slice(
      2,
    )) as `${typeof FN_SELECTOR}${string}`;
}

/**
 * Prepares a transaction to call the "initialize" function on the contract.
 * @param options - The options for the "initialize" function.
 * @returns A prepared transaction object.
 * @extension MODULAR
 * @example
 * ```ts
 * import { initialize } from "thirdweb/extensions/modular";
 *
 * const transaction = initialize({
 *  contract,
 *  name: ...,
 *  symbol: ...,
 *  contractURI: ...,
 *  owner: ...,
 *  extensions: ...,
 *  extensionInstallData: ...,
 *  overrides: {
 *    ...
 *  }
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function initialize(
  options: BaseTransactionOptions<
    | InitializeParams
    | {
        asyncParams: () => Promise<InitializeParams>;
      }
  >,
) {
  const asyncOptions = once(async () => {
    return "asyncParams" in options ? await options.asyncParams() : options;
  });

  return prepareContractCall({
    contract: options.contract,
    method: [FN_SELECTOR, FN_INPUTS, FN_OUTPUTS] as const,
    params: async () => {
      const resolvedOptions = await asyncOptions();
      return [
        resolvedOptions.name,
        resolvedOptions.symbol,
        resolvedOptions.contractURI,
        resolvedOptions.owner,
        resolvedOptions.extensions,
        resolvedOptions.extensionInstallData,
      ] as const;
    },
    value: async () => (await asyncOptions()).overrides?.value,
    accessList: async () => (await asyncOptions()).overrides?.accessList,
    gas: async () => (await asyncOptions()).overrides?.gas,
    gasPrice: async () => (await asyncOptions()).overrides?.gasPrice,
    maxFeePerGas: async () => (await asyncOptions()).overrides?.maxFeePerGas,
    maxPriorityFeePerGas: async () =>
      (await asyncOptions()).overrides?.maxPriorityFeePerGas,
    nonce: async () => (await asyncOptions()).overrides?.nonce,
    extraGas: async () => (await asyncOptions()).overrides?.extraGas,
  });
}
