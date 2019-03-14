export interface User {
    uid?: string;
    rating?: number;
    password?: string;
    type: string;
    firstname: string;
    lastname: string;
    gender: string;
    email: string;
    phone?: string;
    location?: Location;
    createdAt: number;
}

interface Location {
    latitude: string;
    longitude: string;
}