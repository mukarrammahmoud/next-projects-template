import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import tailwind from "eslint-plugin-tailwindcss";

const eslintConfig = defineConfig([
  // ── Next.js recommended rule sets ──────────────────────────────────────
  ...nextVitals,
  ...nextTs,
  ...tailwind.configs["flat/recommended"],

  // ── Project-wide overrides ──────────────────────────────────────────────
  {
    rules: {
      // ── TypeScript ──────────────────────────────────────────────────────
      /** Disallow `any` — use `unknown` instead and narrow the type */
      "@typescript-eslint/no-explicit-any": "error",

      /** All declared variables must be used; prefix unused params with _ */
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],

      /** Prefer `import type` for type-only imports (tree-shaking friendly) */
      "@typescript-eslint/consistent-type-imports": [
        "error",
        { prefer: "type-imports", fixStyle: "inline-type-imports" },
      ],

      // ── React ────────────────────────────────────────────────────────────
      /** Enforce Rules of Hooks (no conditional hooks, etc.) */
      "react-hooks/rules-of-hooks": "error",

      /** Warn when effect dependencies are stale */
      "react-hooks/exhaustive-deps": "warn",

      // ── General code quality ─────────────────────────────────────────────
      /** Disallow leftover console statements in committed code */
      "no-console": ["warn", { allow: ["warn", "error"] }],

      /** Prevent accidental fallthrough in switch cases */
      "no-fallthrough": "error",

      /** No duplicate case labels in switch */
      "no-duplicate-case": "error",

      /** Disallow returning a value from a void function implicitly */
      "consistent-return": "off", // TypeScript handles this better

      /** Disallow reassigning function parameters */
      "no-param-reassign": ["error", { props: false }],

      /** Prefer === over == */
      eqeqeq: ["error", "always", { null: "ignore" }],

      /** Disallow the use of undefined variable (use void 0 instead) */
      "no-undefined": "off",

      /** Guard against using before definition */
      "no-use-before-define": "off",
      "@typescript-eslint/no-use-before-define": [
        "error",
        { functions: false, classes: true, variables: true },
      ],
    },
  },

  // ── Global ignores ───────────────────────────────────────────────────────
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"]),
]);

export default eslintConfig;
