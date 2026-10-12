import {existsSync, unlinkSync} from 'node:fs'
import {DatabaseSync} from 'node:sqlite'

const databaseUrl = new URL('./red-tetris.sqlite', import.meta.url)

if (existsSync(databaseUrl)) {
    unlinkSync(databaseUrl)
}

const database = new DatabaseSync(databaseUrl)

database.exec(`
    CREATE TABLE score
    (
        id          INTEGER PRIMARY KEY AUTOINCREMENT,
        player_name TEXT    NOT NULL,
        score       INTEGER NOT NULL,
        created_at  TEXT    NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
`)

database.close()

console.log('Database successfully reset.')