import fastify, {FastifyInstance} from "fastify";
import fastifyStatic from '@fastify/static'
import {Server} from 'socket.io';
import {RTServer} from "@server/socket/socket.ts";
import {registerAllHandlers} from "@server/socket/registerAllHandlers.ts";
import {validateConnection} from "@server/socket/middleware/auth.validation.ts";
import path from "node:path";
import {FRONT_URL} from "@shared/projectConfig.ts";

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
    const io: RTServer = new Server(server.server, {
        cors: {
            origin: FRONT_URL,
            methods: ['GET', 'POST']
        }
    });

    })

    // Creates server endpoints
    registerControllers(server);

    server.addHook('preClose', (done) => {
        io.local.disconnectSockets(true);
        done();
    });

    io.on('connection', (socket) => {
        socket.data.log = server.log.child({
            socketID: socket.id,
            roomID: socket.data.roomID,
            playerName: socket.data.playerName
        });

        registerAllHandlers(io, socket);

        socket.on('disconnect', (reason) => {
            console.log(`User ${socket.id} disconnected from room. Reason: ${reason}`);
        });
    });

    return server;
}
