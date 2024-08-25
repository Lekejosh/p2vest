// vitest.config.integration.ts
import { defineConfig } from "vitest/config";

export default defineConfig({
    test: {
        include: ["src/routes/__test__/**/*.test.ts"],
        maxConcurrency: 1,
        // setupFiles: ["src/tests/helper/setup.ts"],
        isolate: true
    },
    resolve: {
        alias: {
            controller: "/src/routes"
        }
    }
});
