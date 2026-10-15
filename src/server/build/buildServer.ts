import fastify, {FastifyInstance} from "fastify";
import fastifyStatic from '@fastify/static'
import {Server} from 'socket.io';
import {RTServer} from "@server/socket/socket.types.ts";
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

    server.register(fastifyStatic, {
        root: path.resolve(import.meta.dirname, '../../client/dist'),
        prefix: '/'
    });

    const io: RTServer = new Server(server.server, {
        cors: {
            origin: FRONT_URL,
            methods: ['GET', 'POST']
        }
    });

    server.setNotFoundHandler((_, reply) => {
        reply.sendFile('index.html')
    })

    // Register a middleware that ensures the request contains valid roomID and playerName to allow any connection
    io.use(validateConnection);

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
