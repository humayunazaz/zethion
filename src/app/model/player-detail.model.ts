import { EventResult } from './results.model';
import { Location } from './sports.model';

export class PlayerDetail {
  type: string;
  id: number;
  firstName: string;
  lastName: string;
  country: string;
  gender: string;
  birthDate: Date;
  height: string;
  role: string;
  team: number;
  teamLocation: Location;
  startingTeam: string;
  eventResults: EventResult[];
}

export class PlayerBasketDetail {
  type: string;
  id: number;
  firstName: string;
  lastName: string;
  compactName: string;
  country: string;
  gender: string;
  birthDate: Date;
  height: string;
  role: string;
  team: number;
  teamLocation: Location;
  startingTeam: string;
}
