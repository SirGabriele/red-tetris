import type {ScoreboardDto} from '@shared/http/dto/scoreboard.dto.ts'

export async function getScoreboard(page: number): Promise<ScoreboardDto> {
    const response = await fetch(`/scoreboard?page=${page}`)

    if (!response.ok) {
        throw new Error(`Unable to retrieve scoreboard: ${response.status}`)
    }

    return await response.json() as Promise<ScoreboardDto>
}