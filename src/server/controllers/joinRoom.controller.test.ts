import {describe, expect, it} from 'vitest'
import type {FastifyRequest} from 'fastify'

import {joinRoomController} from '@server/controllers/joinRoom.controller.ts'
import type {JoinRoomRequest} from '@server/dto/joinRoom/joinRoom.request.dto.ts'

describe('joinRoomController', () => {
    it('should return string with roomId and playerName', async () => {
        // Given
        const [roomId, playerName] = ['1', 'Mickael']

        const req: Partial<FastifyRequest<JoinRoomRequest>> = {
            params: {
                roomId,
                playerName
            }
        }

        // When
        const response = await joinRoomController(
            req as FastifyRequest<JoinRoomRequest>
        )

        // Then
        expect(response).toEqual({
            message: `room is ${roomId} and playerName is ${playerName}`
        })
    })
})