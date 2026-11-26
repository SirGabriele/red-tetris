import type {FastifyInstance} from 'fastify'

import type {ScoreboardRequest} from '@server/scoreboard/dto/scoreboard.request.dto.ts'
import {SCOREBOARD_PAGE_SIZE} from '@shared/http/dto/scoreboard.dto.ts'
import {SCOREBOARD_PATH} from '@shared/projectConfig.ts'
import {getScoreboard} from '@server/scoreboard/scoreboard.service.ts'

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
        `${SCOREBOARD_PATH}/:pageNumber`,
        {schema: scoreboardSchema},
        async ({params: {pageNumber}}) => {
            if (!Number.isSafeInteger(pageNumber)) {
                throw Object.assign(new Error('Page number must be a safe integer'), {statusCode: 400})
            }
            return getScoreboard(pageNumber)
        }
    )
}
