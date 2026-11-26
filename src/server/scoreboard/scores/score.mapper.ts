import type {SQLOutputValue} from 'node:sqlite'
import type {ScoreType} from '@shared/types/score.type.ts'

export type ScoreRow = Record<string, SQLOutputValue>

export function mapScore(row: ScoreRow): ScoreType {
    if (typeof row.player_name !== 'string' || typeof row.score !== 'number') {
        throw new TypeError('Invalid score row')
    }

    return {
        name: row.player_name,
        score: row.score
    }
}
