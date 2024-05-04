import { processTargetPackages as getCompatiblePackages } from "./lib/packages";

export { getCompatiblePackages };

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
  react: "16.8.0",
  "react-dom": "18.2.0",
  "react-hook-form": "^7.47.0",
  "react-select": "^5.7.7",
  "react-toastify": "^9.1.3",
  tailwindcss: "3.3.3",
  typescript: "5.2.2",
  zustand: "^4.4.3",
  "@types/mocha": "^10.0.6",
  md5: "^2.3.0",
  "postcss-preset-mantine": "^1.9.1",
  "postcss-simple-vars": "^7.0.1",
  sass: "^1.69.3",
};

const targetPackages = ["cypress"];

(async () => {
  await getCompatiblePackages(rawPackages, targetPackages);
})();
