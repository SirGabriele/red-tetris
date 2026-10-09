import {SERVER_CONFIG} from "@client/src/server.config.ts";

export const BASE_URL = `${SERVER_CONFIG.BASE}:${SERVER_CONFIG.PORT}` as const;

export function buildRegisterRoute(playerName: string, roomID: string): string {
    return `${BASE_URL}/${roomID}/${playerName}`;
}