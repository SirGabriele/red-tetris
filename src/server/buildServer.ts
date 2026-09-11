import fastify, {FastifyInstance} from "fastify";
import {registerControllers} from "@server/registerControllers.ts";

/**
 * Builds the server and register routes.
 *
 * @param options Server options.
 */
export function buildServer(options: { enableLogger?: boolean }): FastifyInstance {
    const server: FastifyInstance = fastify({
        logger: options?.enableLogger ?? {
            transport: {
                target: 'pino-pretty'
            }
        }
    });

    // Creates server endpoints
    registerControllers(server);

    return server;
}
