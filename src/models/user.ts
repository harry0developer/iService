export interface User {
    uid?: string;
    password?: string;
    type: string;
    firstname: string;
    lastname: string;
    email: string;
    phone?: string;
    location?: Location;
    createdAt: number;
}

interface Location {
    latitude: string;
    longitude: string;
}