import {Routes} from "@server/http/routes/routes.ts";
import { FastifyInstance } from "fastify";
import {afterEach, beforeEach, describe, expect, it } from "vitest";
import {buildServer} from "@server/buildServer.ts";

describe('registerControllers', () => {
    let server: FastifyInstance;

    beforeEach(() => {
        server = buildServer({enableLogger: false});
    });

    afterEach(async () => {
        await server.close();
    });

    it.each([
        Routes.ROOT,
        Routes.JOIN_ROOM
    ])(`should have registered to route %s`, async (url) => {
        expect(server.hasRoute({
            method: 'GET',
            url: url
        })).toBe(true);
    });
});