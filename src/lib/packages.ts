import type { TCompatiblePackage, TPackage } from "../types/type";
import { getCompatibleVersion } from "./versions";
import { compare } from "semver";

/**
 * Validates the input to the main function.
 *
 * The main function takes two arguments: rawPackages and targetPackages.
 * rawPackages is a dictionary of package names and their versions, where the keys are strings and the values are strings.
 * targetPackages is a list of package names to process.
 *
 * This function is responsible for checking that both of these arguments are provided.
 * If either argument is null or undefined, it will throw an error with the message "Missing required argument(s)".
 *
 * The reason we need to validate the input is that the main function relies on the values of rawPackages and targetPackages
 * to function correctly. If we don't validate the input, we could end up with a runtime error.
 *
 * @param rawPackages A dictionary of package names and their versions, where the keys are strings and the values are strings.
 * @param targetPackages A list of package names to process.
 * @returns void
 * @throws Will throw an error if rawPackages or targetPackages is null or undefined.
 */
export const validateInput = (
  rawPackages: Record<string, string>,
  targetPackages: string[]
) => {
  if (!rawPackages || !targetPackages) {
    throw new Error("Missing required argument(s)");
  }
};

/**
 * Returns a list of packages, where each package is an object with two properties: "name" and "version".
 * The "name" property is the name of the package, and the "version" property
 * is the version of the package.
 *
 * The input is a dictionary of package names and their versions, where the keys are strings and the values are strings.
 * We loop through each key-value pair in the dictionary using Object.keys()
 * and Object.values(), and create an array of objects with two properties: "name" and "version".
 * The "name" property is the key, and the "version" property is the corresponding
 * value from the dictionary.
 * @param rawPackages The dictionary of package names and their versions.
 * @returns A list of packages, where each package is an object with two properties: "name" and "version".
 */
export const getGivenPackages = (
  rawPackages: Record<string, string>
): TPackage[] =>
  Object.keys(rawPackages).map((name) => ({
    name,
    version: rawPackages[name],
  }));

/**
 * Adds a compatible version of the target package to the given package list if one exists.
 * This function does the following:
 * 1. It first checks if the given list of packages already has a package with the target package name.
 *    If it does, it does not add a new package to the list, and instead returns null.
 * 2. If the list of given packages does not have a package with the target package name,
 *    it fetches all versions of the target package that are compatible with the given packages.
 * 3. If there is at least one compatible version of the target package,
 *    it adds the latest compatible version to the list of given packages,
 *    and returns an object with the target package name and the compatible version range.
 * 4. If there are no compatible versions of the target package, it does not add a new package to the list,
 *    and instead returns null.
 * @param givenPackages The list of packages to check for compatibility with the target package.
 * @param targetPackageName The name of the target package to check compatibility with.
 * @returns An object with the target package name and the compatible version range, or null if no compatible version was found.
 */
const processTargetPackage = async (
  givenPackages: TPackage[],
  targetPackageName: string
): Promise<TCompatiblePackage | null> => {
  // If the list of given packages already contains a package with the target package name, return null
  if (givenPackages.some((pkg) => pkg.name === targetPackageName)) {
    console.log(
      `Target package ${targetPackageName} is already in the given packages list`
    );
    return null;
  }

  // Get all compatible versions of the target package for the given packages
  const versions = await getCompatibleVersion(givenPackages, targetPackageName);

  // If there are no compatible versions of the target package, return null
  if (versions.length === 0) {
    console.log(`No compatible version found for ${targetPackageName}`);
    return null;
  }

  // Add the latest compatible version of the target package to the list of given packages
  const latestVersion = [...versions].sort((a, b) => compare(b, a))[0];
  givenPackages.push({
    name: targetPackageName,
    version: `~${latestVersion}`,
  });

  // Get the oldest compatible version of the target package and the latest compatible version
  const oldestVersion = [...versions].sort((a, b) => compare(a, b))[0];

  // Log the number of packages in the list, the name of the added package, and the compatible version range
  console.log(`Given packages: ${givenPackages.length}`);
  console.log(
    `Added compatible version ${latestVersion} for ${targetPackageName}`
  );
  console.log(
    "Compatible range for package " +
      `${targetPackageName}` +
      " is: " +
      `${oldestVersion}` +
      " - " +
      `${latestVersion}`
  );

  // Return an object with the target package name and the compatible version range
  return {
    name: targetPackageName,
    version: {
      oldest: oldestVersion,
      latest: latestVersion,
    },
  };
};

/**
 * Takes a dictionary of package names and their versions, and a list of target package names.
 * It returns a list of objects, where each object has the target package name and the compatible version range.
 * If a target package is already in the input dictionary, it will be ignored.
 * If a target package does not have a compatible version, it will not be included in the output list.
 * @param rawPackages A dictionary of package names and their versions.
 * @param targetPackages A list of package names to check for compatibility with the input packages.
 * @returns A list of objects with the target package name and the compatible version range.
 */
export const processTargetPackages = async (
  rawPackages: { [key: string]: string },
  targetPackages: string[]
): Promise<TCompatiblePackage[]> => {
  // Validate input
  validateInput(rawPackages, targetPackages);

  // Get the list of packages from the input dictionary
  const givenPackages = getGivenPackages(rawPackages);

  // Create a set of package names from the given packages to check for duplicates
  const givenPackageNames = new Set(givenPackages.map((pkg) => pkg.name));

  // Filter out target packages that are already in the input dictionary
  const targetPackagesToProcess = targetPackages.filter(
    (pkgName) => !givenPackageNames.has(pkgName)
  );

  // Create a list of promises that resolve to a compatible version or null
  const compatiblePackageListPromises = targetPackagesToProcess.map((pkgName) =>
    processTargetPackage(givenPackages, pkgName)
  );

  // Wait for all the promises to resolve
  const compatiblePackages = await Promise.all(compatiblePackageListPromises);

  // Filter out any null results, and return the list of compatible packages
  const compatiblePackageList = compatiblePackages.filter(
    (pkg): pkg is TCompatiblePackage => pkg !== null
  );

  return compatiblePackageList;
};
