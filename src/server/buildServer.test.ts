import {describe, expect, it, vi} from 'vitest';
import {buildServer} from "@server/buildServer.ts";
import {registerControllers} from "@server/registerControllers.ts";

vi.mock("@server/createEndpoints.ts", () => ({
    createEndpoints: vi.fn(),
}));

describe('buildServer', () => {
    it('should create server with options', async () => {
        const server = buildServer({enableLogger: false});
        expect(server).toBeTruthy();
        expect(registerControllers).toHaveBeenCalledWith(server);

        await server.close();
    });

    it('should create server without options', async () => {
        const server = buildServer({});
        expect(server).toBeTruthy();
        expect(registerControllers).toHaveBeenCalledWith(server);

        await server.close();
    });
});