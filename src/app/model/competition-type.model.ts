import { ResultsBase } from "./results.model";

export enum CompetitionType {
  CHAMPIONSHIP = "CHAMPIONSHIP",
  CUP = "CUP",
  RACE = "RACE",
  TOURNAMENT= "TOURNAMENT"
}

export var CompetitionTypeSelect = [
  CompetitionType.CHAMPIONSHIP,
  CompetitionType.CUP,
  CompetitionType.RACE,
  CompetitionType.TOURNAMENT
]

