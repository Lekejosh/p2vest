import { defineConfig } from "vitest/config";

export default defineConfig({
    test: {
        globals: true, // Enable globals like describe, it, etc.
        environment: "node", // Set the environment to node
        // coverage: {
        //     provider: "c8", // Use c8 for coverage reporting
        //     reporter: ["text", "json", "html"] // Set the types of reports to generate
        // },
        include: ["src/**/*.test.ts"], // Include test files
        exclude: ["node_modules", "dist"] // Exclude these directories from testing
    }
});
