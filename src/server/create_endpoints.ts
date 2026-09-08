import {Routes} from "../shared/routes.js";
import {FastifyInstance} from "fastify";

/**
 * Creates all app endpoints.
 */
export function create_endpoints(app: FastifyInstance) {
    app.get(Routes.ROOT, async () => {
        return {
            message: `Hello from ${Routes.ROOT}`
        }
    })

    app.post<{
        Params: {
            roomId: string;
            playerName: string;
        };
    }>('/example/:roomId/:playerName', {
        schema: {
            params: {
                type: 'object',
                required: ['roomId', 'playerName'],
                properties: {
                    roomId: {
                        type: 'string',
                        pattern: '^\\d+$'
                    },
                    playerName: {
                        type: 'string',
                        pattern: '^[a-zA-Z0-9]+$'
                    }
                }
            }
        }
    }, async (req) => {
        const { roomId, playerName } = req.params;

        console.log(`abcd room is ${roomId} and playerName is ${playerName}`);

        return {
            message: `abcd room is ${roomId} and playerName is ${playerName}`
        }
    })
}