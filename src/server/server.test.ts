import {afterEach, beforeEach, describe, expect, it} from "vitest";
import {buildServer} from "@server/buildServer.ts";
import {Routes} from "@server/http/routes/routes.ts";
import {FastifyInstance} from "fastify";

describe('server endpoints',    () => {
    let server: FastifyInstance;

    beforeEach(() => {
        server = buildServer({enableLogger: false});
    });

    afterEach(async () => {
        await server.close();
    });

    describe('root', () => {
        it('return code 200 with greeting', async () => {
            const response = await server.inject({
                method: 'GET',
                url: Routes.ROOT
            });

            expect(response.statusCode).toBe(200);
            expect(response.json()).toEqual({
                message: `Hello from ${Routes.ROOT}`
            });
        });
    });

    describe('join room', () => {
        describe('invalid parameters', () => {
            it.each([
                ['0'],       // 0 is excluded
                ['01'],      // leading 0s are forbidden
                ['11111'],   // max room id is 9999
                ['roomId']   // not a number
            ])('roomId is %d', async (roomId) => {
                const response = await server.inject({
                    method: 'GET',
                    url: `/${roomId}/validPlayerName`,
                });

                expect(response.json()).toEqual({
                    'statusCode': 400,
                    'code': 'FST_ERR_VALIDATION',
                    'error': 'Bad Request',
                    'message': 'params/roomId must match pattern "^(?!0)\\d{1,4}$"'
                });
            });

            it.each([
                [''],                   // empty name is forbidden
                ['Vincent.Van.Gogh'],   // non-alphanumerical characters are forbidden
                ['a'.repeat(51)]    // too long
            ])('playerName is %s', async (playerName) => {
                const response = await server.inject({
                    method: 'GET',
                    url: `/1/${playerName}`,
                });

                expect(response.json()).toEqual({
                    'statusCode': 400,
                    'code': 'FST_ERR_VALIDATION',
                    'error': 'Bad Request',
                    "message": "params/playerName must match pattern \"^[a-zA-Z0-9]{1,50}$\"",
                });
            });
        });

        describe('valid parameters', () => {
            it.each([
                ['1'],
                ['1111'],
                ['9999'],
            ])('roomId is %d', async (roomId) => {
                const response = await server.inject({
                    method: 'GET',
                    url: `/${roomId}/validPlayerName`,
                });

                expect(response.json()).toEqual({
                    message: `room is ${roomId} and playerName is validPlayerName`
                });
            });

            it.each([
                ['VincentVanGogh'],
                ['VincentVanGogh123'],
                ['1Vincent2Van3Gogh4'],
                ['a'.repeat(50)]
            ])('playerName is %s', async (playerName) => {
                const response = await server.inject({
                    method: 'GET',
                    url: `/1/${playerName}`,
                });

                expect(response.json()).toEqual({
                    message: `room is 1 and playerName is ${playerName}`
                });
            })
        });
    });
});