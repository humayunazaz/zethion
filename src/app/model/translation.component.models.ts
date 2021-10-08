import { ResultsBase } from "./results.model";

export var LanguageSelection = [
  {code: 'ENG', value: 'en'},
  {code: 'ITA', value: 'it'},
  {code: 'FRA', value: 'fr'},
  {code: 'GER', value: 'de'},
  {code: 'ESP', value: 'es'}
]

export interface TranslationPerspective {
  code: string;
  cluster: string;
  languages: {
    en: string,
    it: string,
    fr: string,
    de: string,
    es: string
  };
}

export interface TranslationPerspectives extends ResultsBase {
  content: TranslationPerspective[];
}
