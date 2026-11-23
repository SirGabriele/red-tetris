import {useEffect, useState} from "react";
import RegisterForm from "@client/src/pages/game/components/RegisterForm.tsx";
import GameComponent from "@client/src/pages/game/components/GameComponent.tsx";
import {type ExtendedError, io, Socket} from "socket.io-client";
import {BACK_URL} from "@shared/projectConfig.ts";
import {WsChannels} from "@shared/ws/wsChannels.ts";
import type {RTSocket} from "@client/src/types/socket.ts";

export default function GamePage() {
    const [isConnected, setConnected] = useState<boolean>(false);
    const [roomID, setRoomID] = useState<string | null>(null);
    const [socket, setSocket] = useState<RTSocket | null>(null);

    function submit(roomID: string, playerName: string): void {
        function onConnect() {
            console.log('Connected to server');

            setConnected(true);

            socket.emit(WsChannels.JOIN_ROOM);
        }

        function onDisconnect(reason: Socket.DisconnectReason) {
            console.log('Disconnected from server. Reason: ', reason);
            setConnected(false);
        }

        function onConnectError(error: ExtendedError) {
            console.error('Failed to connect:', error.message);
            setConnected(false);
        }

        const socket: RTSocket = io(BACK_URL, {
            reconnection: false,
            auth: { roomID, playerName }
        });

        setSocket(socket);
        setRoomID(roomID);

        socket.on('connect', () => {
            onConnect();
        })

        socket.on('connect_error', (error: ExtendedError) => {
            onConnectError(error)
        });

        socket.on('disconnect', (reason: Socket.DisconnectReason) => {
            onDisconnect(reason);
        });
    }

    // If the user navigates away from this page, closes the socket
    useEffect(() => {
        return () => {
            if (socket) {
                socket.disconnect();
            }
        };
    }, [socket]);

    return (
        <div className="flex flex-1">
            {isConnected && socket && roomID
                ? <GameComponent socket={socket} roomID={roomID}/>
                : <RegisterForm onSubmit={submit}/>}
        </div>
    )
}