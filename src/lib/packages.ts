import type { TPackage } from "../types/type";
import { getCompatibleVersion } from "./versions";
import { compare } from "semver";

const validateInput = (
  rawPackages: { [key: string]: string },
  targetPackages: string[]
) => {
  if (!rawPackages || !targetPackages) {
    throw new Error("Missing required argument(s)");
  }
};

const getGivenPackages = (rawPackages: { [key: string]: string }) => {
  return Object.entries(rawPackages).map(([name, version]) => ({
    name,
    version,
  }));
};

const processTargetPackage = async (
  givenPackages: TPackage[],
  targetPackageName: string
) => {
  const versions = await getCompatibleVersion(givenPackages, targetPackageName);

  if (versions.length > 0) {
    const latestVersion = [...versions].sort((a, b) => compare(b, a))[0];
    givenPackages.push({
      name: targetPackageName,
      version: `~${latestVersion}`,
    });
    console.log(
      `Added compatible version ${latestVersion} for ${targetPackageName}`
    );
  } else {
    console.log(`No compatible version found for ${targetPackageName}`);
  }
};

export const processTargetPackages = async (
  rawPackages: { [key: string]: string },
  targetPackages: string[]
) => {
  validateInput(rawPackages, targetPackages);
  const givenPackages = getGivenPackages(rawPackages);

  for (const targetPackageName of targetPackages) {
    await processTargetPackage(givenPackages, targetPackageName);
  }
};
