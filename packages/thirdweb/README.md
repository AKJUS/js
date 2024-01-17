<p align="center">
<br />
<a href="https://thirdweb.com"><img src="https://github.com/thirdweb-dev/js/blob/main/packages/sdk/logo.svg?raw=true" width="200" alt=""/></a>
<br />
</p>
<h1 align="center">thirdweb</h1>
<p align="center">
<a href="https://www.npmjs.com/package/thirdweb"><img src="https://img.shields.io/npm/v/thirdweb?color=red&label=npm&logo=npm" alt="npm version"/></a>
<a href="https://github.com/thirdweb-dev/js/actions/workflows/build-test-lint.yml"><img alt="Build Status" src="https://github.com/thirdweb-dev/js/actions/workflows/build-test-lint.yml/badge.svg"/></a>
<a href="https://discord.gg/thirdweb"><img alt="Join our Discord!" src="https://img.shields.io/discord/834227967404146718.svg?color=7289da&label=discord&logo=discord&style=flat"/></a>

## Installation

```bash
npm install thirdweb@alpha
```

## Usage

### Backend (Node, Bun, Deno, etc)

```ts
import { createClient } from "thirdweb";
import { privateKeyWallet } from "thirdweb/wallets/private-key";

// Step 1: create a client
const client = createClient({
  // create a secret key at https://thirdweb.com/dashboard
  secretKey: process.env.SECRET_KEY as string,
});

// Step 2: define a contract to interact with
const contract = client.contract({
  // the contract address
  address: "0xBCfaB342b73E08858Ce927b1a3e3903Ddd203980",
  // the chainId of the chain the contract is deployed on
  chainId: 5,
});

// Step 3: read contract state
const balance = await contract.read({
  method: "function balanceOf(address) view returns (uint256)",
  params: ["0x0890C23024089675D072E984f28A93bb391a35Ab"],
});

console.log("beginning balance", balance);

// Step 4: initialize a wallet
const wallet = privateKeyWallet(client);

await wallet.connect({ pkey: process.env.PKEY as string });

// Step 5: create a transaction
const tx = contract.transaction({
  method: "function mintTo(address to, uint256 amount)",
  params: [
    "0x0890C23024089675D072E984f28A93bb391a35Ab",
    BigInt(100) * BigInt(10) ** BigInt(18),
  ],
});

// Step 6: execute the transaction with the wallet
const receipt = await wallet.execute(tx);

console.log("tx hash", receipt.transactionHash);

// Step 7: wait for the receipt to be mined
const txReceipt = await receipt.wait();

console.log(txReceipt);

// Step 8: read contract state
const newBalance = await contract.read({
  method: "function balanceOf(address) view returns (uint256)",
  params: ["0x0890C23024089675D072E984f28A93bb391a35Ab"],
});

console.log("ending balance", newBalance);
```
