import type { AnimeEntry, ListEntry, MediaSeason } from "anilist-node";
import type { allUser, personalList } from "~/@types/anilist";
import { getAllSeasonAnimes, getListStatus } from "./anilist";
import { getBestShows } from "./getBest";
import { getKeyWords, generateKeyWordsByDescription, getMinKeywordCount, getKeyWordObj } from "./keywords";
import { Worker } from 'worker_threads';
import { threads, yearsToFetch } from '../config.json';

var animes: AnimeEntry[] = []
var seasons = [
    "WINTER",
    "SPRING",
    "SUMMER",
    "FALL"
]

export async function getRecommandations(userlists: personalList, allusers: allUser, username:string) {
    const anilistRecomandations: number[] = [];
    let animesArr = animes.slice()

    for (let user of Object.keys(allusers)) {
        const best = getBestShows(allusers[user]);
        for (let anime of best) {
            if (!includesAnime(animes, anime.media as AnimeEntry)) animes.push(anime.media as AnimeEntry);
        }
    }

    for (let anime of Object.values(userlists)) {
        if (!includesAnime(animesArr, anime.media as AnimeEntry)) continue;

        for (let index = 0; index < animesArr.length; index++) {
            const singleAnime = animesArr[index];
            if (singleAnime.title.romaji != anime.media.title.romaji) continue;

            animesArr.splice(index, 1);
        }

    }

    const best = getBestShows(userlists);
    const recomandations: AnimeEntry[] = await calculateService(animesArr, best);
    recomandations.sort(function (a, b) {
        //@ts-ignore
        return b.recomandation - a.recomandation;
    });

    return recomandations;
}

function includesAnime(array: AnimeEntry[], show: AnimeEntry) {
    if (show.title == undefined) return false;
    for (let entry of array) {
        if ((entry.id == show.id) || entry.title.english === show.title.english) return true;
    }
    return false;
}

export async function fetchAnimes() {
    let year = new Date().getFullYear() - 1;
    for (let index = 0; index < yearsToFetch + 1; index++) {
        for (let i = 0; i < seasons.length; i++) {
            const season = seasons[i] as MediaSeason;
            console.log(`Fetching ${season} ${year}`)
            const season_animes = await getAllSeasonAnimes(year, season);


            for (let anime of season_animes) {
                if (!includesAnime(animes, anime)) animes.push(anime);

            }
        }
        year--;
    }
    generateKeyWordsByDescription(animes);
    console.log("Done fetching animes")
    return true;
}

function createChunks(animes: AnimeEntry[], chunks: number) {
    const slicedChunks = []
    const chunkSize = animes.length / chunks;


    for (let i = 0; i < animes.length; i += chunkSize)
        slicedChunks.push(animes.slice(i, i + chunkSize));

    return slicedChunks;
}

async function startWorker(animes: AnimeEntry[], bestAnimes: ListEntry[]): Promise<AnimeEntry[]> {
    return new Promise((resolve) => {
        const thread = new Worker('./worker/calculation.js', {
            workerData: {
                animes,
                best: bestAnimes,
                keywords: {
                    keywords: getKeyWordObj(),
                    minCount: getMinKeywordCount()
                }
            },
        });
        thread.once('message', resolve)
    })
}

async function calculateService(animes: AnimeEntry[], bestAnimes: ListEntry[]) {
    const chunks = createChunks(animes, threads);
    const promisses = [];
    for (let chunk of chunks) {
        promisses.push(startWorker(chunk, bestAnimes));
    }

    const recomandation = [];
    const arrays = await Promise.all(promisses)
    for (let data of arrays) {
        recomandation.push(...data);
    }

    return recomandation;
}