import {beforeEach, describe, expect, it, vi} from 'vitest'

import {SCOREBOARD_PAGE_SIZE} from '@shared/http/dto/scoreboard.dto.ts'
import * as scoreboardRepository from '@server/scoreboard/scores/score.repository.ts'
import {getScoreboard} from '@server/scoreboard/scoreboard.service.ts'

vi.mock('@server/scoreboard/scores/score.repository.ts', () => ({
    findScores: vi.fn(),
    countScores: vi.fn()
}))

describe('scoreboardService', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    describe('getScoreboard', () => {
        it('should return scoreboard first page', () => {
            vi.mocked(scoreboardRepository.findScores).mockReturnValue([
                {
                    player_name: 'Player 1',
                    score: 1000
                },
                {
                    player_name: 'Player 2',
                    score: 900
                }
            ])

            vi.mocked(scoreboardRepository.countScores).mockReturnValue(25)

            const result = getScoreboard(1)

            expect(scoreboardRepository.findScores).toHaveBeenCalledWith(SCOREBOARD_PAGE_SIZE, 0)
            expect(scoreboardRepository.countScores).toHaveBeenCalledOnce()

            expect(result).toEqual({
                scores: [
                    {
                        name: 'Player 1',
                        score: 1000
                    },
                    {
                        name: 'Player 2',
                        score: 900
                    }
                ],
                currentPage: 1,
                totalPages: 3,
                pageSize: SCOREBOARD_PAGE_SIZE
            })
        })

        it('should calculate offset for second page', () => {
            vi.mocked(scoreboardRepository.findScores).mockReturnValue([])
            vi.mocked(scoreboardRepository.countScores).mockReturnValue(25)

            const result = getScoreboard(2)

            expect(scoreboardRepository.findScores).toHaveBeenCalledWith(
                SCOREBOARD_PAGE_SIZE,
                SCOREBOARD_PAGE_SIZE
            )

            expect(result).toEqual({
                scores: [],
                currentPage: 2,
                totalPages: 3,
                pageSize: SCOREBOARD_PAGE_SIZE
            })
        })
    })
})