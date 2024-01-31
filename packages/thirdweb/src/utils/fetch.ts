import { version } from "../version.js";
import type { ThirdwebClient } from "../index.js";
import { detect, type OperatingSystem } from "detect-browser";

/**
 * @internal
 */
export function getClientFetch(client: ThirdwebClient) {
  return async function (url: string, init?: RequestInit) {
    const headers = new Headers(init?.headers);
    // check if we are making a request to a thirdweb service (we don't want to send any headers to non-thirdweb services)
    if (isThirdwebUrl(url)) {
      if (client.secretKey) {
        headers.set("x-secret-key", client.secretKey);
      } else if (client.clientId) {
        headers.set("x-client-id", client.clientId);
      }
      getPlatformHeaders().forEach(([key, value]) => {
        headers.set(key, value);
      });
    }

    return fetch(url, { ...init, headers });
  };
}

// NOTE: these all start with "." because we want to make sure we don't match (for example) "otherthirdweb.com"
const THIRDWEB_DOMAINS = [
  ".thirdweb.com",
  ".ipfscdn.io",
  // dev domains
  ".thirdweb.dev",
  ".thirdweb-dev.com",
] as const;

/**
 * @internal
 */
function isThirdwebUrl(url: string) {
  try {
    const { hostname } = new URL(url);
    return THIRDWEB_DOMAINS.some((domain) => hostname.endsWith(domain));
  } catch {
    return false;
  }
}

const SDK_NAME = "unified-sdk";

let previousPlatform: [string, string][] | undefined;
/**
 * @internal
 */
export function getPlatformHeaders() {
  if (previousPlatform) {
    return previousPlatform;
  }

  let ua: string | undefined;
  try {
    if (typeof navigator !== "undefined" && "userAgent" in navigator) {
      ua = navigator.userAgent;
    }
  } catch {
    // ignore
  }

  const info = detect(ua);

  if (!info) {
    previousPlatform = Object.entries({
      "x-sdk-platform": "unknown",
      "x-sdk-version": version,
      "x-sdk-os": "unknown",
      "x-sdk-name": SDK_NAME,
    });
  } else {
    previousPlatform = Object.entries({
      "x-sdk-platform":
        info.type === "react-native"
          ? "mobile"
          : info.type === "browser"
            ? "browser"
            : "node",
      "x-sdk-version": version,
      "x-sdk-os": info.os ? parseOs(info.os) : "unknown",
      "x-sdk-name": SDK_NAME,
    });
  }

  return previousPlatform;
}

/**
 * @internal
 */
function parseOs(os: OperatingSystem | NodeJS.Platform) {
  const osLowerCased = os.toLowerCase();
  if (osLowerCased.startsWith("win")) {
    return "win";
  }
  // we do NOT use the lowercase here
  switch (os) {
    case "Mac OS":
      return "mac";
    case "iOS":
      return "ios";
    case "Android OS":
      return "android";
    default:
      // if we somehow fall through here, just replace all spaces with underscores and send it
      return osLowerCased.replace(/\s/gi, "_");
  }
}
