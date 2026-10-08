import {FastifyInstance} from "fastify";
import {SERVER_CONFIG} from "@server/server.config.ts";
import {buildServer} from "@server/buildServer.ts";

const server: FastifyInstance = await buildServer({ enableLogger: true });

const start = async () => {
    try {
        await server.listen({
            port: SERVER_CONFIG.PORT,
            host: SERVER_CONFIG.HOST
        });
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

start();