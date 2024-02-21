import type { AnimeEntry, ListEntry } from "anilist-node";
import type { counted, counter, personalList } from "~/@types/anilist";
import { getKeyWords } from "./keywords";

export function getBestShows(userlist:personalList,percent:number):ListEntry[] {
    let arr:ListEntry[] = [];
    
    for(let animekey of Object.keys(userlist)) {
        arr.push(userlist[animekey])
    }

    arr.sort(function(a, b) {
        return b.score - a.score;
    });
    
    let length = arr.length - 1;
    arr.splice((length / 100) * percent, length - ((length / 100) * percent) + 1);
    return arr
}

export function getFavoriteKeyWords(userlist:personalList):counted[]{
    const keywords:counter = {}
    let bestShows = getBestShows(userlist, 100);

    for(let show of bestShows) {
        let words = getKeyWords(show.media.description);
        for(let keyword of words) {
            if(!keywords[keyword.keyword]) keywords[keyword.keyword] = 0;
            keywords[keyword.keyword]++;
        }
    }

    const arr:counted[] = []
    for(let keyword of Object.keys(keywords)) {
        arr.push({keyword, number: keywords[keyword]})
    }
    Object.keys(keywords).forEach((keyword) => {
        arr.push({keyword, number: keywords[keyword]})
    })

    arr.sort(function(a, b) {
        return b.number - a.number;
    });

    return arr;
}

export function getFavoriteGenres(userlist:personalList):counted[]{
    const genres:counter = {};
    const bestShows = getBestShows(userlist, 100);
    for(let show of bestShows) {
        for(let genre of show.media.genres) {
            if(!genres[genre]) genres[genre] = 0;
            genres[genre]++;
        }
    }

    const arr:counted[] = []
    Object.keys(genres).forEach((genre) => {
        arr.push({genre, number: genres[genre]})
    })

    arr.sort(function(a, b) {
        return b.number - a.number;
    });

    return arr;
}

export function getFavoriteTags(userlist:personalList):counted[]{
    const tags:counter = {};
    const bestShows = getBestShows(userlist, 100);
    for(let show of bestShows) {
        for(let tag of show.media.tags) {
            if(!tags[tag.name]) tags[tag.name] = 0;
            tags[tag.name]++;
        }
    }

    var arr:counted[] = []
    Object.keys(tags).forEach((tag) => {
        arr.push({tag, number: tags[tag]})
    })

    arr.sort(function(a, b) {
        return b.number - a.number;
    });

    return arr;
}