import {beforeEach, describe, expect, it, vi} from 'vitest';
import {SERVER_HOST, SERVER_PORT} from "@shared/projectConfig.ts";

const listen = vi.fn<() => Promise<string>>();

vi.mock('@server/build/buildServer.ts', () => ({
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
            port: SERVER_PORT,
            host: SERVER_HOST
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
