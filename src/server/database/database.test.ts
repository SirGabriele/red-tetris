import {DatabaseSync} from 'node:sqlite'
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest'

describe('score database migration', () => {
    let database: DatabaseSync

    beforeEach(() => {
        database = new DatabaseSync(':memory:')
        database.exec(`
            CREATE TABLE score (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                player_name TEXT NOT NULL,
                score INTEGER NOT NULL,
                created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
            );
            INSERT INTO score (id, player_name, score) VALUES (7, 'Jane', 120);
        `)

        vi.resetModules()
        vi.doMock('node:sqlite', () => ({
            DatabaseSync: class {
                constructor() {
                    return database
                }
            }
        }))
    })

    afterEach(() => {
        if (database.isOpen) {
            database.close()
        }
        vi.doUnmock('node:sqlite')
        vi.restoreAllMocks()
    })

    it('should drop the legacy date column and preserve existing scores', async () => {
        const migrated = await import('@server/database/database.ts')

        expect(migrated.database.prepare('PRAGMA table_info(score)').all().map(column => column.name))
            .toEqual(['id', 'player_name', 'score'])
        expect(migrated.database.prepare('SELECT * FROM score').all())
            .toEqual([{id: 7, player_name: 'Jane', score: 120}])
    })

    it('should create an empty score table on first startup', async () => {
        database.exec('DROP TABLE score')

        const initialized = await import('@server/database/database.ts')

        expect(initialized.database.prepare('SELECT * FROM score').all()).toEqual([])
        expect(initialized.database.prepare('PRAGMA table_info(score)').all().map(column => column.name))
            .toEqual(['id', 'player_name', 'score'])
    })

    it('should roll back and close the database when the migration fails', async () => {
        database.exec('CREATE INDEX score_created_at ON score(created_at)')
        const exec = vi.spyOn(database, 'exec')

        await expect(import('@server/database/database.ts')).rejects.toThrow(/score_created_at/)

        expect(exec).toHaveBeenLastCalledWith('ROLLBACK')
        expect(database.isOpen).toBe(false)
    })
})
