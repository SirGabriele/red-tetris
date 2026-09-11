import {RequestGenericInterface} from "fastify";
import {JoinRoomDto} from "@shared/http/dto/joinRoom.dto.ts";

export interface JoinRoomRequest extends RequestGenericInterface {
    Params: JoinRoomDto
}
