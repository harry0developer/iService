export interface Rating {
    uid: string;
    rid: string;
    rating: number;
}

export interface RatingData {
    iRated?: Rating[],
    ratedMe?: Rating[]
}