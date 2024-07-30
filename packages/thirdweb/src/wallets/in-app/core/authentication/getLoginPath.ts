import type { ThirdwebClient } from "../../../../client/client.js";
import { getThirdwebBaseUrl } from "../../../../utils/domains.js";
import type { AuthOption } from "../../../../wallets/types.js";
import type { Ecosystem } from "../../web/types.js";

export const getLoginPath = ({
  authOption,
  client,
  ecosystem,
  mode = "popup",
  redirectUrl,
}: {
  authOption: AuthOption;
  client: ThirdwebClient;
  ecosystem?: Ecosystem;
  mode?: "popup" | "redirect" | "mobile";
  redirectUrl?: string;
}) => {
  let baseUrl = `${getThirdwebBaseUrl("inAppWallet")}/api/2024-05-05/login/${authOption}?clientId=${client.clientId}`;
  if (ecosystem?.partnerId) {
    baseUrl = `${baseUrl}&ecosystemId=${ecosystem.id}&ecosystemPartnerId=${ecosystem.partnerId}`;
  } else if (ecosystem) {
    baseUrl = `${baseUrl}&ecosystemId=${ecosystem.id}`;
  }

  if (mode === "redirect") {
    const formattedRedirectUrl = new URL(redirectUrl || window.location.href);
    formattedRedirectUrl.searchParams.set("walletId", ecosystem?.id || "inApp");
    formattedRedirectUrl.searchParams.set("authProvider", authOption);
    baseUrl = `${baseUrl}&redirectUrl=${encodeURIComponent(formattedRedirectUrl.toString())}`;
  }

  if (mode === "mobile") {
    if (!redirectUrl) {
      throw new Error("Redirect URL is required for mobile authentication");
    }
    baseUrl = `${baseUrl}&redirectUrl=${encodeURIComponent(redirectUrl)}`;
  }

  return baseUrl;
};

// Can we delete these and use the above instead?
export const getOtpLoginUrl = ({
  authOption,
}: {
  authOption: AuthOption;
}): string => {
  return `${getThirdwebBaseUrl("inAppWallet")}/api/2024-05-05/login/${authOption}`;
};

export const getOtpVerifyUrl = ({
  authOption,
}: {
  authOption: AuthOption;
}): string => {
  return `${getThirdwebBaseUrl("inAppWallet")}/api/2024-05-05/login/${authOption}/callback`;
};
