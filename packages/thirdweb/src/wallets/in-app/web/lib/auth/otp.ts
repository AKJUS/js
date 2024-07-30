import type { ThirdwebClient } from "../../../../../client/client.js";
import {
  getOtpLoginUrl,
  getOtpVerifyUrl,
} from "../../../core/authentication/getLoginPath.js";
import type {
  AuthStoredTokenWithCookieReturnType,
  MultiStepAuthArgsType,
  PreAuthArgsType,
} from "../../../core/authentication/types.js";
import type { Ecosystem } from "../../types.js";

/**
 * @internal
 */
export const sendOtp = async (args: PreAuthArgsType): Promise<void> => {
  const { client, ecosystem } = args;
  const url = getOtpLoginUrl({ authOption: args.strategy });

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "x-client-id": client.clientId,
  };

  if (ecosystem?.id) {
    headers["x-ecosystem-id"] = ecosystem.id;
  }

  if (ecosystem?.partnerId) {
    headers["x-ecosystem-partner-id"] = ecosystem.partnerId;
  }

  const body = (() => {
    switch (args.strategy) {
      case "email":
        return {
          email: args.email,
        };
      case "phone":
        return {
          phone: args.phoneNumber,
        };
    }
  })();

  const response = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error("Failed to send verification code");
  }

  return await response.json();
};

/**
 * @internal
 */
export const verifyOtp = async (
  args: MultiStepAuthArgsType & {
    client: ThirdwebClient;
    ecosystem?: Ecosystem;
  },
): Promise<AuthStoredTokenWithCookieReturnType> => {
  const { client, ecosystem } = args;
  const url = getOtpVerifyUrl({ authOption: args.strategy });

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "x-client-id": client.clientId,
  };

  if (ecosystem?.id) {
    headers["x-ecosystem-id"] = ecosystem.id;
  }

  if (ecosystem?.partnerId) {
    headers["x-ecosystem-partner-id"] = ecosystem.partnerId;
  }

  const body = (() => {
    switch (args.strategy) {
      case "email":
        return {
          email: args.email,
          code: args.verificationCode,
        };
      case "phone":
        return {
          phone: args.phoneNumber,
          code: args.verificationCode,
        };
    }
  })();

  const response = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error("Failed to verify verification code");
  }

  return await response.json();
};
