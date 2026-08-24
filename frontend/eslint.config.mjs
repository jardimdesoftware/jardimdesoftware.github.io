// eslint-config-next@16 ships a native ESLint flat-config array, so it is
// spread directly here instead of going through @eslint/eslintrc's
// FlatCompat (the legacy `compat.extends("next/core-web-vitals", ...)`
// bridge crashes with this version - see README note in this repo's
// milestone report for details).
import nextConfig from "eslint-config-next";

const eslintConfig = [
  {
    ignores: [".next/**", "node_modules/**", "out/**"],
  },
  ...nextConfig,
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "react/no-unescaped-entities": "off",
    },
  },
];

export default eslintConfig;
