import { CookiesPreference } from "../../dialogs/modals/cookie-preference";

export class SingleCustomizationCodeValue {
    constructor (value) {
        this.value = value;
        this.enabled = true;
    }
    value: string;
    enabled: boolean;
}

export class SingleUserCustomization {
    constructor (code: string, values: string[]) {
        this.customizationCode = code;
        this.values = [];
        values.forEach(singleValue => {
            this.values.push(new SingleCustomizationCodeValue(singleValue));
        });
    }
    customizationCode: string;
    values: SingleCustomizationCodeValue[];
}

export class NewRegisterVisitorModal {
    constructor(
        clientSecret: string, ip: string, country: string, appLanguage: string,
        userLanguage: string[], countries: string[], placeId: string
    ) {
        this.clientSecret = clientSecret;
        this.ip = ip;
        this.countryCode = country;
        this.place = placeId;
        this.userCustomizationsDTO = [];
        this.domain = window.location.origin;
        this.setUserCustomizations(appLanguage, userLanguage, countries);
    }
    clientSecret: string;
    ip: string;
    countryCode: string;
    place: string;
    domain: string;
    userCustomizationsDTO: SingleUserCustomization[];

    setUserCustomizations(appLanguage, userLanguage: string[], countries: string[]) {
        const defaultLanguage = new SingleUserCustomization('DEFAULT_LANGUAGE', [appLanguage]);
        const userCountries = new SingleUserCustomization('COUNTRIES', countries);
        const allUserLanguages = new SingleUserCustomization('USER_LANGUAGES', userLanguage);
        this.userCustomizationsDTO.push(defaultLanguage, userCountries, allUserLanguages);
        console.log(this.userCustomizationsDTO);
    }
}

export class UpdateRegisterVisitorModal {
    constructor(
        clientId: string, ip: string, country: string, customCode: string, customItem: string[]
    ) {
        this.clientId = clientId;
        this.ip = ip;
        this.countryCode = country;
        this.place = 'ND';
        this.userCustomizationsDTO = [];
        this.domain = window.location.origin;
        this.setUserCustomizations(customCode, customItem);
    }
    clientId: string;
    ip: string;
    countryCode: string;
    place: string;
    domain: string;
    userCustomizationsDTO: SingleUserCustomization[];

    setUserCustomizations(customCode: string, customItem: string[]) {
        const customDTO = new SingleUserCustomization(customCode, customItem);
        this.userCustomizationsDTO.push(customDTO);
        // console.log(this.userCustomizationsDTO);
    }

    setUserCookieCustomizations(customCode: string, cookiePreference: CookiesPreference) {
        const customItems: string[] = [];
        Object.keys(cookiePreference).forEach(singleKey => customItems.push(singleKey));
        const customDTO = new SingleUserCustomization(customCode, customItems);
        customDTO.values.forEach((singleCustomValue: SingleCustomizationCodeValue) => {
            singleCustomValue.enabled = cookiePreference[singleCustomValue.value];
        });
        // console.log(customDTO);
        this.userCustomizationsDTO.push(customDTO);
    }
}
