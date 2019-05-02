export interface User {
    uid?: string;
    id?: string;
    rating?: number;
    password?: string;
    type: string;
    firstname: string;
    lastname: string;
    gender: string;
    email: string;
    phone?: string;
    location?: Location;
    dateCreated: string;
    settings: Settings
}

export interface Settings {
    hide_dob: boolean;
    hide_email: boolean;
    hide_phone: boolean;
}

interface Location {
    latitude: string;
    longitude: string;
}