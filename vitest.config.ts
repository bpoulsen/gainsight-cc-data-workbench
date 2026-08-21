import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: ["src/**/*.test.ts", "tests/**/*.test.ts"],
    exclude: ["node_modules/**", "dist/**"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      include: [
        "src/lib/auth.ts",
        "src/lib/csv.ts",
        "src/lib/identityResolver.ts",
        "src/lib/retry.ts",
        "src/lib/jobRunner.ts",
        "src/adapters/**/*.ts",
      ],
      exclude: ["src/**/*.test.ts", "src/generated/**", "src/adapters/index.ts"],
      thresholds: {
        statements: 80,
        lines: 80,
        functions: 80,
        branches: 70,
      },
    },
  },
});
