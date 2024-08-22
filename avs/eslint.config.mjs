import js from "@eslint/js";
import globals from "globals";
import jsdoc from "eslint-plugin-jsdoc";

export default [
  // js.configs.recommended,
  {
    plugins: { jsdoc },
    "rules": {
      "jsdoc/check-access": 2, // Recommended
      "jsdoc/check-alignment": 2, // Recommended
      // "jsdoc/check-examples": 2,
      "jsdoc/check-indentation": 2,
      "jsdoc/check-line-alignment": 2,
      "jsdoc/check-param-names": 2, // Recommended
      // "jsdoc/check-template-names": 2,
      // "jsdoc/check-property-names": 2, // Recommended
      // "jsdoc/check-syntax": 2,
      "jsdoc/check-tag-names": 2, // Recommended
      // "jsdoc/check-types": 2, // Recommended
      // "jsdoc/check-values": 2, // Recommended
      "jsdoc/empty-tags": 2, // Recommended
      // "jsdoc/implements-on-classes": 2, // Recommended
      // "jsdoc/informative-docs": 2,
      // "jsdoc/match-description": 2,
      // "jsdoc/multiline-blocks": 2, // Recommended
      // "jsdoc/no-bad-blocks": 2,
      // "jsdoc/no-blank-block-descriptions": 2,
      // "jsdoc/no-defaults": 2,
      // "jsdoc/no-missing-syntax": 2,
      // "jsdoc/no-multi-asterisks": 2, // Recommended
      // "jsdoc/no-restricted-syntax": 2,
      // "jsdoc/no-types": 2,
      // "jsdoc/no-undefined-types": 2, // Recommended
      // "jsdoc/require-asterisk-prefix": 2,
      // "jsdoc/require-description": 2,
      // "jsdoc/require-description-complete-sentence": 2,
      // "jsdoc/require-example": 2,
      // "jsdoc/require-file-overview": 2,
      // "jsdoc/require-hyphen-before-param-description": 2,
      // "jsdoc/require-jsdoc": 2, // Recommended
      "jsdoc/require-param": 2, // Recommended
      // "jsdoc/require-param-description": 2, // Recommended
      // "jsdoc/require-param-name": 2, // Recommended
      // "jsdoc/require-param-type": 2, // Recommended
      // "jsdoc/require-property": 2, // Recommended
      // "jsdoc/require-property-description": 2, // Recommended
      // "jsdoc/require-property-name": 2, // Recommended
      // "jsdoc/require-property-type": 2, // Recommended
      // "jsdoc/require-returns": 2, // Recommended
      "jsdoc/require-returns-check": 2, // Recommended
      // "jsdoc/require-returns-description": 2, // Recommended
      // "jsdoc/require-returns-type": 2, // Recommended
      // "jsdoc/require-template": 2,
      // "jsdoc/require-throws": 2,
      // "jsdoc/require-yields": 2, // Recommended
      // "jsdoc/require-yields-check": 2, // Recommended
      // "jsdoc/sort-tags": 2,
      // "jsdoc/tag-lines": 2, // Recommended
      "jsdoc/valid-types": 2 // Recommended
    },
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.browser,
      },
    },
  },
];