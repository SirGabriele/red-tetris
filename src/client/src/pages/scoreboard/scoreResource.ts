import type {ScoreboardDto} from '@shared/http/dto/scoreboard.dto.ts'
import {BACK_URL} from '@shared/projectConfig.ts'

export async function getScoreboard(page: number): Promise<ScoreboardDto> {
    const apiOrigin = import.meta.env.DEV ? BACK_URL : ''
    const response = await fetch(`${apiOrigin}/scoreboard/${page}`)

    if (!response.ok) {
        throw new Error(`Unable to retrieve scoreboard: ${response.status}`)
    }

    return await response.json() as ScoreboardDto
}
