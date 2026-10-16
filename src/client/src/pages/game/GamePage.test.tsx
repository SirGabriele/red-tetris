import {act, cleanup, fireEvent, render, screen} from '@testing-library/react';
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import GamePage from './GamePage';
import {io} from 'socket.io-client';
import {WsChannels} from '@shared/ws/wsChannels.ts';
import type {RTSocket} from "@client/src/types/socket.ts";

vi.mock('@client/src/pages/game/components/RegisterForm.tsx', () => ({
    default: ({ onSubmit }: { onSubmit: (roomID: string, playerName: string) => void }) => (
        <button
            data-testid="mock-register-form"
            onClick={() => onSubmit('room-id', 'player-name')}
        />
    )
}));

vi.mock('@client/src/pages/game/components/GameComponent.tsx', () => ({
    default: () => (
        <div data-testid="mock-game-component"/>
    )
}));

vi.mock('socket.io-client', () => ({
    io: vi.fn()
}));

describe('GamePage', () => {
    let mockSocket: {
        id: string;
        on: ReturnType<typeof vi.fn>;
        emit: ReturnType<typeof vi.fn>;
        disconnect: ReturnType<typeof vi.fn>;
    };

    beforeEach(() => {
        vi.clearAllMocks();

        // Helper mock socket capturing registered event handlers
        mockSocket = {
            id: 'fake-socket-id',
            on: vi.fn(),
            emit: vi.fn(),
            disconnect: vi.fn()
        };

        vi.mocked(io).mockReturnValue(mockSocket as unknown as RTSocket);
    });

    afterEach(() => {
        cleanup();
    })

    it('should initially render RegisterForm', () => {
        render(<GamePage/>);

        expect(screen.getByTestId('mock-register-form')).toBeInTheDocument();
        expect(screen.queryByTestId('mock-game-component')).not.toBeInTheDocument();
    });

    it('should initialize socket and display GameComponent on successful connection', () => {
        render(<GamePage/>);

        // Triggers form submission
        fireEvent.click(screen.getByTestId('mock-register-form'));

        // Verifies socket initialisation
        expect(io).toHaveBeenCalledOnce();
        expect(mockSocket.on).toHaveBeenCalledTimes(3);
        expect(mockSocket.on).toHaveBeenCalledWith('connect', expect.any(Function));
        expect(mockSocket.on).toHaveBeenCalledWith('connect_error', expect.any(Function));
        expect(mockSocket.on).toHaveBeenCalledWith('disconnect', expect.any(Function));

        // Since no back end is connected, the handler function associated to 'connect' event is never actually called.
        // We grab this handler function and call it manually.
        const onConnectCall = mockSocket.on.mock.calls.find(([event]) => event === 'connect');

        // The handler function is the second argument. The first argument is the event name ('connect')
        const onConnectCallback = onConnectCall?.[1];

        act(() => {
            onConnectCallback();
        });

        expect(mockSocket.emit).toHaveBeenCalledWith(WsChannels.JOIN_ROOM);
        expect(screen.getByTestId('mock-game-component')).toBeInTheDocument();
    });

    it('remains in RegisterForm state if connection fails (connect_error)', () => {
        render(<GamePage/>);

        fireEvent.click(screen.getByTestId('mock-register-form'));

        // Since no back end is connected, the handler function associated to 'connect_error' event is never actually called.
        // We grab this handler function and call it manually.
        const onConnectErrorCall = mockSocket.on.mock.calls.find(([event]) => event === 'connect_error');

        // The handler function is the second argument. The first argument is the event name ('connect_error')
        const onConnectErrorCallback = onConnectErrorCall?.[1];

        act(() => {
            onConnectErrorCallback({ message: 'Connection failed' });
        });

        expect(screen.getByTestId('mock-register-form')).toBeInTheDocument();
        expect(screen.queryByTestId('mock-game-component')).not.toBeInTheDocument();
    });

    it('switches back to RegisterForm when socket disconnects', () => {
        render(<GamePage/>);

        fireEvent.click(screen.getByTestId('mock-register-form'));

        // Since no back end is connected, the handler function associated to 'connect_error' event is never actually called.
        // We grab this handler function and call it manually.
        const onConnectCall = mockSocket.on.mock.calls.find(([event]) => event === 'connect');
        const onDisconnectCall = mockSocket.on.mock.calls.find(([event]) => event === 'disconnect');

        // The handler function is the second argument. The first argument is the event name ('connect_error')
        const onConnectCallback = onConnectCall?.[1];
        const onDisconnectCallback = onDisconnectCall?.[1];

        act(() => {
            onConnectCallback();
        });

        expect(screen.getByTestId('mock-game-component')).toBeInTheDocument();

        // Simulate disconnection
        act(() => {
            onDisconnectCallback({});
        });

        expect(screen.getByTestId('mock-register-form')).toBeInTheDocument();
        expect(screen.queryByTestId('mock-game-component')).not.toBeInTheDocument();
    });

    it('disconnects the socket when GamePage unmounts', () => {
        const { unmount } = render(<GamePage/>);

        fireEvent.click(screen.getByTestId('mock-register-form'));

        // Unmount page component
        unmount();

        // Verify cleanup
        expect(mockSocket.disconnect).toHaveBeenCalledOnce();
    });
});