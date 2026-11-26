const CLIENT_BASE_URL = 'http://localhost';
const CLIENT_PORT = 5173;

const SERVER_BASE_URL = 'http://localhost'
export const SERVER_PORT = 3000;
export const SERVER_HOST = '0.0.0.0';

export const FRONT_URL = `${CLIENT_BASE_URL}:${CLIENT_PORT}` as const;
export const BACK_URL = `${SERVER_BASE_URL}:${SERVER_PORT}` as const;

export const SCOREBOARD_PATH = '/scoreboard';

export function getScoreboardUrl(page: number): string {
    return `${SCOREBOARD_PATH}/${page}`;
}

export const ENABLE_LOG = true;
