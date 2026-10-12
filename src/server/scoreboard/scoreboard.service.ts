import type {ScoreboardDto} from '@shared/http/dto/scoreboard.dto.ts'
import * as scoreboardRepository from '@server/scoreboard/scores/score.repository.ts'
import {mapScore} from "@server/scoreboard/scores/score.mapper.ts";

const SCORES_PER_PAGE = 10

export function getScoreboard(page: number): ScoreboardDto {
    const offset = (page - 1) * SCORES_PER_PAGE

    const scores = scoreboardRepository.findScores(SCORES_PER_PAGE, offset).map(mapScore)
    const totalScores = scoreboardRepository.countScores()

    return {
        scores,
        currentPage: page,
        totalPages: Math.ceil(totalScores / SCORES_PER_PAGE)
    }
}
