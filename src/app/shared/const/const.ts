export const countryCode = ['it', 'es', 'fr', 'de', 'en']; //'us', 'zh', 'ar', 'pt', 'in', 'ru', 'jp'];

export const ConsentPreference = [
    {
        title: 'COOKIE.COOKIES_CATAGORIES_TECHNICAL',
        stateChanges: false,
        description: 'COOKIE.COOKIES_CATAGORIES_TECHNICAL_DESC_PARA1',
        id: 'technical',
        childCookies: [
            {
                name: 'JSESSIONID',
                host: 'zethion.com',
                duration: 'session',
                type: '1st party',
                description: ''
            },
            {
                name: 'XSRF-TOKEN',
                host: 'zethion.com',
                duration: 'session',
                type: '1st party',
                description: ''
            },
            {
                name: 'IP',
                host: 'zethion.com',
                duration: '2 year',
                type: '1st party',
                description: ''
            },
            {
                name: 'loggedUser',
                host: 'zethion.com',
                duration: '2 year',
                type: '1st party',
                description: ''
            },
            {
              name: 'customCookieConsent',
              host: 'zethion.com',
              duration: '2 year',
              type: '1st party',
              description: ''
            },
            {
              name: 'cookieConsentStatus',
              host: 'zethion.com',
              duration: '2 year',
              type: '1st party',
              description: ''
            },
            {
              name: 'clientId',
              host: 'zethion.com',
              duration: '2 year',
              type: '1st party',
              description: ''
            },
            {
              name: 'country',
              host: 'zethion.com',
              duration: '2 year',
              type: '1st party',
              description: ''
            },
            {
              name: 'language',
              host: 'zethion.com',
              duration: '2 year',
              type: '1st party',
              description: ''
            },
            {
              name: 'user-languages',
              host: 'zethion.com',
              duration: '2 year',
              type: '1st party',
              description: ''
            },
            {
              name: 'countries',
              host: 'zethion.com',
              duration: '2 year',
              type: '1st party',
              description: ''
            }
        ]
    },
    {
        title: 'COOKIE.COOKIES_CATAGORIES_ANALYTICAL',
        stateChanges: true,
        description: 'COOKIE.COOKIES_CATAGORIES_ANALYTICAL_DESC_PARA1',
        id: 'analytical',
        childCookies: []
    },
    {
        title: 'COOKIE.COOKIES_CATAGORIES_FUNCTIONAL',
        stateChanges: true,
        description: 'COOKIE.COOKIES_CATAGORIES_FUNCTIONAL_TYPE1_DESC',
        id: 'operational',
        childCookies: [
          {
            name: 'completeSportsList',
            host: 'zethion.com',
            duration: '2 year',
            type: '1st party',
            description: ''
          },
          {
            name: 'sports',
            host: 'zethion.com',
            duration: '2 year',
            type: '1st party',
            description: ''
          }
        ]
    },
    {
        title: 'COOKIE.COOKIES_CATAGORIES_THIRDPARTY',
        stateChanges: true,
        description: 'COOKIE.COOKIES_CATAGORIES_THIRDPARTY_DESC',
        id: 'thirdParty',
        childCookies: []
    }
];

export const cookiesTypes = {
    technicalCookies: ['JSESSIONID', 'XSRF-TOKEN', 'loggedUser', 'IP', 'customCookieConsent', 'cookieConsentStatus', 'clientId', 'countries', 'user-languages', 'language', 'country'],
    operationalCookies: ['sports', 'completeSportsList'],
};

export const sports = ["FOOTBALL", "RUGBY", "AMERICAN_FOOTBALL", "BASKETBALL", "VOLLEYBALL", "HANDBALL", "FUTSAL", "E_SPORTS", "TENNIS", "MMA", "BASEBALL", "ICE_HOCKEY", "ALPINE_SKIING", "BIATHLON", "CROSS_COUNTRY_SKIING", "WINTER_SPORTS", "PADEL", "BOXING", "CRICKET", "SAILING", "CYCLING", "ATHLETICS", "EQUESTRIAN", "WATER_SPORTS", "BOWLS", "DARTS", "GOLF", "FORMULA1", "MOTORCYCLING", "RALLY", "GRANTURISMO", "MOTOR_SPORTS"];
