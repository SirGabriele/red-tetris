import type {ScoreType} from "@shared/types/score.type.ts";

export function splitScores(scores: ScoreType[]): ScoreType[][] {
    let newScores: ScoreType[][] = [];

    newScores.push(scores.slice(0, 9));
    newScores.push(scores.slice(10, 19));

    return newScores;
}