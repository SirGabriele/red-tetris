import type {ScoreboardDto} from '@shared/http/dto/scoreboard.dto.ts'
import {getScoreboardUrl} from '@shared/projectConfig.ts'

export async function getScoreboard(page: number): Promise<ScoreboardDto | null> {
    try {
        const response = await fetch(getScoreboardUrl(page))
        if (!response.ok) return null

        return await response.json()
    } catch {
        return null
    }
}
