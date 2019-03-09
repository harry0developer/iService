export interface User {
    uid?: string;
    password?: string;
    type: string;
    firstname: string;
    lastname: string;
    email: string;
    phone: number;
    createdAt: number;
    location: Location;
}

interface Location {
    latitude: string;
    longitude: string;
}