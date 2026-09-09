import type {RootResponse} from '../../../shared/http/root.dto'

export async function getRoot(): Promise<RootResponse> {
	const response = await fetch('http://localhost:3000/')

	if (!response.ok) {
		throw new Error(`HTTP error: ${response.status}`)
	}

	return response.json()
}