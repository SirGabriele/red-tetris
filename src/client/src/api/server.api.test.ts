import {afterEach, beforeEach, describe, expect, it, vi,} from 'vitest'

import {getRoot} from './server.api.ts'
import type {RootResponse} from '../../../shared/http/root.dto.ts'

describe('getRoot', () => {
	const fetchMock = vi.fn<typeof fetch>()

	beforeEach(() => {
		fetchMock.mockReset()
		vi.stubGlobal('fetch', fetchMock)
	})

	afterEach(() => {
		vi.unstubAllGlobals()
	})

	it('should return backend response when request succeeds', async () => {
		const mockResponse: RootResponse = {
			message: 'Hello from server',
		}

		fetchMock.mockResolvedValue(
			new Response(
				JSON.stringify(mockResponse),
				{
					status: 200,
					headers: {
						'Content-Type': 'application/json',
					},
				},
			),
		)

		const result = await getRoot()

		expect(fetchMock).toHaveBeenCalledTimes(1)
		expect(fetchMock).toHaveBeenCalledWith(
			'http://localhost:3000/',
		)

		expect(result).toEqual(mockResponse)
	})

	it('should throw an error when backend response is not ok', async () => {
		fetchMock.mockResolvedValue(
			new Response(null, {
				status: 500,
			}),
		)

		await expect(getRoot()).rejects.toThrow(
			'HTTP error: 500',
		)

		expect(fetchMock).toHaveBeenCalledTimes(1)
		expect(fetchMock).toHaveBeenCalledWith(
			'http://localhost:3000/',
		)
	})
})