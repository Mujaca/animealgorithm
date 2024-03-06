import type { personalList } from '~/@types/anilist';
import config from '../config.json';
import { type MediaSearchEntry, type MediaFilterTypes, type MediaSeason, type AnimeEntry, type ListEntry, type UserStaffNameLanguage } from 'anilist-node';
import Anilist from 'anilist-node';
import { addToCache, getFromCache, isInCache } from './storage';
const anilist = new Anilist(config.token);

const listType:Map<string, Map<string, string>> = new Map();

export async function getAllSeasonAnimes(year: number, season: MediaSeason, page?: number): Promise<AnimeEntry[]> {
    if (!page) page = 1;
    console.log(`Fetching page ${page} from ${season} ${year}`)
    let animes: AnimeEntry[] = [];
    await sleep(3000);
    const data = await anilist.searchEntry.anime(undefined, {
        format: "TV",
        season: season,
        seasonYear: year
    }, page, 25)
    if(data.media.length as number == 0) return []
    console.log(`Got ${data.media.length} from page ${page} from ${season} ${year}`)

    for (let media of data.media) {
        const anime = await getAnimeByID(media.id)
        animes.push(anime);
    }

    let nextPage = await getAllSeasonAnimes(year, season, page + 1);
    animes.push(...nextPage);

    return animes;
}

export async function getAnimeByID(animeid: number) {
    if(isInCache(animeid)) return getFromCache(animeid) as AnimeEntry; 
    console.log(`${animeid} is not in the cache. Fetching from anilist`)
    await sleep(3000);
    const anime = await anilist.media.anime(animeid);
    addToCache(anime.id, anime);
    return anime;
}

export async function updatePersonalList(username: string): Promise<personalList> {
    const personalList:personalList = {};
    listType.set(username, new Map());
    await sleep(4000)
    const listData = await anilist.lists.anime(username)

    for (let singleList of listData) {
        
        for(let entrie of singleList.entries) {
            listType.get(username)?.set(entrie.media.title.romaji, singleList.status)
            if (singleList.status == "PLANNING" || singleList.status == "DROPPED") continue;
            personalList[entrie.media.title.romaji] = entrie
        }
    }

    return personalList;
}

export async function getGenres(){
    return await anilist.genres()
}

export async function getTags() {
    return (await anilist.mediaTags()).map((item) => {
        return item.name;
    })
}

export function getListStatus(username:string, anime:string) {
    return listType.get(username)?.get(anime)
}


function sleep(ms: number) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(true);
        }, ms);
    })
}