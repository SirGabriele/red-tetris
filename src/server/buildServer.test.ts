import { describe, expect, it } from 'vitest';
import {buildServer} from "@server/buildServer.ts";
import {Routes} from "@server/http/routes/routes.ts";

describe('buildServer', () => {
    it('should build the server and register the endpoints', async () => {
        // const server = buildServer({ enableLogger: false });
        const server = buildServer({ enableLogger: false });

        expect(server).toBeTruthy();

        const response = await server.inject({
            method: 'GET',
            url: Routes.ROOT,
        });

        expect(response.statusCode).toBe(200);

        await server.close();
    });
});
