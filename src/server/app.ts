import {FastifyInstance} from "fastify";
import {ServerConfig} from "@server/server.config.ts";
import {buildServer} from "@server/buildServer.ts";

const server: FastifyInstance = buildServer({ enableLogger: true });

const start = async () => {
    try {
        await server.listen({
            port: ServerConfig.port,
            host: ServerConfig.host
        });
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

start();