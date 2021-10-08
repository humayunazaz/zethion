import { Code } from "./code.model";

export interface Athlete {
  firstName: string;
  lastName: string;
  country: string;
  secondaryCountry?: string;
  gender: string;
  birthDate?: string;
  birthPlace?: string;
  height?: string;
  type?: string;
  sport: string;
  athleteCodes?: Code[];
  translations?: any;
  team: any;
  laterality?: string;
}