import fastify, {FastifyInstance} from "fastify";
import {createEndpoints} from "@server/createEndpoints.ts";

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
    createEndpoints(server);

    return server;
}
