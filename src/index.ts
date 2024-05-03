import { processTargetPackages as getCompatiblePackages } from "./lib/packages";

export { getCompatiblePackages };

const rawPackages = {
  next: "14.2.3",
  react: "^18",
  "react-dom": "^18",
};

const targetPackages = [
  // "eslint": "^8",
  // "eslint-config-next": "14.2.3",
  // "husky": "^9.0.11",
  // "lint-staged": "^15.2.2",
  // "postcss": "^8",
  // "prettier": "^3.2.5",
  // "tailwindcss": "^3.4.1",
  // "typescript": "^5"
  "eslint",
  "eslint-config-next",
  "husky",
  "lint-staged",
  "postcss",
  "prettier",
  "tailwindcss",
  "typescript",
];

(async () => {
  await getCompatiblePackages(rawPackages, targetPackages);
})();
