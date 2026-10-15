import {RTServer, RTSocket} from "@server/socket/socket.types.ts";
import {WsChannels} from "@shared/ws/wsChannels.ts";

export function registerMoveRightHandler(io: RTServer, socket: RTSocket) {
    socket.on(WsChannels.MOVE_RIGHT, () => {
        const { roomID, log } = socket.data;

        log('handling move right')

        io.to(roomID).emit('state-change', `Player ${socket.id} move right`);
    });
}