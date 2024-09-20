import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import tsEslintPlugin from "@typescript-eslint/eslint-plugin";
import tsEslintParser from "@typescript-eslint/parser";

export default [
  {
    files: ["backend/**/*.{js,mjs,cjs,ts,jsx,tsx}", "database/**/*.{js,mjs,cjs,ts,jsx,tsx}", "frontend/**/*.{js,mjs,cjs,ts,jsx,tsx}"],
  },
  {
    ignores: ["backend/dist/**", "frontend/dist/**"],  // Ignorer dist-mapper i både backend og frontend
  },
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.jest,
        process: "readonly",
      },
      parser: tsEslintParser,  // Brug TypeScript parser for TS-filer
    },
    plugins: {
      js: pluginJs,
      react: pluginReact,
      "@typescript-eslint": tsEslintPlugin,
    },
    rules: {
      ...pluginJs.configs.recommended.rules,
      ...tseslint.configs.recommended.rules,
      ...pluginReact.configs.flat.recommended.rules,
      "quotes": ["error", "double", { "avoidEscape": true, "allowTemplateLiterals": true }]
    },
  },
];
