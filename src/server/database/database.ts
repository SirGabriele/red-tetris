import {DatabaseSync} from 'node:sqlite'

export const database = new DatabaseSync(
    new URL('./red-tetris.sqlite', import.meta.url)
)

database.exec('BEGIN IMMEDIATE')
try {
    const columns = database.prepare('PRAGMA table_info(score)').all()
    if (columns.some(({name}) => name === 'created_at')) {
        database.exec('ALTER TABLE score DROP COLUMN created_at')
    }
    database.exec('COMMIT')
} catch (error) {
    database.exec('ROLLBACK')
    database.close()
    throw error
}
