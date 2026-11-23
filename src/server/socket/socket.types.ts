import type {Server, Socket} from "socket.io";
import type {ClientToServerEvents, ServerToClientEvents} from "@shared/socketEvents.ts";

export type RTSocket = Socket<ClientToServerEvents, ServerToClientEvents>;

export type RTServer = Server<ClientToServerEvents, ServerToClientEvents>;
