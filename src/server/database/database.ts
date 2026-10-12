import {DatabaseSync} from 'node:sqlite'

export const database = new DatabaseSync(
    new URL('./red-tetris.sqlite', import.meta.url)
)