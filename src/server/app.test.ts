import {beforeEach, describe, expect, it, vi} from 'vitest';
import {ServerConfig} from "@server/server.config.ts";

const listen = vi.fn<() => Promise<string>>();

vi.mock('@server/buildServer.ts', () => ({
    buildServer: vi.fn(() => ({ listen })),
}));

describe('app', () => {
    beforeEach(() => {
        vi.resetModules();
        vi.clearAllMocks();
    });

    it('starts the server', async () => {
        await import('@server/app.ts');

        expect(listen).toHaveBeenCalledWith({
            port: ServerConfig.port,
            host: ServerConfig.host
        });
    });

    it('exits with 1 when listen fails', async () => {
        const error = new Error('Failed to start');
        listen.mockRejectedValue(error);

        const mockExit = vi
            .spyOn(process, 'exit')
            .mockReturnValue(null as never);

        const mockConsole = vi
            .spyOn(console, 'error')
            .mockImplementation(err => err);

        await import('@server/app.ts');

        await vi.waitFor(() => {
            expect(mockConsole).toHaveBeenCalledWith(error);
            expect(mockExit).toHaveBeenCalledWith(1);
        });
    });
});
