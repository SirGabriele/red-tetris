import {WsChannels} from "./ws/wsChannels";

export interface ClientToServerEvents {
    [WsChannels.DROP_SOFT]: () => void;
    [WsChannels.DROP_HARD]: () => void;
    [WsChannels.JOIN_ROOM]: () => void;
    [WsChannels.MOVE_LEFT]: () => void;
    [WsChannels.MOVE_RIGHT]: () => void;
    [WsChannels.ROTATE]: () => void;
}

export interface ServerToClientEvents {
    [WsChannels.STATE_CHANGED]: (data: string) => void;
}

export const KEY_TO_CHANNEL = {
    ArrowLeft: WsChannels.MOVE_LEFT,
    ArrowRight: WsChannels.MOVE_RIGHT,
    ArrowUp: WsChannels.ROTATE,
    ArrowDown: WsChannels.DROP_SOFT,
    Space: WsChannels.DROP_HARD,
} as const;