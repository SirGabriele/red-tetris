import {beforeEach, describe, expect, it, vi} from 'vitest'

import {SCOREBOARD_PAGE_SIZE} from '@shared/http/dto/scoreboard.dto.ts'
import {countScores, findScores} from '@server/scoreboard/scores/score.repository.ts'
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
            vi.mocked(findScores).mockReturnValue([
                {
                    player_name: 'Player 1',
                    score: 1000
                },
                {
                    player_name: 'Player 2',
                    score: 900
                }
            ])

            vi.mocked(countScores).mockReturnValue(25)

            const result = getScoreboard(1)

            expect(findScores).toHaveBeenCalledWith(SCOREBOARD_PAGE_SIZE, 0)
            expect(countScores).toHaveBeenCalledOnce()

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
            vi.mocked(findScores).mockReturnValue([])
            vi.mocked(countScores).mockReturnValue(25)

            const result = getScoreboard(2)

            expect(findScores).toHaveBeenCalledWith(
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

        it.each([
            {page: 1, scoreCount: 0, totalPages: 0},
            {page: 4, scoreCount: 25, totalPages: 3},
        ])('should return an empty result for page $page with $scoreCount scores', ({page, scoreCount, totalPages}) => {
            vi.mocked(findScores).mockReturnValue([])
            vi.mocked(countScores).mockReturnValue(scoreCount)

            expect(getScoreboard(page)).toEqual({
                scores: [],
                currentPage: page,
                totalPages,
                pageSize: SCOREBOARD_PAGE_SIZE
            })
        })
    })
})
