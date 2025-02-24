import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginVue from "eslint-plugin-vue";

/** @type {import('eslint').Linter.Config[]} */
export default [
  { files: ["**/*.{js,mjs,cjs,ts,vue}"] },
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  ...pluginVue.configs["flat/essential"],
  {
    files: ["**/*.vue"],
    rules: {
      "vue/multi-word-component-names": "off",
      "vue/html-indent": ["error", 2],
      indent: ["error", 2],
      quotes: ["error", "single"],
      semi: ["error", "always"],
      "@typescript-eslint/no-unused-vars": ["warn"],
    },
    languageOptions: { parserOptions: { parser: tseslint.parser } },
  },
];
