## Installation

- Install it first: `npm i pkgs-compat`

## Usage

```
<!-- /index.ts -->
----------------------------------------------------------------
const rawPackages = {
  "@types/jest": "~29.5",
  "@types/node": "~20",
  "@typescript-eslint/eslint-plugin": "~7.6",
  "@typescript-eslint/parser": "~7.6",
  "conventional-changelog-cli": "^4.1.0",
  "cz-conventional-changelog": "^3.3.0",
  eslint: "~8.56",
  "eslint-config-prettier": "~9.1",
  "eslint-plugin-jest": "~28.2",
  husky: "^8.0.3",
  jest: "~29.7",
  "lint-staged": "^13.3.0",
  nodemon: "^3.1.0",
  nyc: "^15.1.0",
  prettier: "~3.2",
  rimraf: "~5.0",
  "ts-api-utils": "~1.3",
  "ts-jest": "~29.1",
  "ts-node": "^10.9.2",
  typescript: "~5.4",
};

const targetPackages = [
  "commitizen",
  "cz-conventional-changelog",
  "@commitlint/cli",
  "@commitlint/config-conventional",
];

(async () => {
  await processTargetPackages(rawPackages, targetPackages);
})();

----------------------------------------------------------------
<!-- Output -->

Finding common compatible versions for commitizen
Added compatible version 4.3.0 for commitizen
Finding common compatible versions for cz-conventional-changelog
Added compatible version 3.3.0 for cz-conventional-changelog
Finding common compatible versions for @commitlint/cli
Added compatible version 19.3.0 for @commitlint/cli
Finding common compatible versions for @commitlint/config-conventional
Added compatible version 19.2.2 for @commitlint/config-conventional
```
