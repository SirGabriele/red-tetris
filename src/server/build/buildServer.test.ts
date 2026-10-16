    import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
    import {buildServer} from "@server/build/buildServer.ts";
    import {FastifyInstance} from "fastify";
    import {io, type Socket} from 'socket.io-client';
    import {registerAllHandlers} from "@server/socket/registerAllHandlers.ts";
    import {Server} from "socket.io";

    vi.mock('@server/socket/registerAllHandlers.ts', () => ({
        registerAllHandlers: vi.fn(),
    }));

    describe('buildServer', () => {
        let server: FastifyInstance;
        let clientSocket: Socket;

        beforeEach(async () => {
            vi.clearAllMocks();
            server = await buildServer({ enableLogger: false });
        });

        afterEach(async () => {
            await server.close();

            if (clientSocket) {
                clientSocket.disconnect();
            }
        });

        it('should serve index.html for unknown routes', async () => {
            const response = await server.inject({
                method: 'GET',
                url: '/game',
            });

            expect(response.statusCode).toBe(200);
            expect(response.headers['content-type']).toContain('text/html');
        });

        it('should register all handlers when a client connects', async () => {
            const consoleSpy = vi.spyOn(console, 'log');

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

            clientSocket.disconnect();
            await vi.waitFor(() => {
                expect(consoleSpy).toHaveBeenCalledOnce();
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

