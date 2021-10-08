import { Location } from './sports.model';

export class SportEvent {
  eventname: string;
  time: string;
  minute: number;
  name: string;
  team: Location;
  between: number;

  imageUrl?: string;
  isSeparator?: boolean = false;
  seperatorCaption?: string;
}
