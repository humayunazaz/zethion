import { SportType } from './sports.model';




export function listYears() {
  var years = [];
  years.push('ALL');
  for (var i = 1990; i <= new Date().getFullYear(); i++) {
    years.push(i);
  }
  return years
}

export function listSurfaces() {
  return Object.keys(Surface).map((value) => {
    return {
      key: value,
      value: Surface[value],
    }
  })
}

export function listInOuts() {
  return Object.keys(InOut).map((value) => {
    return {
      key: value,
      value: InOut[value],
    }
  })
}

export function listCurrentLevels() {
  return Object.keys(CurrentLevel).map((value) => {
    return {
      key: value,
      value: CurrentLevel[value],
    }
  })
}

export function listTagTypes() {
  return Object.keys(TagType).map((value) => {
    return {
      key: value,
      value: TagType[value],
    }
  })
}

export function listMediaCountry() {
  return Object.keys(MediaCountry).map((value) => {
    return {
      key: value,
      value: MediaCountry[value],
    }
  })
}

export function listMediaType() {
  return Object.keys(MediaType).map((value) => {
    return {
      key: value,
      value: MediaType[value],
    }
  })
}

export function listMediaLanguage() {
  return Object.keys(MediaLanguage).map((value) => {
    return {
      key: value,
      value: MediaLanguage[value],
    }
  })
}

export function listMediaStatus() {
  return Object.keys(MediaStatus).map((value) => {
    return {
      key: value,
      value: MediaStatus[value],
    }
  })
}

export function listAthleteTypes() {
  return Object.keys(AthleteType).map((value) => {
    return {
      key: value,
      value: AthleteType[value],
    }
  })
}

export function listLateralities() {
  return Object.keys(Laterality).map((value) => {
    return {
      key: value,
      value: Laterality[value],
    }
  })
}

export function listGenders() {
  return Object.keys(Gender).map((value) => {
    return {
      key: value,
      value: Gender[value],
    }
  })
}


export interface ResultsBase {
  page: number;
  size: number;
  totalPages: number;
  totalElements: number;
  numberOfElements?: number;
  first?: boolean;
  last?: boolean;
}

export interface ResultParamsTable extends ResultsBase {
  selectedSport: SportType;
  tableData: any[];
}


// vvv Universal
export interface TournamentStage {
  tournament: Tournament;
  stageType: string; // TODO change to literal stirng type
  stageDay: number;
}

// vvv Universal
export interface Edition {
  id: number;
  competition: Competition;
  place: Place;
  year: number;
  date: string;
  inOut?: string;
  sutface?: string;
  currentLevel?: string;
}

export interface Tournament {
  id: number;
  competition: Competition;
  place: Place;
  startingYear: number;
  date: string;
  inOut?: string;
  sutface?: string;
  currentLevel?: string;
}

// vvv Universal
export interface Competition {
  id: number;
  competitionName: string;
  country: Country;
}

// vvv Universal
export interface Country {
  code: string;
  country: string;
  alpha2Code: string;
  // ...
}

// vvv Universal
export interface Place {
  placeId: string;
  description: string;
  latitude: number;
  longtitude: number;
}

// vvv Universal, extended per sport
export interface ResultsEntryBase {
  id: any;
  matchDate: Date;
  time?: string;
  tournamentStage: TournamentStage;
}

export class Team {
  id: any;
  name: string;
  mainCode?: string;
  country?: string;
}

export interface EventResult {
  idOrig?: number;
  event: string;
  time: string;
  minute: number;
}

const InOut = {
  'In': 'IN',
  'Out': 'OUT'
}

const Surface = {
  'Hard': 'HARD',
  'Clay': 'CLAY',
  'Carpet': 'CARPET',
  'Grass': 'GRASS'
}

const CurrentLevel = {
  '250': '250',
  '500': '500',
  'Masters 1000': 'MASTERS_1000',
  '1000': '1000',
  'Grande Slam': 'GRANDE_SLAM',
  'GS': 'GS',
  'Finals': 'FINALS',
  'F': 'F',
  'Premier': 'PREMIER',
  'International': 'INTERNATIONAL',
  'Premier 5': 'PREMIER_5',
  'P': 'P',
  'Finals Elite': 'FINALS_ELITE',
  'Olimpiadi': 'OLIMPIADI',
  'FNG': 'FNG',
  'I': 'I',
  'P5': 'P5',
  '125K': '125K',
  'Premier Mandatory': 'PREMIER_MANDATORY'
}

export const TagType = {
  'All': 'ALL',
  'Athlete': 'ATHLETE',
  'Team': 'TEAM',
  'Media': 'MEDIA',
  'People': 'PEOPLE',
  'Association': 'ASSOCIATION',
  'Competition': 'COMPETITION',
  'General': 'GENERAL',
  'Sport': 'SPORT'
}

export const MediaType = {
  'ALL': 'ALL',
  'NEWSPAPER': 'NEWSPAPER',
  'TELEVISION': 'TELEVISION',
  'WEBSITE': 'WEBSITE',
  'ND': 'ND'
}

export const MediaLanguage = {
  'IT': 'it',
  'FR': 'fr',
  'EN': 'en',
  'DE': 'de',
  'ES': 'es'
}

export const MediaCountry = {
  'ALL': 'ALL',
  'IT': 'IT',
  'FR': 'FR',
  'GB': 'GB',
  'DE': 'DE',
  'ES': 'ES'
}

export const MediaStatus = {
  'ACTIVE': 'ACTIVE',
  'CLOSED': 'CLOSED'
}

export const AthleteType = {
  'ALL': 'ALL',
  'PLAYER': 'PLAYER',
  'COACH': 'COACH',
  'PILOT': 'PILOT',
  'FIGHTER': 'FIGHTER',
  'GYMNAST': 'GYMNAST',
  'RUNNER': 'RUNNER',
  'JUMPER': 'JUMPER',
  'SKATER': 'SKATER',
  'SWIMMER': 'SWIMMER',
  'SAILOR': 'SAILOR',
  'CYCLIST': 'CYCLIST'
}
export const Gender = {
  'ALL': 'ALL',
  'MALE': 'M',
  'FEMALE': 'F',
}

export const Laterality = {
  'RIGHT': 'RIGHT',
  'LEFT': 'LEFT',
  'AMBIDEXTROUS': 'AMBIDEXTROUS',
  'UNKNOWN': 'UNKNOWN'
}
