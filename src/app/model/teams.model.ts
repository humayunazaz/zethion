import { Code } from "./code.model";

export interface Team {
  name: string;
  shortName?: string;
  sport: string;
  status: string;
  country: string;
  city?: string;
  foundationYear?: string;
  teamCodes?: Code[];
  translations?: any;
  contracts?: any;
}