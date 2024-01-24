import type { personalList } from '~/@types/anilist';
import config from '../config.json';
import { type MediaSearchEntry, type MediaFilterTypes, type MediaSeason, type AnimeEntry, type ListEntry } from 'anilist-node';
import Anilist from 'anilist-node';
const anilist = new Anilist(config.token);

export async function getAllSeasonAnimes(year: number, season: MediaSeason, page?: number): Promise<AnimeEntry[]> {
    if (!page) page = 1;
    let animes: AnimeEntry[] = [];
    const data = await anilist.searchEntry.anime(undefined, {
        format: "TV",
        season: season,
        seasonYear: year
    }, page, 25)

    for (let media of data.media) {
        const anime = await getAnimeByID(media.id)
        animes.push(anime);
    }

    let nextPage = await getAllSeasonAnimes(year, season, page + 1);
    animes.push(...nextPage);

    return animes;
}

export async function getAnimeByID(animeid: number) {
    console.log(animeid)
    await sleep(900);
    const anime = await anilist.media.anime(animeid)
    return anime;
}

export async function updatePersonalList(username: string): Promise<personalList> {
    var personalList:personalList = {};
    const listData = await anilist.lists.anime(username)
    listData[0].entries[0].media
    for (let singleList of listData) {
        if (singleList.status == "PLANNING") continue;

        for(let entrie of singleList.entries) {
            const mediaentrie = entrie;
            personalList[entrie.media.title.romaji] = mediaentrie
        }
    }

    return personalList;
}

function sleep(ms: number) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(true);
        }, ms);
    })
}