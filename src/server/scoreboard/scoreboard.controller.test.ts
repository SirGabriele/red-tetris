import Fastify, {type FastifyInstance} from 'fastify'
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest'

import {SCOREBOARD_PAGE_SIZE, type ScoreboardDto} from '@shared/http/dto/scoreboard.dto.ts'
import {scoreboardController} from '@server/scoreboard/scoreboard.controller.ts'
import {getScoreboard} from '@server/scoreboard/scoreboard.service.ts'

vi.mock('@server/scoreboard/scoreboard.service.ts', () => ({
    getScoreboard: vi.fn()
}))

describe('scoreboardController', () => {
    let server: FastifyInstance

    beforeEach(async () => {
        server = Fastify()
        server.register(scoreboardController)
        await server.ready()
    })

    afterEach(async () => {
        await server.close()
        vi.clearAllMocks()
    })

    it('should return scoreboard data', async () => {
        const scoreboard: ScoreboardDto = {
            scores: [
                {
                    name: 'Player 1',
                    score: 100
                }
            ],
            currentPage: 1,
            totalPages: 1,
            pageSize: SCOREBOARD_PAGE_SIZE
        }

        vi.mocked(getScoreboard).mockReturnValue(scoreboard)

        const response = await server.inject({
            method: 'GET',
            url: '/scoreboard/1'
        })

        expect(response.statusCode).toBe(200)
        expect(response.json()).toEqual(scoreboard)
        expect(getScoreboard).toHaveBeenCalledWith(1)
    })

    it.each(['-1', '0', '1.5', 'invalid', 'NaN', 'Infinity', '-Infinity', '1e100', '1e309', String(Number.MAX_SAFE_INTEGER)])(
        'should reject invalid page %s without querying scores',
        async page => {
            const response = await server.inject({
                method: 'GET',
                url: `/scoreboard/${page}`
            })

            expect(response.statusCode).toBe(400)
            expect(getScoreboard).not.toHaveBeenCalled()
        }
    )

    it('should accept the largest page with a safe SQLite offset', async () => {
        const page = Math.floor(Number.MAX_SAFE_INTEGER / SCOREBOARD_PAGE_SIZE) + 1
        vi.mocked(getScoreboard).mockReturnValue({
            scores: [],
            currentPage: page,
            totalPages: 0,
            pageSize: SCOREBOARD_PAGE_SIZE
        })
        const response = await server.inject({
            method: 'GET',
            url: `/scoreboard/${page}`
        })

        expect(response.statusCode).toBe(200)
        expect(getScoreboard).toHaveBeenCalledWith(page)
    })
})
