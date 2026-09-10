import {cleanup, fireEvent, render, screen, waitFor} from '@testing-library/react'
import {beforeEach, describe, expect, it, vi} from 'vitest'
import App from '@client/src/App.tsx'
import * as serverApi from '@client/src/api/server.api.ts'

beforeEach(() => {
	cleanup()
	vi.restoreAllMocks()
})

describe('App', () => {
	it('should display backend response after button click', async () => {
		vi.spyOn(serverApi, 'getRoot').mockResolvedValue({
			message: 'Hello from /'
		})

		render(<App/>)

		fireEvent.click(
			screen.getByRole('button', {name: 'Call backend'})
		)

		await waitFor(() => {
			expect(
				screen.getByText('Hello from /')
			).toBeInTheDocument()
		})
	})

	it('should display an error message when backend call fails', async () => {
		vi.spyOn(serverApi, 'getRoot').mockRejectedValue(
			new Error('Backend unavailable')
		)

		render(<App/>)

		fireEvent.click(
			screen.getByRole('button', {name: 'Call backend'})
		)

		await waitFor(() => {
			expect(
				screen.getByText('Error while calling backend')
			).toBeInTheDocument()
		})
	})
})