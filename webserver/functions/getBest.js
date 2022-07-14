const { getKeyWords } = require('./keywords')

function getBestShows(userlist) {
    var arr = [];
    Object.keys(userlist).forEach((animekey) => {
        arr.push(userlist[animekey])
    })
    arr.sort(function(a, b) {
        return b.score - a.score;
    });
    var length = arr.length - 1;
    arr.splice((length / 100) * 35, length - ((length / 100) * 35) + 1);
    return arr
}

function getFavoriteKeyWords(userlist){
    var keywords = {}
    var bestShows = getBestShows(userlist);

    bestShows.forEach((show) => {
        var keyword = getKeyWords(show.description);
        keyword.forEach((word) => {
            if(!keywords[word.keyword]) keywords[word.keyword] = 0;
            keywords[word.keyword]++;
        })
    })

    var arr = []
    Object.keys(keywords).forEach((keyword) => {
        arr.push({keyword, number: keywords[keyword]})
    })

    arr.sort(function(a, b) {
        return b.number - a.number;
    });

    return arr;
}

function getFavoriteGenres(userlist){
    var genres = {};
    var bestShows = getBestShows(userlist);
    bestShows.forEach((show) => {
        show.genres.forEach((genre) => {
            if(!genres[genre]) genres[genre] = 0;
            genres[genre]++;
        })
    })

    var arr = []
    Object.keys(genres).forEach((genre) => {
        arr.push({genre, number: genres[genre]})
    })

    arr.sort(function(a, b) {
        return b.number - a.number;
    });

    return arr;
}

function getFavoriteTags(userlist){
    var tags = {};
    var bestShows = getBestShows(userlist);
    bestShows.forEach((show) => {
        show.tags.forEach((tag) => {
            if(!tags[tag.name]) tags[tag.name] = 0;
            tags[tag.name]++;
        })
    })

    var arr = []
    Object.keys(tags).forEach((tag) => {
        arr.push({tag, number: tags[tag]})
    })

    arr.sort(function(a, b) {
        return b.number - a.number;
    });

    return arr;
}

module.exports = { getBestShows, getFavoriteGenres, getFavoriteKeyWords, getFavoriteTags }