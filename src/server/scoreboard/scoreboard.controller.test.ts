import Fastify, {type FastifyInstance} from 'fastify'
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest'

import type {ScoreboardDto} from '@shared/http/dto/scoreboard.dto.ts'
import {scoreboardController} from '@server/scoreboard/scoreboard.controller.ts'
import * as scoreboardService from '@server/scoreboard/scoreboard.service.ts'
import {Routes} from '@server/http/routes/routes.ts'

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
            totalPages: 1
        }

        vi.mocked(scoreboardService.getScoreboard).mockReturnValue(scoreboard)

        const response = await server.inject({
            method: 'GET',
            url: Routes.SCOREBOARD.replace(':pageNumber', '1')
        })

        expect(response.statusCode).toBe(200)
        expect(response.json()).toEqual(scoreboard)
        expect(scoreboardService.getScoreboard).toHaveBeenCalledWith(1)
    })

    it('should return 400 when page number is lower than 1', async () => {
        const response = await server.inject({
            method: 'GET',
            url: Routes.SCOREBOARD.replace(':pageNumber', '0')
        })

        expect(response.statusCode).toBe(400)
        expect(scoreboardService.getScoreboard).not.toHaveBeenCalled()
    })

    it('should return 400 when page number is invalid', async () => {
        const response = await server.inject({
            method: 'GET',
            url: Routes.SCOREBOARD.replace(':pageNumber', 'invalid')
        })

        expect(response.statusCode).toBe(400)
        expect(scoreboardService.getScoreboard).not.toHaveBeenCalled()
    })
})