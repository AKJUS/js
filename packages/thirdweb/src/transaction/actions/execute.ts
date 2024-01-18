import type { AbiFunction } from "abitype";
import type { Transaction } from "../index.js";
import type { IWallet } from "../../wallets/interfaces/wallet.js";

export async function execute<
  const abiFn extends AbiFunction,
  const wallet extends IWallet<any>,
>(tx: Transaction<abiFn>, wallet: wallet) {
  if (!wallet || !wallet.address) {
    throw new Error("no wallet to sign with");
  }
  return wallet.sendTransaction(tx);
}
