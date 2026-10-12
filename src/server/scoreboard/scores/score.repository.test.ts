import {beforeEach, describe, expect, it, vi} from 'vitest'
import {database} from '@server/database/database.ts'
import {countScores, findScores} from '@server/scoreboard/scores/score.repository.ts'

vi.mock('@server/database/database.ts', async () => {
    const { DatabaseSync } = await import('node:sqlite')

    return {
        database: new DatabaseSync(':memory:')
    }
})

describe('scoreRepository', () => {
    beforeEach(() => {
        database.exec(`
            DROP TABLE IF EXISTS score;

            CREATE TABLE score
            (
                id          INTEGER PRIMARY KEY AUTOINCREMENT,
                player_name TEXT    NOT NULL,
                score       INTEGER NOT NULL,
                created_at  TEXT    NOT NULL DEFAULT CURRENT_TIMESTAMP
            );
        `)

        const insert = database.prepare(`
            INSERT INTO score (player_name, score)
            VALUES (?, ?)
        `)

        for (let i = 1; i <= 45; i++) {
            insert.run(`Player ${i}`, i * 100)
        }

        insert.run('Arthur', 5000)
        insert.run('Arthur', 3000)
        insert.run('Arthur', 1000)
    })

    describe('findScores', () => {
        it('should return first 20 scores ordered by score descending', () => {
            const scores = findScores(20, 0)

            expect(scores).toHaveLength(20)

            expect(scores[0]).toEqual({
                player_name: 'Arthur',
                score: 5000
            })
        })

        it('should return second page of scores', () => {
            const scores = findScores(20, 20)

            expect(scores).toHaveLength(20)
        })

        it('should return remaining scores', () => {
            const scores = findScores(20, 40)

            expect(scores).toHaveLength(8)
        })
    })

    describe('countScores', () => {
        it('should return total score count', () => {
            expect(countScores()).toBe(48)
        })
    })


})