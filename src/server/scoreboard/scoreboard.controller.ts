import type {FastifyInstance, FastifyRequest} from 'fastify'

import type {ScoreboardRequest} from '@server/scoreboard/dto/scoreboard.request.dto.ts'
import type {ScoreboardDto} from '@shared/http/dto/scoreboard.dto.ts'
import {FRONT_URL} from '@shared/projectConfig.ts'
import * as scoreboardService from '@server/scoreboard/scoreboard.service.ts'

const scoreboardSchema = {
    params: {
        type: 'object',
        required: ['pageNumber'],
        properties: {
            pageNumber: {
                type: 'integer',
                minimum: 1
            }
        }
    }
}

/**
 * Registers routes related to the scoreboard functionality on the provided Fastify server instance.
 *
 * @param {FastifyInstance} server - The Fastify server instance on which to register the scoreboard routes.
 * @return {Promise<void>} A promise that resolves when the scoreboard routes are successfully registered.
 */
export async function scoreboardController(server: FastifyInstance): Promise<void> {
    server.get<ScoreboardRequest>(
        '/scoreboard/:pageNumber',
        {
            schema: scoreboardSchema,
            async onRequest(_request, reply) {
                reply.header('Access-Control-Allow-Origin', FRONT_URL)
            }
        },
        getScoreboard
    )
}

/**
 * Retrieves scoreboard data, including player scores and pagination details.
 *
 * @param {FastifyRequest<ScoreboardRequest>} request - The Fastify request containing the requested page number.
 * @return {ScoreboardDto} An object containing the scores, current page, and total pages.
 */
function getScoreboard(request: FastifyRequest<ScoreboardRequest>): ScoreboardDto {
    return scoreboardService.getScoreboard(request.params.pageNumber)
}
