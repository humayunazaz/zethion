import { ResultsBase } from "./results.model";

export enum ParticipationType {
  CLUB_TEAM = "CLUB_TEAM",
  NATIONAL_TEAM = "NATIONAL_TEAM",
  PLAYER = "PLAYER"
}

export var ParticipationTypeSelection = [
  ParticipationType.CLUB_TEAM,
  ParticipationType.NATIONAL_TEAM,
  ParticipationType.PLAYER
]

