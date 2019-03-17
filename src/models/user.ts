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
}

interface Location {
    latitude: string;
    longitude: string;
}