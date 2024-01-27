import type {
  Abi,
  AbiFunction,
  AbiParametersToPrimitiveTypes,
  ExtractAbiFunctionNames,
} from "abitype";
import type { ThirdwebContract } from "../contract/index.js";
import type { ParseMethod } from "../abi/types.js";

type ParamsOption<abiFn extends AbiFunction> = abiFn["inputs"] extends {
  length: 0;
}
  ? // allow omitting "params" if there are no inputs
    { params?: unknown[] }
  : {
      params:
        | AbiParametersToPrimitiveTypes<abiFn["inputs"]>
        | (() => Promise<AbiParametersToPrimitiveTypes<abiFn["inputs"]>>);
    };

export type TransactionInput<
  abi extends Abi,
  method extends AbiFunction | string,
> = TxOpts<object, abi> & {
  method: method;
} & ParamsOption<ParseMethod<abi, method>>;

// the only difference here is that
export type Transaction<abiFn extends AbiFunction> = TransactionInput<
  Abi,
  abiFn
>;

export function transaction<
  const abi extends Abi,
  // if an abi has been passed into the contract, restrict the method to function names of the abi
  const method extends abi extends { length: 0 }
    ? AbiFunction | string
    : ExtractAbiFunctionNames<abi>,
>(options: TransactionInput<abi, method>) {
  return options as Transaction<ParseMethod<abi, method>>;
}

export type TxOpts<T extends object = object, abi extends Abi = Abi> = {
  contract: ThirdwebContract<abi>;
} & T;
