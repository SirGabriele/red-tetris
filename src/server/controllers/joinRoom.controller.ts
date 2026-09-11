import {FastifyRequest} from "fastify";
import {JoinRoomRequest} from "@server/dto/joinRoom/joinRoom.request.dto.ts";

export function joinRoomController(req: FastifyRequest<JoinRoomRequest>): {message: string} {
    const { roomId, playerName } = req.params;

    return {
        message: `room is ${roomId} and playerName is ${playerName}`
    }
}
