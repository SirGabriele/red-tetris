import {WsChannels} from "@shared/ws/wsChannels.ts";
import {useEffect} from "react";
import type {RTSocket} from "@client/src/types/socket.ts";
import {KEY_TO_CHANNEL} from "@shared/socketEvents.ts";

type GameComponentProps = {
    socket: RTSocket,
    roomID: string,
}

export default function GameComponent({ socket }: GameComponentProps) {
    function handleStateChange() {
        console.log('handleStateChange');
    }

    useEffect(() => {
        socket.on(WsChannels.STATE_CHANGED, handleStateChange);

        return () => {
            socket.off(WsChannels.STATE_CHANGED, handleStateChange);
        }
    }, []);

    useEffect(() => {
        function handleKeyDown(event: KeyboardEvent) {
            const channel = KEY_TO_CHANNEL[event.key as keyof typeof KEY_TO_CHANNEL];

            // If the pressed key is not used in the game, we do not do anything and let the event propagate so that
            // the browser can keep its default behaviour.
            if (!channel || !socket.connected || event.shiftKey || event.ctrlKey || event.altKey || event.metaKey) {
                return;
            }

            // Prevent browser scrolling on arrow key press
            event.preventDefault();

            if (event.key === 'ArrowLeft') {
                socket.emit(WsChannels.MOVE_LEFT);
            } else if (event.key === 'ArrowUp') {
                socket.emit(WsChannels.ROTATE);
            } else if (event.key === 'ArrowRight') {
                socket.emit(WsChannels.MOVE_RIGHT);
            } else if (event.key === 'ArrowDown') {
                socket.emit(WsChannels.DROP_SOFT);
            } else if (event.key === 'Space') {
                socket.emit(WsChannels.DROP_HARD);
            }
        }

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        }
    }, [socket]);

    return (
        <div className="mx-auto flex min-h-screen max-w-xl items-center px-6">
            Game component
        </div>
    )
}