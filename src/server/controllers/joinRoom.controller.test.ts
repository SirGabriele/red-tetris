import {describe, expect, it} from "vitest";
import {joinRoomController} from "@server/controllers/joinRoom.controller.ts";
import {FastifyRequest} from "fastify";
import {JoinRoomRequest} from "@server/dto/joinRoom/joinRoom.request.dto.ts";

describe('joinRoomController', () => {
    it('should return string with roomId and playerName', () => {
        // Given
        const [roomId, playerName] = ['1', 'Mickael'];
        const req: Partial<FastifyRequest<JoinRoomRequest>> = {
            params: {
                roomId: roomId,
                playerName: playerName
            }
        };

        // When
        const response = joinRoomController(req as FastifyRequest<JoinRoomRequest>);

        // Then
        expect(response).toEqual({
            message: `room is ${roomId} and playerName is ${playerName}`
        });
    });
});