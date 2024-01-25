import { transaction, type TxOpts } from "../../../transaction/transaction.js";
import { parseUnits } from "viem";

type MintToParams = { to: string } & (
  | {
      amount: number;
    }
  | {
      amountGwei: bigint;
    }
);

export function mintTo(options: TxOpts<MintToParams>) {
  return transaction({
    ...options,
    method: "function mintTo(address to, uint256 amount)",
    params: async () => {
      let amount: bigint;
      if ("amount" in options) {
        // if we need to parse the amount from ether to gwei then we pull in the decimals extension
        const { decimals } = await import("../read/decimals.js");
        // if this fails we fall back to `18` decimals
        const d = await decimals(options).catch(() => 18);
        // turn ether into gwei
        amount = parseUnits(options.amount.toString(), d);
      } else {
        amount = options.amountGwei;
      }
      return [options.to, amount] as const;
    },
  });
}
