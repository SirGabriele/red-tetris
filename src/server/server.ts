import fastify, {FastifyInstance} from "fastify";
import {create_endpoints} from "./create_endpoints.js";

const app: FastifyInstance = fastify({
    logger: {
        transport: {
            // Pretty logging for dev mode.
            // According to Fastify documentation pino-pretty needs to be installed as a dev dependency.
            // It is not included by default for performance reasons.
            // See : https://fastify.dev/docs/latest/Reference/Logging/
            target: 'pino-pretty'
        }
    }
});

// Creates app endpoints
create_endpoints(app);

const start = async () => {
    try {
        await app.listen({
            port: 3000,
            host: '0.0.0.0'
        });
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

start();