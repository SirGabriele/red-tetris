import type {ScoreType} from "../../types/score.type";

export interface ScoreboardDto {
    scores: ScoreType[],
    currentPage: number,
    totalPages: number,
}