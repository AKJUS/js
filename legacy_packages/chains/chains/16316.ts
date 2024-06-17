import type { Chain } from "../src/types";
export default {
  "chain": "Avalanche",
  "chainId": 16316,
  "explorers": [],
  "faucets": [],
  "features": [],
  "icon": {
    "url": "https://images.ctfassets.net/9bazykntljf6/62CceHSYsRS4D9fgDSkLRB/877cb8f26954e1743ff535fd7fdaf78f/avacloud-placeholder.svg",
    "width": 256,
    "height": 256,
    "format": "svg"
  },
  "infoURL": "https://avacloud.io",
  "name": "Stripe Test",
  "nativeCurrency": {
    "name": "Stripe Test Token",
    "symbol": "STR",
    "decimals": 18
  },
  "networkId": 16316,
  "redFlags": [],
  "rpc": [
    "https://16316.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://subnets.avax.network/defi-kingdoms/dfk-chain/rpc"
  ],
  "shortName": "Stripe Test",
  "slug": "stripe-test",
  "testnet": true
} as const satisfies Chain;