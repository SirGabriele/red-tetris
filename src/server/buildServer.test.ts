import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import {buildServer} from "@server/buildServer.ts";
import {registerControllers} from "@server/registerControllers.ts";
import {FastifyInstance} from "fastify";

vi.mock("@server/registerControllers.ts", () => ({
    registerControllers: vi.fn(),
}));

describe('buildServer', () => {
    let server: FastifyInstance;

    beforeEach(async () => {
       server =  await buildServer({ enableLogger: false });
    });

    afterEach(async () => {
        await server.close();
    });

    it('should create server without options', async () => {
        const optionlessServer = await buildServer({});

        expect(optionlessServer).toBeTruthy();
        expect(registerControllers).toHaveBeenCalledWith(optionlessServer);

        await optionlessServer.close();
    });

    it('should create server with options', async () => {
        expect(server).toBeTruthy();
        expect(registerControllers).toHaveBeenCalledWith(server);
    });

    it('should accept request from known origin (CORS)', async () => {
        const response = await server.inject({
            method: 'GET',
            url: '/',
            headers: {
                origin: 'http://localhost:5172',
            },
        });

        expect(response.headers['access-control-allow-origin']).toBe('http://localhost:5173');
    });

    it('should block request from unknown origin (CORS)', async () => {
        const response = await server.inject({
            method: 'GET',
            url: '/',
            headers: {
                origin: 'http://localhost:9999',
            },
        });

        expect(response.statusCode).toBe(404);
    });
});