import { IPolicyNav } from "./policy.modal";

export const policyNav: IPolicyNav[] = [
    {
        mainTitle: 'USE_LEFTNAV.CONTACT',
        collapseable: false,
        collapsed: true,
        id: 'contact'
    },
    {
        mainTitle: 'USE_LEFTNAV.TERMS',
        collapseable: true,
        collapsed: true,
        id: 'terms'
    },
    {
        mainTitle: 'USE_LEFTNAV.PRIVACY',
        collapseable: true,
        collapsed: true,
        id: 'privacy'
    },
    {
        mainTitle: 'USE_LEFTNAV.COOKIE_POLICY',
        collapseable: true,
        collapsed: true,
        id: 'cookiePolicy'
    },
    {
        mainTitle: 'USE_LEFTNAV.COOKIE_MANAGEMENT',
        collapseable: false,
        collapsed: true,
        id: 'cookieManagement'
    }
];
