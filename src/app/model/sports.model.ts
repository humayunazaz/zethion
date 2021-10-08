// String identifiers for supported sports
export type SportType = 'FOOTBALL' | 'BASKETBALL' | 'FORMULA1' | 'TENNIS';

export type Location = 'HOME' | 'AWAY';

export type MatchResultType = 'WON' | 'LOST';

export type Gender = 'M' | 'F';

export const ALL = {
  sport: 'ALL'
};

export interface Athlete {
  type: string;
  id: number;
  firstName: string;
  lastName: string;
  country: string;
  gender: Gender;
  birthDate: Date;
  height: string;
}

export interface News {
  id?: number;
  newsType: string;
  sourceName: string;
  language: string;
  countryCode: string;
  author: string;
  title: string;
  description: string;
  content: string;
  url: string;
  urlToMedia: string;
  mediaType: string;
  publishedAt: number;
}


export const GLOBALSPORTS = [
  {
    "sport": "ALPINE_SKIING",
  },
  {
    "sport": "ARTISTIC_GYMNASTICS",
  },
  {
    "sport": "AMERICAN_FOOTBALL",
  },
  {
    "sport": "ARCHERY",
  },
  {
    "sport": "ATHLETICS",
  },
  {
    "sport": "BADMINTON",
  },
  {
    "sport": "BASEBALL",
  },
  {
    "sport": "BASKETBALL",
  },
  {
    "sport": "BEACH_VOLLEYBALL",
  },
  {
    "sport": "BIATHLON",
  },
  {
    "sport": "BOBSLEIGH",
  },
  {
    "sport": "BOWLS",
  },
  {
    "sport": "BOXING",
  },
  {
    "sport": "CANOEING",
  },
  {
    "sport": "CRICKET",
  },
  {
    "sport": "CROSS_COUNTRY_SKIING",
  },
  {
    "sport": "CYCLING",
  },
  {
    "sport": "DARTS",
  },
  {
    "sport": "DIVING",
  },
  {
    "sport": "EQUESTRIAN",
  },
  {
    "sport": "FIELD_HOCKEY",
  },
  {
    "sport": "FOOTBALL",
  },
  {
    "sport": "FORMULA1",
  },
  {
    "sport": "FUTSAL",
    "roles": [
      {
        "role": "CENTER"
      },
      {
        "role": "GOALKEEPER"
      },
      {
        "role": "LATERAL"
      },
      {
        "role": "PIVOT"
      }
    ]
  },
  {
    "sport": "GOLF",
  },
  {
    "sport": "HANDBALL",
  },
  {
    "sport": "ICE_HOCKEY",
  },
  {
    "sport": "ICE_SKATING",
  },
  {
    "sport": "JUDO",
  },
  {
    "sport": "MMA",
  },
  {
    "sport": "MOTORCYCLING",
  },
  {
    "sport": "MOTOR_SPORTS",
  },
  {
    "sport": "MULTISPORTS",
  },
  {
    "sport": "PADEL",
  },
  {
    "sport": "RALLY",
  },
  {
    "sport": "ROWING",
  },
  {
    "sport": "RUGBY",
  },
  {
    "sport": "SAILING",
  },
  {
    "sport": "SHOOTING",
  },
  {
    "sport": "SKATERBOARDING",
  },
  {
    "sport": "SWIMMING",
  },
  {
    "sport": "TENNIS",
  },
  {
    "sport": "VOLLEYBALL",
  },
  {
    "sport": "WATER_POLO",
  },
  {
    "sport": "WINTER_SPORTS",
  },
  {
    "sport": "WRESTLING",
  }
]

