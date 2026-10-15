import {RTServer, RTSocket} from "@server/socket/socket.ts";
import {WsChannels} from "@shared/ws/wsChannels.ts";

export function registerRotateHandler(io: RTServer, socket: RTSocket) {
    socket.on(WsChannels.ROTATE, () => {
        const { roomID, log } = socket.data;

        log('handling rotate')

        io.to(roomID).emit('state-change', `Player ${socket.id} rotate`);
    });
}