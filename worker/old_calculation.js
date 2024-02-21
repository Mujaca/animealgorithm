require('tsconfig-paths/register');
require('ts-node').register({
    "compilerOptions": {
        "target": "ESNext",
        "module": "EsNext",
        "rootDir": ".",
    }
});

const { getKeyWords } = require("./keywords")
const { isMainThread, parentPort, workerData } = require('worker_threads');

const { animes, best, keywords } = workerData;
calculate(animes, best);


function calculate(animes, best) {
    const start = new Date();

    const recomandations = []
    for (let anime of animes) {
        let sum = 0;
        for (let topAnime of best) {

            let add = (calcuteSimilarities(anime, topAnime.media) * topAnime.score);
            //if (anilistRecomandations.includes(anime.id)) add = add * 1.1;
            sum += add

        }
        // @ts-ignore
        anime['recomandation'] = sum / best.length
        recomandations.push(anime)
    }

    const end = new Date();
    console.log(`Calculated ${animes.length} in ` +  (end.getTime() - start.getTime()) + "ms")
    parentPort.postMessage(recomandations)
}


function calcuteSimilarities(show1, show2) {
    let score = 0;
    let counted = 0;

    const show_genres = [];

    for (let genreOne of show1.genres) {
        for (let genreTwo of show2.genres) {
            if (!show_genres.includes(genreTwo)) show_genres.push(genreTwo);
            if (genreOne == genreTwo) score++;

            if (!show_genres.includes(genreOne)) show_genres.push(genreOne);
        }

        counted = counted + show_genres.length;

        const show_tags = [];
        for (let tagOne of show1.tags) {
            for (let tagTwo of show2.tags) {
                if (!show_tags.includes(tagTwo.name)) show_tags.push(tagTwo.name);
                if (tagTwo.name == tagOne.name) score++;
                if (!show_tags.includes(tagOne.name)) show_tags.push(tagOne.name)
            }
        }
        counted = counted + show_tags.length;

        const show1keywords = getKeyWords(show1.description, keywords.keywords, keywords.minCount);
        const show2keywords = getKeyWords(show2.description, keywords.keywords, keywords.minCount);

        const show_keywords = [];
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