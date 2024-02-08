import type { AnimeEntry, UserList } from 'anilist-node';
import keyword_extractor from 'keyword-extractor';
import type { counted, counter, personalList } from '~/@types/anilist';
const keywords: { [keyword: string]: number } = {}
let min_keywordcount = 30


export function getKeyWords(text: string): counted[] {
    const real: counted[] = [];
    const extraction_result = keyword_extractor.extract(text, {
        language: "english",
        remove_digits: true,
        return_changed_case: true,
        remove_duplicates: true,
        return_chained_words: false,
    });

    for (let result of extraction_result) {
        const number = keywords[result]
        if (result != "source" && number > 10) real.push({ number, keyword: result })
    }

    real.sort(function (a, b) {
        return b.number - a.number;
    });

    return real
}

export function generateKeyWordsByDescription(animes: AnimeEntry[]) {
    const animes_already_done: string[] = []
    for (let anime of animes) {
            animes_already_done.push(anime.title.romaji);

            const extraction_result = keyword_extractor.extract(anime.description, {
                language: "english",
                remove_digits: true,
                return_changed_case: true,
                remove_duplicates: true,
                return_chained_words: false,
            });

            for (let keyword of extraction_result) {
                if (keyword == "source") continue;

                if (!keywords[keyword]) keywords[keyword] = 0
                keywords[keyword]++;
            }
    }
}

export function setMinKeywordCount(number: number): void {
    min_keywordcount = number;
}

export function getMinKeywordCount() {
    return min_keywordcount;
}

export function getKeyWordObj(){
    return keywords;
}