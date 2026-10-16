import {RTServer, RTSocket} from "@server/socket/socket.types.ts";
import {WsChannels} from "@shared/ws/wsChannels.ts";

export function registerDropSoftHandler(io: RTServer, socket: RTSocket) {
    socket.on(WsChannels.DROP_SOFT, () => {
        const { roomID, log } = socket.data;

        log.info('handling drop soft')

        io.to(roomID).emit('state-change', `Player ${socket.id} drop soft`);
    });
}