import { ResultsBase } from "./results.model";

export interface Competition {
    id?: number;
    competitionName: string;
    sport: string;
    country: string;
    competitionType: string;
    partecipationType: string;
    gender: string;
    level: string;
    prestige: number | string;
    translations: any;
}


export interface CompetitionPerspectives extends ResultsBase {
    content: Competition[];
}