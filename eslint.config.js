// Flat config minimale per il codice del sistema (module/*.mjs).
export default [
  {
    files: ["module/**/*.mjs"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      globals: {
        game: "readonly", CONFIG: "readonly", Hooks: "readonly", foundry: "readonly",
        ui: "readonly", ChatMessage: "readonly", Actor: "readonly", Roll: "readonly",
        window: "readonly", document: "readonly", console: "readonly", setTimeout: "readonly",
        setInterval: "readonly", clearInterval: "readonly", fetch: "readonly", globalThis: "readonly"
      }
    },
    rules: {
      "no-unused-vars": ["warn", { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }],
      "no-undef": "error"
    }
  }
];
