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
                'coverage/**',
                '**/*config.ts',
                '**/*.dto.ts'
            ],
            reporter: ['html', 'text']
        }
    }
});
