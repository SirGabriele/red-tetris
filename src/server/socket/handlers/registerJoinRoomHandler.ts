import {RTSocket} from "@server/socket/socket.types.ts";
import {WsChannels} from "@shared/ws/wsChannels.ts";

export function registerJoinRoomHandler(socket: RTSocket) {
    socket.on(WsChannels.JOIN_ROOM, () => {
        const { roomID, log } = socket.data;

        log.info('Player joined room');

        socket.join(roomID);
    });
}