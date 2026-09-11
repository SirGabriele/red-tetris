import {describe, expect, it} from "vitest";
import {Routes} from "@server/http/routes/routes.ts";
import {rootController} from "@server/controllers/root.controller.ts";

describe('rootController', () => {
    it('should return greeting', () => {
        const response = rootController();

        expect(response).toEqual({
            message: `Hello from ${Routes.ROOT}`
        });
    });
});