import { defineConfig } from "oxfmt";

export default defineConfig({
  ignorePatterns: ["pnpm-lock.yaml", "*.html", "*.json"],
  sortImports: {
    groups: ["builtin", "external", "import"],
  },
});
