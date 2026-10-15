import {beforeEach, describe, expect, vi, it} from "vitest";
import {RTServer, RTSocket} from "@server/socket/socket.ts";
import {registerAllHandlers} from "@server/socket/registerAllHandlers.ts";
import {registerJoinRoomHandler} from "@server/socket/handlers/registerJoinRoomHandler.ts";
import {registerMoveLeftHandler} from "@server/socket/handlers/registerMoveLeftHandler.ts";
import {registerRotateHandler} from "@server/socket/handlers/registerRotateHandler.ts";
import {registerMoveRightHandler} from "@server/socket/handlers/registerMoveRightHandler.ts";
import {registerDropSoftHandler} from "@server/socket/handlers/registerDropSoftHandler.ts";

vi.mock('@server/socket/handlers/registerJoinRoomHandler.ts', () => ({
    registerJoinRoomHandler: vi.fn(),
}));

vi.mock('@server/socket/handlers/registerMoveLeftHandler.ts', () => ({
    registerMoveLeftHandler: vi.fn(),
}));

vi.mock('@server/socket/handlers/registerRotateHandler.ts', () => ({
    registerRotateHandler: vi.fn(),
}));

vi.mock('@server/socket/handlers/registerMoveRightHandler.ts', () => ({
    registerMoveRightHandler: vi.fn(),
}));

vi.mock('@server/socket/handlers/registerDropSoftHandler.ts', () => ({
    registerDropSoftHandler: vi.fn(),
}));

describe('registerAllHandlers', () => {
    let mockIO:RTServer;
    let mockSocket: RTSocket;

    beforeEach(() => {
        vi.clearAllMocks();

        mockIO = {} as RTServer;
        mockSocket = {
            id: 'socket-id',
            on: vi.fn()
        } as unknown as RTSocket;
    })

    it('should invoke all registered event handlers with correct arguments', () => {
        registerAllHandlers(mockIO, mockSocket);

        expect(registerJoinRoomHandler).toHaveBeenCalledWith(mockSocket);
        expect(registerMoveLeftHandler).toHaveBeenCalledWith(mockIO, mockSocket);
        expect(registerRotateHandler).toHaveBeenCalledWith(mockIO, mockSocket);
        expect(registerMoveRightHandler).toHaveBeenCalledWith(mockIO, mockSocket);
        expect(registerDropSoftHandler).toHaveBeenCalledWith(mockIO, mockSocket);
    });
});