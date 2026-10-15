import {RTServer, RTSocket} from "@server/socket/socket.ts";
import {WsChannels} from "@shared/ws/wsChannels.ts";

export function registerDropHardHandler(io: RTServer, socket: RTSocket) {
    socket.on(WsChannels.DROP_HARD, () => {
        const { roomID, log } = socket.data;

        log('handling drop hard')

        io.to(roomID).emit('state-change', `Player ${socket.id} drop hard`);
    });
}