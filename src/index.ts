import { TNpmPeerResponse, TPackage } from "./lib/type";

export const NpmPeerResponseCache: Map<string, string[]> = new Map();

/**
 * Fetches the list of compatible versions of a target package for the given package.
 * @param givenPackage The package to check for compatibility.
 * @param targetPackageName The name of the target package to check compatibility with.
 * @returns A list of compatible versions of the target package.
 */
export async function findCompatibleVersion(
  givenPackage: TPackage,
  targetPackageName: string
): Promise<string[]> {
  const { version: givenPackageVersion } = givenPackage;
  const cacheKey = `${givenPackage.name}@${givenPackageVersion}--${targetPackageName}`;

  if (NpmPeerResponseCache.has(cacheKey)) {
    return NpmPeerResponseCache.get(cacheKey)!;
  }

  const apiUrl = `https://www.npmpeer.dev/find?package=${givenPackage.name}&version=${givenPackage.version}&dep=${targetPackageName}`;
  const response = await fetch(apiUrl);
  const data = (await response.json()) as TNpmPeerResponse;

  const versions = data.content.map(({ version }) => version);
  NpmPeerResponseCache.set(cacheKey, versions);

  return versions;
}

/**
 * Finds the common compatible versions of a target package for the given list of packages.
 * @param givenPackages The list of packages to check for compatibility with the target package.
 * @param targetPackageName The name of the target package to check compatibility with.
 * @returns A list of compatible versions of the target package.
 */
async function findCompatibleVersions(
  givenPackages: TPackage[],
  targetPackageName: string
): Promise<string[]> {
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
}

const rawPackages = {
  "@mantine/core": "^7.1.7",
  "@mantine/dates": "^7.1.7",
  "@mantine/hooks": "^7.1.7",
  "@types/node": "20.6.2",
  "@types/react": "18.2.22",
  "@types/react-dom": "18.2.7",
  autoprefixer: "10.4.15",
  axios: "^1.5.1",
  bulma: "^0.9.4",
  dayjs: "^1.11.10",
  eslint: "8.49.0",
  "eslint-config-next": "13.5.1",
  exifr: "^7.1.3",
  fingerprintjs2: "^2.1.4",
  immer: "^10.0.3",
  next: "^13.5.1",
  postcss: "^8.4.31",
  "query-string": "^8.1.0",
  react: "18.2.0",
  "react-dom": "18.2.0",
  "react-hook-form": "^7.47.0",
  "react-select": "^5.7.7",
  "react-toastify": "^9.1.3",
  tailwindcss: "3.3.3",
  typescript: "5.2.2",
  zustand: "^4.4.3",
  "@types/mocha": "^10.0.6",
  cypress: "^13.8.1",
  md5: "^2.3.0",
  "postcss-preset-mantine": "^1.9.1",
  "postcss-simple-vars": "^7.0.1",
};

const givenPackages = Object.entries(rawPackages).map<TPackage>(
  ([name, version]) => ({ name, version })
);

const targetPackageName = "sass";
console.log("Finding common compatible versions for " + targetPackageName);

findCompatibleVersions(givenPackages, targetPackageName);
