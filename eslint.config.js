const js = require("@eslint/js");
const tseslint = require("typescript-eslint");
const globals = require("globals");
const { FlatCompat } = require("@eslint/eslintrc");

const compat = new FlatCompat({ baseDirectory: __dirname });

module.exports = [
  // 1. Global ignores — an object with only `ignores` applies repo-wide.
  {
    ignores: [
      "**/node_modules/**",
      "**/dist/**",
      "**/.next/**",
      "**/coverage/**",
      "**/data/**",
      "**/next-env.d.ts",
    ],
  },

  // 2. Baseline JS rules — safe for every lintable file, no TS/React assumptions.
  js.configs.recommended,

  // 3. TypeScript rules — scoped to .ts/.tsx only, so .js config files never
  // get parsed with the TS parser.
  ...tseslint.configs.recommended.map((config) => ({
    ...config,
    files: ["**/*.ts", "**/*.tsx"],
  })),
  {
    files: ["**/*.ts", "**/*.tsx"],
    rules: {
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
    },
  },

  // 4. Node.js configuration files (eslint.config.js, next.config.js, ...).
  {
    files: ["**/*.config.js", "**/*.config.cjs", "**/*.config.mjs"],
    languageOptions: {
      globals: globals.node,
      sourceType: "commonjs",
    },
  },

  // 5. Backend source — runs under Node.js only.
  {
    files: ["apps/backend/src/**/*.ts"],
    languageOptions: {
      globals: globals.node,
    },
  },

  // 6. Frontend source — browser runtime, plus Node globals for Next.js
  // Server Components / route handlers, which also live under apps/frontend.
  {
    files: ["apps/frontend/src/**/*.{ts,tsx}"],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },

  // 7. Next.js plugin rules (react, react-hooks, jsx-a11y, core-web-vitals).
  // eslint-config-next still ships eslintrc-style shareable configs with no
  // native flat-config export, so FlatCompat is genuinely required here —
  // this is the one exception, and it's scoped to apps/frontend only.
  ...compat.extends("next/core-web-vitals", "next/typescript").map((config) => ({
    ...config,
    files: ["apps/frontend/**/*.{ts,tsx,js,jsx}"],
  })),

  // 7a. `no-html-link-for-pages` auto-detects the pages/app directory relative
  // to the ESLint CWD (the repo root), which doesn't work in a monorepo —
  // point it at the actual App Router directory.
  {
    files: ["apps/frontend/**/*.{ts,tsx,js,jsx}"],
    rules: {
      "@next/next/no-html-link-for-pages": ["error", "apps/frontend/src/app"],
    },
  },
];
