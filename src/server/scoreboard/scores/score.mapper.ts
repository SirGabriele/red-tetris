import type {SQLOutputValue} from 'node:sqlite'
import type {ScoreType} from "@shared/types/score.type.ts";


export function mapScore(row: Record<string, SQLOutputValue>): ScoreType {
    if (typeof row.player_name !== 'string' || typeof row.score !== 'number') {
        throw new TypeError('Invalid score row')
    }

    return {
        name: row.player_name,
        score: row.score
    }
}