    import {afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi} from 'vitest';
    import {mkdtemp, rm, writeFile} from 'node:fs/promises';
    import {tmpdir} from 'node:os';
    import {join} from 'node:path';
    import {buildServer} from "@server/build/buildServer.ts";
    import {FastifyInstance} from "fastify";
    import {io, type Socket} from 'socket.io-client';
    import {registerAllHandlers} from "@server/socket/registerAllHandlers.ts";
    import {Server} from "socket.io";
    import {SCOREBOARD_PAGE_SIZE} from "@shared/http/dto/scoreboard.dto.ts";

    const indexHtml = '<!doctype html><title>Red Tetris</title>';
    let staticRoot: string | undefined;

    vi.mock('@fastify/static', async (importOriginal) => {
        const {default: fastifyStatic} = await importOriginal<typeof import('@fastify/static')>();
        const serveFixture: typeof fastifyStatic = (server, options) =>
            fastifyStatic(server, {...options, root: staticRoot ?? options.root});

        return {default: serveFixture};
    });

    vi.mock('@server/socket/registerAllHandlers.ts', () => ({
        registerAllHandlers: vi.fn(),
    }));

    describe('buildServer', () => {
        let server: FastifyInstance;
        let clientSocket: Socket;

        beforeAll(async () => {
            staticRoot = await mkdtemp(join(tmpdir(), 'red-tetris-static-'));
            await writeFile(join(staticRoot, 'index.html'), indexHtml);
        });

        afterAll(async () => {
            if (staticRoot) {
                await rm(staticRoot, {recursive: true, force: true});
            }
        });

        beforeEach(async () => {
            vi.clearAllMocks();
            server = await buildServer({ enableLogger: false });
        });

        afterEach(async () => {
            await server.close();

            if (clientSocket) {
                clientSocket.disconnect();
            }

            vi.restoreAllMocks();
        });

        it('should serve index.html for unknown routes', async () => {
            const response = await server.inject({
                method: 'GET',
                url: '/game',
            });

            expect(response.statusCode).toBe(200);
            expect(response.headers['content-type']).toContain('text/html');
            expect(response.body).toBe(indexHtml);
        });

        it('should serve the scoreboard from SQLite', async () => {
            const response = await server.inject({
                method: 'GET',
                url: '/scoreboard/1',
            });

            expect(response.statusCode).toBe(200);
            expect(response.json()).toEqual({
                scores: expect.any(Array),
                currentPage: 1,
                totalPages: expect.any(Number),
                pageSize: SCOREBOARD_PAGE_SIZE,
            });
        });

        it('should register all handlers when a client connects', async () => {
            clientSocket = await createSocket('1', 'Jane');

            await new Promise<void>((resolve, reject) => {
                const timer = setTimeout(() => reject(new Error('Connection timeout')), 2000);

                clientSocket.on('connect', () => {
                    clearTimeout(timer);
                    resolve();
                });

                clientSocket.on('connect_error', (err) => {
                    clearTimeout(timer);
                    reject(err);
                });
            });

            expect(clientSocket.connected).toBe(true);
            expect(registerAllHandlers).toHaveBeenCalledExactlyOnceWith(
                expect.any(Server),
                expect.objectContaining({
                    id: clientSocket.id
                })
            );

            const [, serverSocket] = vi.mocked(registerAllHandlers).mock.calls[0];
            const logInfo = vi.spyOn(serverSocket.data.log, 'info');

            clientSocket.disconnect();
            await vi.waitFor(() => {
                expect(logInfo).toHaveBeenCalledWith(
                    expect.stringContaining(`User ${serverSocket.id} disconnected from room.`)
                );
            });
        });

        it('should accept a connection with valid credentials', async () => {
            clientSocket = await createSocket('9999', 'A'.repeat(50));

            await new Promise<void>((resolve, reject) => {
                clientSocket.once('connect', resolve);
                clientSocket.once('connect_error', reject);
            });

            expect(clientSocket.connected).toBe(true);
            expect(registerAllHandlers).toHaveBeenCalledExactlyOnceWith(
                expect.any(Server),
                expect.objectContaining({
                    id: clientSocket.id
                })
            );
        });

        it.each([{
            roomID: '0',
            playerName: 'Jane',
            expectedMessage: 'Room ID must be between 1 and 9999',
        }, {
            roomID: '10000',
            playerName: 'Jane',
            expectedMessage: 'Room ID must be between 1 and 9999',
        }, {
            roomID: '1',
            playerName: 'Jane Doe',
            expectedMessage:
                'Player name must only contain letters and numbers, up to 50 characters',
        }, {
            roomID: '1',
            playerName: 'A'.repeat(51),
            expectedMessage:
                'Player name must only contain letters and numbers, up to 50 characters',
        }
        ])('should reject invalid credentials: roomID=$roomID, playerName=$playerName',
            async ({ roomID, playerName, expectedMessage }) => {
                clientSocket = await createSocket(roomID, playerName);

                const error = await new Promise<Error>((resolve, reject) => {
                    clientSocket.once('connect', reject);
                    clientSocket.once('connect_error', resolve);
                });

                expect(error.message).toBe(expectedMessage);
                expect(clientSocket.connected).toBe(false);
                expect(registerAllHandlers).not.toHaveBeenCalled();
            },
        );

        async function createSocket(roomID: string, playerName: string) {
            await server.listen({ port: 0, host: '127.0.0.1' });

            const port = (server.server.address() as { port: number }).port;

            return io(`http://127.0.0.1:${port}`, {
                reconnection: false,
                auth: { roomID, playerName },
            });
        }
    });

