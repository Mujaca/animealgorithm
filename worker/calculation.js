let scoreObj = {
    tags: {},
    genres: {},
    keywords: {}
}
const { getKeyWords } = require("./keywords")
const { isMainThread, parentPort, workerData } = require('worker_threads');

const { animes, best, keywords } = workerData;
calculate(animes, best);



function calculate(animes, best) {
    calculateScore(best);
    const start = new Date();

    const recomandations = []
    for (let anime of animes) {
        anime['recomandation'] = calculateRecommandation(anime)
        recomandations.push(anime)
    }

    const end = new Date();
    console.log(`Calculated ${animes.length} in ` + (end.getTime() - start.getTime()) + "ms")
    parentPort.postMessage(recomandations)
}

function calculateRecommandation(show) {
    let score = 0;
    let sum = Object.keys(scoreObj.genres).length + Object.keys(scoreObj.keywords).length + Object.keys(scoreObj.tags).length;

    for(let genre of show.genres) {
        score += scoreObj.genres[genre] || 0;
    }

    for(let tag of show.tags) {
        score += scoreObj.tags[tag.name] || 0
    }

    const generatedKeywords = getKeyWords(show.description, keywords.keywords, keywords.minCount)
    for (let keyword of generatedKeywords) {
        score += scoreObj.keywords[keyword.keyword] || 0
    }

    for(let genre of Object.keys(scoreObj.genres)) {
        if(show.genres.includes(genre)) continue;
        score -= scoreObj.genres[genre] || 0;
    }


    for(let tag of Object.keys(scoreObj.tags)) {
        if(checkTags(show, tag)) continue;
        score -= scoreObj.tags[tag] || 0;
    }

    for(let keyword of Object.keys(scoreObj.keywords)) {
        if(checkKeyword(keyword)) continue;
        score -= scoreObj.keywords[keyword] || 0;
    }

    return score / sum;
}

function calculateScore(shows) {
    for(let show of shows) {
        for(let genre of show.media.genres) {
            if(!scoreObj.genres[genre]) scoreObj.genres[genre] = 0;
            scoreObj.genres[genre] += (show.score / 10);
        }

        for(let tag of show.media.tags) {
            if(!scoreObj.tags[tag.name]) scoreObj.tags[tag.name] = 0;
            scoreObj.tags[tag.name] += (show.score / 10);
        }

        const generatedKeywords = getKeyWords(show.media.description, keywords.keywords, keywords.minCount)
        for (let keyword of generatedKeywords) {
            if(!scoreObj.keywords[keyword.keyword]) scoreObj.keywords[keyword.keyword] = 0;
            scoreObj.keywords[keyword.keyword] += (show.score / 10);
        }
    }

    for(let genre of Object.keys(scoreObj.genres)) {
        scoreObj.genres[genre] = scoreObj.genres[genre] / shows.filter((anime) => {
            return anime.media.genres.includes(genre)
        }).length;
    }

    for(let tag of Object.keys(scoreObj.tags)) {
        scoreObj.tags[tag] = scoreObj.tags[tag] / shows.length
    }

    for(let keyword of Object.keys(scoreObj.keywords)) {
        scoreObj.keywords[keyword] = scoreObj.keywords[keyword] / shows.length
    }
}

function checkTags(show, tag) {
    for(let animeTag of show.tags) if(animeTag.name == tag) return true;
    return false;
}

function checkKeyword(keywords, keyword) {
    for(let singleKeyword of keywords) if(singleKeyword.keyword == keyword) return true;
    return false;
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


    return score / counted
}