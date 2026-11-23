import {beforeEach, describe, expect, it, vi} from "vitest";
import type {RTServer, RTSocket} from "@server/socket/socket.types.ts";
import {registerAllHandlers} from "@server/socket/registerAllHandlers.ts";
import {WsChannels} from "@shared/ws/wsChannels.ts";

describe('registerAllHandlers', () => {
    const on = vi.fn<(event: string, handler: () => void) => void>();
    const join = vi.fn();
    const emit = vi.fn();
    const to = vi.fn(() => ({emit}));

    beforeEach(() => {
        vi.clearAllMocks();
        const io = {to} as unknown as RTServer;
        const socket = {
            id: 'socket-id',
            data: {roomID: '42', log: {info: vi.fn()}},
            on,
            join,
        } as unknown as RTSocket;

        registerAllHandlers(io, socket);
    });

    it('should join the player to their room', () => {
        expect(on).toHaveBeenCalledWith(WsChannels.JOIN_ROOM, expect.any(Function));
        on.mock.calls.find(([event]) => event === WsChannels.JOIN_ROOM)?.[1]();

        expect(join).toHaveBeenCalledWith('42');
    });

    it.each([
        [WsChannels.MOVE_LEFT, 'move left'],
        [WsChannels.MOVE_RIGHT, 'move right'],
        [WsChannels.ROTATE, 'rotate'],
        [WsChannels.DROP_SOFT, 'drop soft'],
        [WsChannels.DROP_HARD, 'drop hard'],
    ])('should broadcast %s to the player room', (channel, action) => {
        expect(on).toHaveBeenCalledWith(channel, expect.any(Function));
        on.mock.calls.find(([event]) => event === channel)?.[1]();

        expect(to).toHaveBeenCalledWith('42');
        expect(emit).toHaveBeenCalledWith('state-change', `Player socket-id ${action}`);
    });
});
