import {FastifyInstance} from "fastify";
import {Routes} from "@server/http/routes/routes.ts";
import {JoinRoomDto} from "@shared/http/dto/joinRoom.dto.ts";
import {PLAYER_NAME_PATTERN, ROOM_ID_PATTERN} from "@shared/utils/regex.utils.ts";
import {rootController} from "@server/controllers/root.controller.ts";
import {joinRoomController} from "@server/controllers/joinRoom.controller.ts";
import {JoinRoomRequest} from "@server/dto/joinRoom/joinRoom.request.dto.ts";

/**
 * Creates all server endpoints.
 */
export function registerControllers(server: FastifyInstance) {
    /**
     * Base root endpoint.
     */
    server.get(Routes.ROOT, rootController);

    /**
     * Room connection endpoint.
     *
     * roomId is a number between 1 and 9999. 0 and leading zeros are excluded.
     * playerName is a string that contains letters and numbers. Its max length is 50.
     */
    server.get<JoinRoomRequest>(Routes.JOIN_ROOM, {
        schema: {
            params: {
                type: 'object',
                required: ['roomId', 'playerName'] satisfies (keyof JoinRoomDto)[],
                properties: {
                    roomId: {
                        type: 'string',
                        pattern: ROOM_ID_PATTERN
                    },
                    playerName: {
                        type: 'string',
                        pattern: PLAYER_NAME_PATTERN
                    }
                }
            }
        }
    }, joinRoomController);
}