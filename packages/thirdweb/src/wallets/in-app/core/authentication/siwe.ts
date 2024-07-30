import { signLoginPayload } from "../../../../auth/core/sign-login-payload.js";
import type { LoginPayload } from "../../../../auth/core/types.js";
import type { ThirdwebClient } from "../../../../client/client.js";
import type { InjectedSupportedWalletIds } from "../../../../wallets/__generated__/wallet-ids.js";
import { createWallet } from "../../../../wallets/create-wallet.js";
import { getLoginPath } from "./getLoginPath.js";
import type { AuthStoredTokenWithCookieReturnType } from "./types.js";

/**
 * @internal
 */
export async function siweAuthenticate(args: {
  walletId: InjectedSupportedWalletIds;
  client: ThirdwebClient;
  chainId: number;
}): Promise<AuthStoredTokenWithCookieReturnType> {
  const wallet = createWallet(args.walletId);
  const account = await wallet.connect({ client: args.client });
  const path = getLoginPath({
    authOption: "siwe",
    client: args.client,
  });

  const payload = await (async () => {
    const res = await fetch(path, {
      method: "POST",
      body: JSON.stringify({
        address: account.address,
        chainId: args.chainId,
      }),
    });

    if (!res.ok) throw new Error("Failed to generate SIWE login payload");

    return (await res.json()) satisfies LoginPayload;
  })();
  const { signature } = await signLoginPayload({ payload, account });

  const authResult = await (async () => {
    const res = await fetch(`${path}/callback`, {
      method: "POST",
      body: JSON.stringify({
        signature,
        payload,
      }),
    });

    if (!res.ok) throw new Error("Failed to verify SIWE signature");

    return (await res.json()) satisfies AuthStoredTokenWithCookieReturnType;
  })();
  return authResult;
}
