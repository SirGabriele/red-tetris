import {FastifyInstance} from "fastify";
import {Routes} from "@server/http/routes/routes.ts";
import {JoinRoomDto} from "@shared/http/JoinRoom.dto.ts";

/**
 * Creates all server endpoints.
 */
export function createEndpoints(server: FastifyInstance) {
    /**
     * Base root endpoint.
     */
    server.get(Routes.ROOT, async (): Promise<{message: string}> => {
        return {
            message: `Hello from ${Routes.ROOT}`
        }
    });

    /**
     * Room connection endpoint.
     *
     * roomId is a number between 1 and 9999. 0 and leading zeros are excluded.
     * playerName is a string that contains letters and numbers, without any restrictions as to capitalization.
     */
    server.get<{Params: JoinRoomDto}>(Routes.JOIN_ROOM, {
        schema: {
            params: {
                type: 'object',
                required: ['roomId', 'playerName'] satisfies (keyof JoinRoomDto)[],
                properties: {
                    roomId: {
                        type: 'string',
                        pattern: '^(?!0)\\d{1,4}$'
                    },
                    playerName: {
                        type: 'string',
                        pattern: '^[a-zA-Z0-9]{1,50}$'
                    }
                }
            }
        }
    }, async (req): Promise<{message: string}> => {
        const { roomId, playerName } = req.params;

        return {
            message: `room is ${roomId} and playerName is ${playerName}`
        }
    });
}