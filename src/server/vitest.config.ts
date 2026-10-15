import { defineConfig } from "vitest/config";

export default defineConfig({
    resolve: {
        tsconfigPaths: true
    },
    test: {
        include: ['**/*.test.ts'],
        coverage: {
            provider: 'v8',
            include: ['**/*.ts'],
            exclude: [
                '**/*.test.ts',
                '**/*.types.ts',
                'coverage/**'
            ],
            reporter: ['html', 'text'],
            thresholds: {
                statements: 70,
                functions: 70,
                lines: 70,
                branches: 50,
            }
        }
    }
});
