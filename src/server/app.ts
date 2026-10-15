import {FastifyInstance} from "fastify";
import {buildServer} from "@server/build/buildServer.ts";
import {ENABLE_LOG, SERVER_HOST, SERVER_PORT} from "@shared/projectConfig.ts";

const server: FastifyInstance = await buildServer({ enableLogger: ENABLE_LOG });

const start = async () => {
    try {
        await server.listen({
            port: SERVER_PORT,
            host: SERVER_HOST
        });
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

start();