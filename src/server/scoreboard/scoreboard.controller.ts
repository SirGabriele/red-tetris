import type {FastifyInstance, FastifyReply, FastifyRequest} from 'fastify'

import type {ScoreboardRequest} from '@server/scoreboard/dto/scoreboard.request.dto.ts'
import {SCOREBOARD_PAGE_SIZE, type ScoreboardDto} from '@shared/http/dto/scoreboard.dto.ts'
import {FRONT_URL} from '@shared/projectConfig.ts'
import * as scoreboardService from '@server/scoreboard/scoreboard.service.ts'

const scoreboardSchema = {
    params: {
        type: 'object',
        required: ['pageNumber'],
        properties: {
            pageNumber: {
                type: 'integer',
                minimum: 1,
                maximum: Math.floor(Number.MAX_SAFE_INTEGER / SCOREBOARD_PAGE_SIZE) + 1
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
            async onRequest(_request: FastifyRequest<ScoreboardRequest>, reply: FastifyReply): Promise<void> {
                void reply.header('Access-Control-Allow-Origin', FRONT_URL)
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
    const {pageNumber} = request.params
    if (!Number.isSafeInteger(pageNumber)) {
        throw Object.assign(new Error('Page number must be a safe integer'), {statusCode: 400})
    }

    return scoreboardService.getScoreboard(pageNumber)
}
