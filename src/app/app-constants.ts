export class AppConstants {
  public static get ASSETS_URL_LOGO_TEAMS(): string {
    return 'https://storage.cloud.google.com/spring-bucket-sb-gcs-admin/img/teams';
  }

  public static MISSING_TEAM_LOGO_URL = 'https://storage.cloud.google.com/spring-bucket-sb-gcs-admin/img/teams/FOOTBALL/0.png';

  public static SORTED_LANGUAGES = [
    ['en', 'LANGUAGE.ENG'],
    ['it', 'LANGUAGE.ITA'],
    ['es', 'LANGUAGE.ESP'],
    ['fr', 'LANGUAGE.FRA'],
    ['de', 'LANGUAGE.GER']
    /*['us', 'LANGUAGE.USA'],
    ['zh', 'LANGUAGE.CHN'],
    ['ar', 'LANGUAGE.SAU'],
    ['pt', 'LANGUAGE.POR'],
    ['in', 'LANGUAGE.IND'],
    ['ru', 'LANGUAGE.RUS'],
    ['ja', 'LANGUAGE.JPN']*/
  ];

  public static SORTED_COUNTRIES = [
    {alphaTwoCode: 'GB', country: 'COUNTRY.GBR', languages: ['en']},
    {alphaTwoCode: 'IT', country: 'COUNTRY.ITA', languages: ['it']},
    {alphaTwoCode: 'ES', country: 'COUNTRY.ESP', languages: ['es']},
    {alphaTwoCode: 'FR', country: 'COUNTRY.FRA', languages: ['fr']},
    {alphaTwoCode: 'DE', country: 'COUNTRY.GER', languages: ['de']}
  ];

  public static COUNTRY_LANGUAGES = [
    {country: 'GB', languages: ['en']},
    {country: 'IT', languages: ['it']},
    {country: 'DE', languages: ['de']},
    {country: 'ES', languages: ['es']},
    {country: 'FR', languages: ['fr']}
  ];

  public static DEFAULT_COUNTRY = {
    country: 'GB', languages: ['en']
  };
}
