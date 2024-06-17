import type { Chain } from "../src/types";
export default {
  "chain": "BEAM",
  "chainId": 4337,
  "explorers": [
    {
      "name": "Beam Explorer",
      "url": "https://subnets.avax.network/beam",
      "standard": "EIP3091"
    }
  ],
  "faucets": [
    "https://faucet.onbeam.com"
  ],
  "features": [
    {
      "name": "EIP1559"
    }
  ],
  "infoURL": "https://www.onbeam.com",
  "name": "Beam",
  "nativeCurrency": {
    "name": "Beam",
    "symbol": "BEAM",
    "decimals": 18
  },
  "networkId": 4337,
  "rpc": [
    "https://4337.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://build.onbeam.com/rpc",
    "wss://build.onbeam.com/ws",
    "https://subnets.avax.network/beam/mainnet/rpc",
    "wss://subnets.avax.network/beam/mainnet/ws"
  ],
  "shortName": "beam",
  "slug": "beam",
  "testnet": false
} as const satisfies Chain;