import {SCOREBOARD_PAGE_SIZE, type ScoreboardDto} from '@shared/http/dto/scoreboard.dto.ts'
import * as scoreboardRepository from '@server/scoreboard/scores/score.repository.ts'
import {mapScore} from '@server/scoreboard/scores/score.mapper.ts'

export function getScoreboard(page: number): ScoreboardDto {
    const offset = (page - 1) * SCOREBOARD_PAGE_SIZE

    const scores = scoreboardRepository.findScores(SCOREBOARD_PAGE_SIZE, offset).map(mapScore)
    const totalScores = scoreboardRepository.countScores()

    return {
        scores,
        currentPage: page,
        totalPages: Math.ceil(totalScores / SCOREBOARD_PAGE_SIZE),
        pageSize: SCOREBOARD_PAGE_SIZE
    }
}