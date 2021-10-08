
export class CookiesPreference {
    constructor(element?: CookiesPreference) {
        if (element) {
            Object.assign(this, element);
        } else {
            this.technical = true;
            this.analytical = false;
            this.operational = false;
            this.thirdParty = false;
        }
    }

    technical: boolean;
    analytical: boolean;
    operational: boolean;
    thirdParty: boolean;

    updateSingle(id, newValue) {
        switch (id) {
            case 'technical':
                this.technical = newValue;
                break;
            case 'analytical':
                this.analytical = newValue;
                break;
            case 'operational':
                this.operational = newValue;
                break;
            case 'thirdParty':
                this.thirdParty = newValue;
                break;
        }
    }

    acceptAll() {
        this.technical = true;
        this.thirdParty = true;
        this.operational = true;
        this.analytical = true;
    }

}
