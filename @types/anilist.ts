import { type ListEntry } from 'anilist-node';

export interface personalList {
    [anime:string]: ListEntry
}

export interface allUser {
    [username:string]: personalList
}

export interface counter {
    [toCount: string]: number;
}

export interface counted {
    number: number;
    [counted: string]: any;
}