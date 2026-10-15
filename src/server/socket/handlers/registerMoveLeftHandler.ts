import {RTServer, RTSocket} from "@server/socket/socket.types.ts";
import {WsChannels} from "@shared/ws/wsChannels.ts";

export function registerMoveLeftHandler(io: RTServer, socket: RTSocket) {
    socket.on(WsChannels.MOVE_LEFT, () => {
        const { roomID, log } = socket.data;

        log('handling move left')

        io.to(roomID).emit('state-change', `Player ${socket.id} move left`);
    });
}