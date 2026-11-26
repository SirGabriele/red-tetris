import {database} from '@server/database/database.ts'
import type {ScoreRow} from '@server/scoreboard/scores/score.mapper.ts'

export function findScores(limit: number, offset: number): ScoreRow[] {
    const statement = database.prepare(`
        SELECT player_name, score
        FROM score
        ORDER BY score DESC, id ASC
        LIMIT ?
        OFFSET ?
    `)

    return statement.all(limit, offset)
}

export function countScores(): number {
    const statement = database.prepare(`
        SELECT COUNT(*) AS count
        FROM score
    `)

    const result = statement.get() as { count: number }

    return result.count
}
