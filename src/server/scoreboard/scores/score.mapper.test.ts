import {describe, expect, it} from 'vitest'

import {mapScore} from '@server/scoreboard/scores/score.mapper.ts'

describe('mapScore', () => {
    it('should map database row to score', () => {
        expect(mapScore({
            player_name: 'Arthur',
            score: 5000
        })).toEqual({
            name: 'Arthur',
            score: 5000
        })
    })

    it('should throw when player name is invalid', () => {
        expect(() => mapScore({
            player_name: 42,
            score: 5000
        })).toThrow(TypeError)
    })

    it('should throw when score is invalid', () => {
        expect(() => mapScore({
            player_name: 'Arthur',
            score: '5000'
        })).toThrow(TypeError)
    })
})