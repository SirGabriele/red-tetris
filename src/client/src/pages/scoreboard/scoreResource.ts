import type {ScoreboardDto} from '@shared/http/dto/scoreboard.dto.ts'
import {buildScoreboardRoute} from '@client/src/http/routes.ts'

export async function getScoreboard(page: number): Promise<ScoreboardDto> {
    const response = await fetch(buildScoreboardRoute(page))

    if (!response.ok) {
        throw new Error(`Unable to retrieve scoreboard: ${response.status}`)
    }

    return await response.json() as ScoreboardDto
}