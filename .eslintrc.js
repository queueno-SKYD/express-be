module.exports = {
  "env": {
    "browser": true,
    "es2021": true
  },
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended"
  ],
  "overrides": [
    {
      "env": {
        "node": true
      },
      "files": [
        ".eslintrc.{js,cjs}"
      ],
      "parserOptions": {
        "sourceType": "script"
      }
    }
  ],
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "ecmaVersion": "latest",
    "sourceType": "module"
  },
  "plugins": [
    "@typescript-eslint"
  ],
  "rules": {
    "indent": [
      "error",
      2
    ],
    "linebreak-style": [
      "error",
      "unix"
    ],
    "quotes": [
      "error",
      "double"
    ],
    "eqeqeq": 1,
    "eol-last": 1,
    "no-multiple-empty-lines": ["error", { "max": 1, "maxEOF": 1 }],
    "keyword-spacing": [
      "error",
      {
        "before": true,
        "after": true,
      }
    ],
    "arrow-spacing": ["error", { "before": true, "after": true }],
    "space-before-blocks": ["error", "always"],
    "space-infix-ops": ["error", { "int32Hint": false }], // This includes the assignment operator '='
    "space-unary-ops": ["error", { "words": true, "nonwords": false }], // Optional: This controls spaces around unary operators (+, -, etc.)
    "no-extra-parens": ["error", "all", { "ignoreJSX": "all" }], // Optional: This controls unnecessary parentheses

    // Ternary operator spacing
    "multiline-ternary": ["error", "always-multiline"],
  }
};
