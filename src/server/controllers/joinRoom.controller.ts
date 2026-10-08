import {FastifyRequest} from "fastify";
import {JoinRoomRequest} from "@server/dto/joinRoom/joinRoom.request.dto.ts";

export async function joinRoomController(req: FastifyRequest<JoinRoomRequest>): Promise<{message: string}> {
    const { roomId, playerName } = req.params;

    await new Promise(_ => setTimeout(_, 2000));

    return {
        message: `room is ${roomId} and playerName is ${playerName}`
    }
}
