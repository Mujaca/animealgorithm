import type { AnimeEntry, ListEntry, MediaSeason } from "anilist-node";
import type { allUser, personalList } from "~/@types/anilist";
import { getAllSeasonAnimes } from "./anilist";
import { getBestShows } from "./getBest";
import { getKeyWords, generateKeyWordsByDescription, getMinKeywordCount, getKeyWordObj } from "./keywords";
import { Worker } from 'worker_threads';
import { threads } from '../config.json';
 
var animes: AnimeEntry[] = []
var seasons = [
    "WINTER",
    "SPRING",
    "SUMMER",
    "FALL"
]

export async function getRecommandations(userlists: personalList, allusers: allUser) {
    const anilistRecomandations: number[] = [];
    let animesArr = animes.slice()

    for (let user of Object.keys(allusers)) {
        const best = getBestShows(allusers[user]);
        for (let anime of best) {
            if (!includesAnime(animes, anime.media as AnimeEntry)) animes.push(anime.media as AnimeEntry);
        }
    }

    for (let anime of Object.values(userlists)) {
        if (includesAnime(animesArr, anime.media as AnimeEntry)) {
            for (let index = 0; index < animesArr.length; index++) {
                const singleAnime = animesArr[index];
                if (singleAnime.title.romaji == anime.media.title.romaji) {
                    animesArr.splice(index, 1);
                }

            }
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
    for (let index = 0; index < 11; index++) {
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

export function calcuteSimilarities(show1: AnimeEntry, show2: AnimeEntry) {
    let score = 0;
    let counted = 0;

    const show_genres: string[] = [];

    for (let genreOne of show1.genres) {
        for (let genreTwo of show2.genres) {
            if (!show_genres.includes(genreTwo)) show_genres.push(genreTwo);
            if (genreOne == genreTwo) score++;

            if (!show_genres.includes(genreOne)) show_genres.push(genreOne);
        }

        counted = counted + show_genres.length;

        const show_tags: string[] = [];
        for (let tagOne of show1.tags) {
            for (let tagTwo of show2.tags) {
                if (!show_tags.includes(tagTwo.name)) show_tags.push(tagTwo.name);
                if (tagTwo.name == tagOne.name) score++;
                if (!show_tags.includes(tagOne.name)) show_tags.push(tagOne.name)
            }
        }
        counted = counted + show_tags.length;

        const show1keywords = getKeyWords(show1.description);
        const show2keywords = getKeyWords(show2.description);

        const show_keywords: string[] = [];
        for (let keywordOne of show1keywords) {
            for (let keywordTwo of show2keywords) {
                if (!show_keywords.includes(keywordTwo.keyword)) show_keywords.push(keywordTwo.keyword);
                if (keywordOne.keyword == keywordTwo.keyword) score++;

                if (!show_keywords.includes(keywordOne.keyword)) show_keywords.push(keywordOne.keyword);
            }
        }

        counted = counted + show_keywords.length;
    }

    return score / counted
}

function createChunks(animes: AnimeEntry[], chunks: number) {
    const slicedChunks = []
    const chunkSize = animes.length / chunks;


    for (let i = 0; i < animes.length; i += chunkSize)
        slicedChunks.push(animes.slice(i, i + chunkSize));

    return slicedChunks;
}

async function startWorker(animes:AnimeEntry[], bestAnimes:ListEntry[]):Promise<AnimeEntry[]> {
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

async function calculateService(animes: AnimeEntry[], bestAnimes:ListEntry[]) {
    const chunks = createChunks(animes, threads);
    const promisses = [];
    for(let chunk of chunks) {
        promisses.push(startWorker(chunk, bestAnimes));
    }

    const recomandation = [];
    const arrays = await Promise.all(promisses)
    for(let data of arrays) {
        recomandation.push(...data);
    }

    return recomandation;
}