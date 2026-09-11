import {Routes} from "@server/http/routes/routes.ts";
import {RootDto} from "@shared/http/dto/root.dto.ts";

export function rootController(): RootDto {
    return {
        message: `Hello from ${Routes.ROOT}`
    }
}