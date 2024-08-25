import { defineConfig } from "vitest/config";

export default defineConfig({
    test: {
        include: ["src/utils/__test__/*.test.ts", "src/services/__test__/**/*.test.ts"]
    }
    // resolve: {
    //     alias: {
    //         auth: "/src/auth",
    //         quotes: "/src/quotes",
    //         lib: "/src/lib"
    //     }
    // }
});
