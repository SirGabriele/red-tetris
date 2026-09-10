import {defineConfig, mergeConfig} from 'vitest/config'
import viteConfig from './vite.config.ts'

export default mergeConfig(
	viteConfig,
	defineConfig({
		test: {
			environment: 'jsdom',
			setupFiles: './src/test/setup.ts',
			coverage: {
				provider: 'v8',
				reporter: ['text', 'html'],
				thresholds: {
					statements: 70,
					functions: 70,
					lines: 70,
					branches: 50,
				},
			},
		},
	}),
)