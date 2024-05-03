import { NpmPeerResponseCache } from "./cache";
import type { TNpmPeerResponse, TPackage } from "../types/type";

/**
 * Finds the common compatible versions of a target package for the given list of packages.
 * @param givenPackages The list of packages to check for compatibility with the target package.
 * @param targetPackageName The name of the target package to check compatibility with.
 * @returns A list of compatible versions of the target package.
 */
const findCompatibleVersions = async (
  givenPackages: TPackage[],
  targetPackageName: string
): Promise<string[]> => {
  const versionSets = await Promise.all(
    givenPackages.map((givenPackage) =>
      findCompatibleVersion(givenPackage, targetPackageName)
    )
  );

  return versionSets.reduce<string[]>(
    (acc: string[], curr: string[]): string[] => {
      const intersection = acc.filter((version) => curr.includes(version));
      return intersection.length > 0 ? intersection : acc;
    },
    versionSets[0]
  );
};
/**
 * Fetches the list of compatible versions of a target package for the given package.
 * @param givenPackage The package to check for compatibility.
 * @param targetPackageName The name of the target package to check compatibility with.
 * @returns A list of compatible versions of the target package.
 */
const findCompatibleVersion = async (
  givenPackage: TPackage,
  targetPackageName: string
): Promise<string[]> => {
  const { version: givenPackageVersion } = givenPackage;
  const cacheKey = `${givenPackage.name}@${givenPackageVersion}--${targetPackageName}`;

  if (NpmPeerResponseCache.has(cacheKey)) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return NpmPeerResponseCache.get(cacheKey)!;
  }

  const apiUrl = `https://www.npmpeer.dev/find?package=${givenPackage.name}&version=${givenPackage.version}&dep=${targetPackageName}`;
  const response = await fetch(apiUrl);
  const data = (await response.json()) as TNpmPeerResponse;

  const versions = data.content.map(({ version }) => version);
  NpmPeerResponseCache.set(cacheKey, versions);

  return versions;
};

export const getCompatibleVersion = async (
  givenPackages: TPackage[],
  targetPackageName: string
) => {
  console.log(`Finding common compatible versions for ${targetPackageName}`);

  try {
    const versions = await findCompatibleVersions(
      givenPackages,
      targetPackageName
    );

    if (!versions) {
      throw new Error("findCompatibleVersions returned null");
    }

    return versions;
  } catch (error) {
    console.error(
      `An error was thrown while trying to find compatible versions for ${targetPackageName}. Error:`,
      error
    );
    throw error;
  }
};
