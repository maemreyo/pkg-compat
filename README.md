## Usage

Two options are available:

### Install from `npm i`

* `npm i pkgs-compat`

### Clone this repo

* First, you need to clone this repository
* Simply add your list of the existing packages
* Add your target packages that you want to install into your project
* `npm run serve` and see the results on the terminal

**Example:**
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

## Thanks to `https://www.npmpeer.dev/`
This online tool plays a vital role in the development of this `pkgs-compat`

## Notes
> This package is in development.

### The Problem
This package will work properly in most cases, but there are some exceptions where we might need to check for compatibility issues:

  * **Peer dependencies**: If package A (the package need to be installed to the project) has peer dependencies that are not included in our project, we might need to install them explicitly. For example, if A requires a specific version of B, we might need to install that version of B in our project.

  * **Conflicting dependencies**: If our project is using a dependency that conflicts with a dependency inside A, we might need to resolve that conflict. For example, if our project is using a different version of C that conflicts with the version used by A, we might need to resolve that conflict.


### How to resolve

Here's an explanation of how to handle the situation manually:

**Step 1: Identify the dependencies**

* Use `npm ls A` or `yarn ls A` to list out the dependencies of A.
* Identify the specific dependencies that may be causing conflicts with your project's dependencies.

**Step 2: Check for version conflicts**

* Use `npm ls <dependency-name>` or `yarn ls <dependency-name>` to check the version of the dependency in your project.
* Compare the version with the version required by A.
* If there's a version conflict, you may need to upgrade or downgrade the dependency to a compatible version.

**Step 3: Check for dependency conflicts**

* Use `npm ls` or `yarn ls` to list out all the dependencies in your project.
* Identify any dependencies that are conflicting with A's dependencies.
* Use `npm dedupe` or `yarn dedupe` to remove duplicate dependencies.

**Step 4: Check for compatibility issues**

* Refer to the A documentation to check for any known compatibility issues with your project's dependencies.
* Check the documentation of your project's dependencies to see if they have any known issues with A.

**Step 5: Resolve conflicts and issues**

* Based on the results of the above steps, resolve any conflicts or issues by upgrading, downgrading, or removing dependencies as necessary.
* Use `npm install` or `yarn install` to reinstall A and its dependencies after resolving the conflicts.

By following these steps, you can identify and resolve any dependency conflicts or compatibility issues that may arise when installing A.

> Note: `A` is the package that needs to be installed in existing projects

## Contributions
Feel free to contribute to the project! 

## Follow me
I would like to invite you to follow me on my social networks:
* Medium: https://matthew-ngo.medium.com/
* dev.to: https://dev.to/maemreyo
* Buy me a coffee: https://buymeacoffee.com/maemreyo

Don't forget to buy me a coffee if you find this helpful to you

<a href="https://www.buymeacoffee.com/maemreyo" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" style="height: 40px !important;width: 140px !important;" ></a>
