import { ResultsEntryBase, Country, Place } from './results.model';
import { Athlete } from './sports.model';

export type Formula1ClassificationType = 'BEST_TIME' | 'POSITION' | 'STARTING_GRID';

export interface Formula1ResultsEntry extends ResultsEntryBase {
  matchCoaches: any[];
  gpday: string;
  session: string;
  manches: Formula1Manche[];
  matchPilots: Formula1Pilot[];
}

export interface Formula1Tournament {
  id: number;
  competition: Formula1Competition;
  place: Place;
}

export interface Formula1Competition {
  id: number;
  competitionName: string;
  country: Country;
}

export interface Formula1Pilot {
  team: number;
  athlete: Athlete;
}

export interface Formula1Manche {
  id: number;
  manche: number;
  mancheDate: Date;
  mancheTime: string;
  results: Formula1MancheResult[];
}

export interface Formula1MancheResult {
  id: number;
  position: number;
  fastestLap: string;
  absoluteFastestLap: string;
  startingPosition: number;
  laps: number;
  finalResult: string;
  athlete: Athlete;
  speedTrap: any;
}
