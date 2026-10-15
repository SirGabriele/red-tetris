import {RTSocket} from "@server/socket/socket.types.ts";
import {PLAYER_NAME_PATTERN_REGEXP, ROOM_ID_PATTERN_REGEXP} from "@shared/utils/regex.utils.ts";
import {Socket} from "socket.io";

function attachDataToSocket(socket: Socket, roomID: string, playerName: string) {
    socket.data.roomID = roomID;
    socket.data.playerName = playerName;
}

export function validateConnection(
    socket: RTSocket,
    next: (err?: Error) => void
) {
    const { roomID, playerName } = socket.handshake.auth;

    if (typeof roomID !== "string" || !ROOM_ID_PATTERN_REGEXP.test(roomID)) {
        return next(new Error("Room ID must be between 1 and 9999"));
    }

    if (typeof playerName !== "string" || !PLAYER_NAME_PATTERN_REGEXP.test(playerName)) {
        return next(new Error("Player name must only contain letters and numbers, up to 50 characters"));
    }

    attachDataToSocket(socket, roomID, playerName);

    next();
}