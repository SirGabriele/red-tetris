import type {ScoreType} from '../../types/score.type'

export const SCOREBOARD_PAGE_SIZE = 10

export interface ScoreboardDto {
    scores: ScoreType[]
    currentPage: number
    totalPages: number
    pageSize: number
}