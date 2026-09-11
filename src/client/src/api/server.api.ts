import type {RootDto} from '@shared/http/dto/root.dto.ts'

export async function getRoot(): Promise<RootDto> {
	const response = await fetch('http://localhost:3000/')

	if (!response.ok) {
		throw new Error(`HTTP error: ${response.status}`)
	}

	return response.json()
}