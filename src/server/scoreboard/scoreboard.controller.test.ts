import Fastify, {type FastifyInstance} from 'fastify'
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest'

import {SCOREBOARD_PAGE_SIZE, type ScoreboardDto} from '@shared/http/dto/scoreboard.dto.ts'
import {FRONT_URL} from '@shared/projectConfig.ts'
import {scoreboardController} from '@server/scoreboard/scoreboard.controller.ts'
import * as scoreboardService from '@server/scoreboard/scoreboard.service.ts'

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

        vi.mocked(scoreboardService.getScoreboard).mockReturnValue(scoreboard)

        const response = await server.inject({
            method: 'GET',
            url: '/scoreboard/1',
            headers: {origin: FRONT_URL}
        })

        expect(response.statusCode).toBe(200)
        expect(response.headers['access-control-allow-origin']).toBe(FRONT_URL)
        expect(response.json()).toEqual(scoreboard)
        expect(scoreboardService.getScoreboard).toHaveBeenCalledWith(1)
    })

    it('should return 400 when page number is lower than 1', async () => {
        const response = await server.inject({
            method: 'GET',
            url: '/scoreboard/0'
        })

        expect(response.statusCode).toBe(400)
        expect(scoreboardService.getScoreboard).not.toHaveBeenCalled()
    })

    it('should return 400 when page number is invalid', async () => {
        const response = await server.inject({
            method: 'GET',
            url: '/scoreboard/invalid'
        })

        expect(response.statusCode).toBe(400)
        expect(scoreboardService.getScoreboard).not.toHaveBeenCalled()
    })
})
