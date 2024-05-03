import { NpmPeerResponseCache } from "./cache";
import type { TNpmPeerResponse, TPackage } from "../types/type";

/**
 * Given a list of packages (of type TPackage), and the name of a target package (of type string),
 * this function finds the common compatible versions of the target package among the given packages.
 *
 * To do this, it first fetches the list of compatible versions of the target package for each given package.
 * This is done by making a separate API call for each given package.
 *
 * Once it has all the lists of compatible versions, it combines them into a single list of compatible versions
 * by finding the intersection of all the lists. The intersection is computed by filtering the list of compatible
 * versions for each given package to only include the versions that are present in all the lists.
 *
 * If there are no common compatible versions, the function will return an empty array.
 *
 * @param givenPackages The list of packages to check for compatibility with the target package, of type TPackage.
 * @param targetPackageName The name of the target package to check compatibility with, of type string.
 * @returns A list of compatible versions of the target package, of type string[].
 */
export const findCompatibleVersions = async (
  givenPackages: TPackage[],
  targetPackageName: string
): Promise<string[]> => {
  // Make API calls to fetch the list of compatible versions of the target package for each given package
  const versionSets = await Promise.all(
    givenPackages.map((givenPackage) =>
      findCompatibleVersion(givenPackage, targetPackageName)
    )
  );

  // Combine the lists of compatible versions into a single list of compatible versions
  // by finding the intersection of all the lists
  return versionSets.reduce<string[]>(
    (acc: string[], curr: string[]): string[] => {
      // Find the intersection of the current list of compatible versions with the accumulated list of compatible versions
      const intersection = acc.filter((version) => curr.includes(version));

      // If there are any common compatible versions, return the intersection
      // Otherwise, return the accumulated list of compatible versions (which is initially the first list of compatible versions)
      return intersection.length > 0 ? intersection : acc;
    },
    versionSets[0]
  );
};

/**
 * This function fetches the list of compatible versions of a target package
 * for the given package.
 *
 * A compatible version is one that satisfies the semantic versioning
 * compatibility rules: https://docs.npmjs.com/cli/v7/configuring-npm/package-json#dependencies.
 *
 * The function first checks the cache to see if the list of compatible versions
 * has already been fetched and stored. If it has, the function returns the list
 * from the cache without making another API call.
 *
 * If the list of compatible versions is not in the cache, the function makes
 * an API call to the npmpeer.dev API to fetch the list of compatible versions.
 * The API call is made using the given package's name and version, and the
 * name of the target package to check compatibility with.
 *
 * Once the API call returns with the list of compatible versions, the function
 * stores the list in the cache so that it can be quickly retrieved in the future.
 *
 * The function returns the list of compatible versions as an array of strings.
 * Each string is a version number that satisfies the compatibility rules.
 *
 * @param givenPackage The package to check for compatibility, of type TPackage.
 * @param targetPackageName The name of the target package to check compatibility with, of type string.
 * @returns A list of compatible versions of the target package, of type string[].
 */
export const findCompatibleVersion = async (
  givenPackage: TPackage,
  targetPackageName: string
): Promise<string[]> => {
  const { name, version } = givenPackage;
  const cacheKey = `${name}@${version}--${targetPackageName}`;

  if (NpmPeerResponseCache.has(cacheKey)) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return NpmPeerResponseCache.get(cacheKey)!;
  }

  const apiUrl = `https://www.npmpeer.dev/find?package=${name}&version=${version}&dep=${targetPackageName}`;
  const response = await fetch(apiUrl);
  const data = (await response.json()) as TNpmPeerResponse;

  const versions = data.content.map(
    ({ version: versionString }) => versionString
  );
  NpmPeerResponseCache.set(cacheKey, versions);

  return versions;
};

/**
 * This function finds the common compatible versions of a target package
 * among a list of given packages.
 *
 * A compatible version is one that satisfies the semantic versioning
 * compatibility rules: https://docs.npmjs.com/cli/v7/configuring-npm/package-json#dependencies.
 *
 * The function first checks the cache to see if the list of compatible versions
 * has already been fetched and stored. If it has, the function returns the list
 * from the cache without making another API call.
 *
 * If the list of compatible versions is not in the cache, the function makes
 * an API call to the npmpeer.dev API to fetch the list of compatible versions.
 * The API call is made using the given package's name and version, and the
 * name of the target package to check compatibility with.
 *
 * Once the API call returns with the list of compatible versions, the function
 * stores the list in the cache so that it can be quickly retrieved in the future.
 *
 * The function returns the list of compatible versions as an array of strings.
 * Each string is a version number that satisfies the compatibility rules.
 *
 * @param givenPackages The list of packages to check for compatibility, of type TPackage[].
 * @param targetPackageName The name of the target package to check compatibility with, of type string.
 * @returns A list of compatible versions of the target package, of type string[].
 */
export const getCompatibleVersion = async (
  givenPackages: TPackage[],
  targetPackageName: string
): Promise<string[]> => {
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
