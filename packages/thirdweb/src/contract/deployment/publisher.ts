import { polygon } from "../../chains/chain-definitions/polygon.js";
import type { ThirdwebClient } from "../../client/client.js";
import { download } from "../../storage/download.js";
import { readContract } from "../../transaction/read-contract.js";
import {
  type FetchDeployMetadataResult,
  fetchDeployMetadata,
} from "../../utils/any-evm/deploy-metadata.js";
import { extractIPFSUri } from "../../utils/bytecode/extractIPFS.js";
import { resolveImplementation } from "../../utils/bytecode/resolveImplementation.js";

import { type ThirdwebContract, getContract } from "../contract.js";

const CONTRACT_PUBLISHER_ADDRESS = "0xf5b896Ddb5146D5dA77efF4efBb3Eae36E300808"; // Polygon only
export const THIRDWEB_DEPLOYER = "0xdd99b75f095d0c4d5112aCe938e4e6ed962fb024";

/**
 * @internal
 */
export async function fetchPublishedContractMetadata(options: {
  client: ThirdwebClient;
  contractId: string;
  publisher?: string;
  version?: string;
}): Promise<FetchDeployMetadataResult> {
  // TODO LRU cache
  const publishedContract = await fetchPublishedContract({
    client: options.client,
    publisherAddress: options.publisher || THIRDWEB_DEPLOYER,
    contractId: options.contractId,
    version: options.version,
  });
  return fetchDeployMetadata({
    client: options.client,
    uri: publishedContract.publishMetadataUri,
  });
}

// TODO: clean this up
/**
 *
 * @param contract
 * @example
 * @internal
 */
export async function fetchDeployBytecodeFromPublishedContractMetadata(
  contract: ThirdwebContract,
): Promise<string | undefined> {
  const { bytecode } = await resolveImplementation(contract);
  const compilerMetaUri = extractIPFSUri(bytecode);
  // early return if no compiler metadata
  if (!compilerMetaUri) {
    return undefined;
  }
  const contractPublisher = getContract({
    client: contract.client,
    chain: polygon,
    address: CONTRACT_PUBLISHER_ADDRESS,
  });
  const publishedMetadataUri = await readContract({
    contract: contractPublisher,
    method:
      "function getPublishedUriFromCompilerUri(string) returns (string[])",
    params: [compilerMetaUri],
  });
  if (publishedMetadataUri.length === 0) {
    throw Error(
      `Could not resolve published metadata URI from ${compilerMetaUri}`,
    );
  }

  const pubmeta = await Promise.all(
    publishedMetadataUri
      .filter((uri) => uri.length > 0)
      .map((uri) =>
        download({ uri, client: contract.client })
          .then((res) => res.text())
          .then(JSON.parse),
      ),
  );

  return pubmeta.length > 0
    ? await (
        await download({ uri: pubmeta[0].bytecodeUri, client: contract.client })
      ).text()
    : undefined;
}

const GET_PUBLISHED_CONTRACT_ABI = {
  inputs: [
    {
      internalType: "address",
      name: "_publisher",
      type: "address",
    },
    {
      internalType: "string",
      name: "_contractId",
      type: "string",
    },
  ],
  name: "getPublishedContract",
  outputs: [
    {
      components: [
        {
          internalType: "string",
          name: "contractId",
          type: "string",
        },
        {
          internalType: "uint256",
          name: "publishTimestamp",
          type: "uint256",
        },
        {
          internalType: "string",
          name: "publishMetadataUri",
          type: "string",
        },
        {
          internalType: "bytes32",
          name: "bytecodeHash",
          type: "bytes32",
        },
        {
          internalType: "address",
          name: "implementation",
          type: "address",
        },
      ],
      internalType: "struct IContractPublisher.CustomContractInstance",
      name: "published",
      type: "tuple",
    },
  ],
  stateMutability: "view",
  type: "function",
} as const;

const GET_PUBLISHED_CONTRACT_VERSIONS_ABI = {
  inputs: [
    {
      internalType: "address",
      name: "_publisher",
      type: "address",
    },
    {
      internalType: "string",
      name: "_contractId",
      type: "string",
    },
  ],
  name: "getPublishedContractVersions",
  outputs: [
    {
      components: [
        {
          internalType: "string",
          name: "contractId",
          type: "string",
        },
        {
          internalType: "uint256",
          name: "publishTimestamp",
          type: "uint256",
        },
        {
          internalType: "string",
          name: "publishMetadataUri",
          type: "string",
        },
        {
          internalType: "bytes32",
          name: "bytecodeHash",
          type: "bytes32",
        },
        {
          internalType: "address",
          name: "implementation",
          type: "address",
        },
      ],
      internalType: "struct IContractPublisher.CustomContractInstance[]",
      name: "published",
      type: "tuple[]",
    },
  ],
  stateMutability: "view",
  type: "function",
} as const;

/**
 * @contract
 */
type FetchPublishedContractOptions = {
  publisherAddress: string;
  contractId: string;
  version?: string;
  client: ThirdwebClient;
};

/**
 * Fetches the published contract based on the provided options.
 * @param options - The options for fetching the published contract.
 * @returns The published contract.
 * @throws Error if the contract version or published contract is not found.
 * @example
 * ```ts
 * const publishedContract = await fetchPublishedContract({
 *  publisherAddress: "0x1234",
 *  contractName: "MyContract",
 *  version: "1.0.0",
 *  client: client,
 * });
 * ```
 * @contract
 */
export async function fetchPublishedContract(
  options: FetchPublishedContractOptions,
) {
  const contractPublisher = getContract({
    client: options.client,
    chain: polygon,
    address: CONTRACT_PUBLISHER_ADDRESS,
  });
  if (!options.version || options.version === "latest") {
    return await readContract({
      contract: contractPublisher,
      method: GET_PUBLISHED_CONTRACT_ABI,
      params: [options.publisherAddress, options.contractId],
    });
  }
  const allVersions = await readContract({
    contract: contractPublisher,
    method: GET_PUBLISHED_CONTRACT_VERSIONS_ABI,
    params: [options.publisherAddress, options.contractId],
  });

  const versionsMetadata = (
    await Promise.all(
      allVersions.map((version) => {
        return download({
          uri: version.publishMetadataUri,
          client: options.client,
        }).then((res) => res.json());
      }),
    )
  ).map((item, index) => {
    return {
      name: allVersions[index]?.contractId,
      publishedTimestamp: allVersions[index]?.publishTimestamp,
      publishedMetadata: item,
    };
  });

  // find the version that matches the version string
  const versionMatch = versionsMetadata.find(
    (metadata) =>
      // Will probably only need metadata.publishedMetadata.version unless its an outdated contract
      metadata.publishedMetadata.extendedMetadata?.version ===
        options.version ||
      metadata.publishedMetadata.version === options.version,
  );
  if (!versionMatch) {
    throw Error("Contract version not found");
  }
  // match the version back to the contract based on the published timestamp
  const publishedContract = allVersions.find(
    (c) => c.publishTimestamp === versionMatch.publishedTimestamp,
  );
  if (!publishedContract) {
    throw Error(
      `No published contract found for ${options.contractId} at version by '${options.publisherAddress}'`,
    );
  }
  return publishedContract;
}
