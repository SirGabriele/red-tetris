import type {Socket} from "socket.io-client";
import type {ClientToServerEvents, ServerToClientEvents} from "@shared/socketEvents.ts";

export type RTSocket = Socket<ServerToClientEvents, ClientToServerEvents>;
