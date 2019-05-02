export interface Rating {
    uid: string;
    rid: string;
    rating: number;
    dateRated: string;
}

export interface RatingData {
    iRated?: Rating[],
    ratedMe?: Rating[]
}