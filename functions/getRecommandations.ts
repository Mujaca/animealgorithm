import type { AnimeEntry, MediaSeason } from "anilist-node";
import type { allUser, personalList } from "~/@types/anilist";
import { getAllSeasonAnimes } from "./anilist";
import { getBestShows } from "./getBest";
import { getKeyWords, generateKeyWordsByDescription } from "./keywords";

var animes: AnimeEntry[] = []
var seasons = [
    "WINTER",
    "SPRING",
    "SUMMER",
    "FALL"
]

fetchAnimes();

export async function getRecommandations(userlists: personalList, allusers: allUser) {
    const anilistRecomandations: number[] = [];

    for (let user of Object.keys(allusers)) {
        const best = getBestShows(allusers[user]);
        for (let anime of best) {
            if (!includesAnime(animes, anime.media as AnimeEntry)) animes.push(anime.media as AnimeEntry);
        }
    }

    for (let anime of Object.values(userlists)) {
        if (includesAnime(animes, anime.media as AnimeEntry)) {
            for (let index = 0; index < animes.length; index++) {
                const singleAnime = animes[index];
                if (singleAnime.title.romaji == anime.media.title.romaji) {
                    animes.splice(index, 1);

                    /**for (let anilistRecomandation of singleAnime.recommendations) {
                        if (!anilistRecomandations.includes(anilistRecomandation.id)) anilistRecomandations.push(anilistRecomandation.id)
                    }**/
                }

            }
        }
    }

    const best = getBestShows(userlists);
    const recomandations: AnimeEntry[] = []

    for (let anime of animes) {
        let sum = 0;

        for (let topAnime of best) {
            let add = (calcuteSimilarities(anime, topAnime.media as AnimeEntry) * topAnime.score);
            if (anilistRecomandations.includes(anime.id)) add = add * 1.1;
            sum = + add

            // @ts-ignore
            anime['recomandation'] = sum / best.length
            recomandations.push(anime)
        }

        recomandations.sort(function (a, b) {
            //@ts-ignore
            return b.recomandation - a.recomandation;
        });

        return recomandations;
    }
}

function includesAnime(array: AnimeEntry[], show: AnimeEntry) {
    if (show.title == undefined) return false;
    var bool = false;
    array.forEach((arrobj) => {
        if (arrobj instanceof Object && arrobj.title instanceof Object && arrobj.title.romaji == show.title.romaji) bool = true;
    })
    return bool;
}

async function fetchAnimes() {
    let year = new Date().getFullYear() - 1;
    for (let index = 0; index < 11; index++) {
        for (let i = 0; i < seasons.length; i++) {
            const season = seasons[i] as MediaSeason;
            const season_animes = await getAllSeasonAnimes(year, season);

            console.log(`Fetching ${season} ${year}`)

            for (let anime of season_animes) {
                if (!includesAnime(animes, anime)) animes.push(anime);

            }
        }
        year--;
    }
    generateKeyWordsByDescription(animes)
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