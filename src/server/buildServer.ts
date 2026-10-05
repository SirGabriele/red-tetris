import fastify, {FastifyInstance} from "fastify";
import {registerControllers} from "@server/registerControllers.ts";
import cors from '@fastify/cors'

/**
 * Builds the server and register routes.
 *
 * @param options Server options.
 */
export async function buildServer(options: { enableLogger?: boolean }): Promise<FastifyInstance> {
    const server: FastifyInstance = fastify({
        logger: options?.enableLogger ?? {
            transport: {
                target: 'pino-pretty'
            }
        }
    });

    await server.register(cors, {
        origin: "http://localhost:5173"
    })

    // Creates server endpoints
    registerControllers(server);

    return server;
}
