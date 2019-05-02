export interface Job {
    jid?: string;
    id?: string;
    rating?: number;
    uid: string;
    title: string;
    address: string;
    description: string;
    dateCreated: string;
}

export interface AppliedJob {
    uid: string;
    id?: string;
    jid: string;
    rid: string;
    dateApplied: string;
}

export interface ViewedJob {
    uid: string;
    id?: string;
    jid: string;
    rid: string;
    dateViewed: string;
}

export interface SharedJob {
    uid: string;
    id?: string;
    jid: string;
    rid: string;
    dateShared: string;
    platform: string;
}