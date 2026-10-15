import {RTServer, RTSocket} from "@server/socket/socket.ts";
import {registerJoinRoomHandler} from "@server/socket/handlers/registerJoinRoomHandler.ts";
import {registerMoveLeftHandler} from "@server/socket/handlers/registerMoveLeftHandler.ts";
import {registerRotateHandler} from "@server/socket/handlers/registerRotateHandler.ts";
import {registerMoveRightHandler} from "@server/socket/handlers/registerMoveRightHandler.ts";
import {registerDropSoftHandler} from "@server/socket/handlers/registerDropSoftHandler.ts";
import {registerDropHardHandler} from "@server/socket/handlers/registerDropHardHandler.ts";

export function registerAllHandlers(io: RTServer, socket: RTSocket) {
    registerJoinRoomHandler(socket);
    registerMoveLeftHandler(io, socket);
    registerRotateHandler(io, socket);
    registerMoveRightHandler(io, socket);
    registerDropSoftHandler(io, socket);
    registerDropHardHandler(io, socket);
}