const jsdocRuleOverrides = {
  "jsdoc/require-jsdoc": [
    "error",
    {
      require: {
        // class
        ClassDeclaration: true,
        ClassExpression: true,
        // methods
        MethodDefinition: true,
      },
      contexts: [
        // ignore ArrowFunctionExpression inside functions and passed as call expressions
        "ArrowFunctionExpression:not(FunctionDeclaration ArrowFunctionExpression, FunctionExpression ArrowFunctionExpression, ArrowFunctionExpression ArrowFunctionExpression):not(CallExpression ArrowFunctionExpression)",
        // ignore FunctionDeclaration inside functions
        "FunctionDeclaration:not(FunctionDeclaration FunctionDeclaration, FunctionExpression FunctionDeclaration, ArrowFunctionExpression FunctionDeclaration):not(CallExpression FunctionDeclaration)",
        // ignore FunctionExpression inside functions
        "FunctionExpression:not(FunctionDeclaration FunctionExpression, FunctionExpression FunctionExpression, ArrowFunctionExpression FunctionExpression):not(CallExpression FunctionExpression)",
      ],
    },
  ],
  "jsdoc/check-indentation": "error",
  "jsdoc/require-asterisk-prefix": "error",
  "jsdoc/require-description": "error",
  "jsdoc/require-example": "error",
  "jsdoc/check-tag-names": [
    "error",
    {
      definedTags: [
        "twfeature",
        "locale",
        "marketplace",
        "contract",
        "claimConditions",
        "nftDrop",
        "platformFees",
        "nft",
        "metadata",
        "permissionControl",
        "networkConnection",
        "delayedReveal",
        "token",
        "walletConnection",
        "smartWallet",
        "auth",
        "storage",
        "connectWallet",
        "theme",
        "locale",
        "appURI",
        "wallet",
      ],
    },
  ], // using
};

module.exports = {
  root: true,
  extends: [
    "thirdweb",
    "plugin:@tanstack/eslint-plugin-query/recommended",
    "plugin:jsdoc/recommended-typescript-error",
  ],
  plugins: ["better-tree-shaking", "jsdoc"],
  settings: {
    jsdoc: {
      ignoreInternal: true,
    },
  },
  rules: {
    "better-tree-shaking/no-top-level-side-effects": "error",
    "no-restricted-globals": [
      "error",
      {
        name: "Buffer",
        message: "Use Uint8Array instead.",
      },
    ],
    "import/no-cycle": "error",
    "no-restricted-imports": [
      "error",
      {
        name: "buffer",
        message: "Use Uint8Array instead.",
      },
      {
        name: "node:buffer",
        message: "Use Uint8Array instead.",
      },
    ],
    ...jsdocRuleOverrides,
  },
};
