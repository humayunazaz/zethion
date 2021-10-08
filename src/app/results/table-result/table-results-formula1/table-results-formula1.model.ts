export interface Formula1DataSession {
  numberOfManches: any[];
  session: number;
  nation: string;
  tournamentId: number;
  tournamentName: string;
  sessionType: string;
  results: Formula1DataSessionResult[];
}

export interface Formula1DataSessionResult {
  pilotId: number;
  pilotName: string;
  pilotSurname: string;
  pilotCompactName: string;
  teamID: number;
  team: string;
  position: number;
  startingPosition: number;
  difference: number;
  fastestLap: Formula1FastestLapEntry[];
  speedTrap: any;
  laps: number;
  finalResult: string;
  absoluteFastestLap: string;
}

export interface Formula1FastestLapEntry {
  time: string;
  manche: number;
}
