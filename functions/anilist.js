const config = require('../../config.json')
const anilist = require('anilist-node');
const Anilist = new anilist(config.token);

function getAllSeasonAnimes(year, season, page) {
    season = season.toUpperCase();
    return new Promise(async (resolve, reject) => {
        if(!page) page = 1;
        var animes = [];
        await sleep((1000 * 60) /90)
        Anilist.searchEntry.anime(null, {
            format: "TV",
            season: season,
            seasonYear: year
        }, page, 25).then(async (data) => {
            if(data && data.media && data.media.length != 0) {
                for (let index = 0; index < data.media.length; index++) {
                    const element = data.media[index];
                    var anime = await getAnimeByID(element.id)
                    animes.push(anime);
                }
            }
            if(data && data.pageInfo && data.pageInfo.hasNextPage) {
                var nextPage = await getAllSeasonAnimes(year, season, page + 1);
                for (let index = 0; index < nextPage.length; index++) {
                    const element = nextPage[index];

                    if(element && element.id) {
                        var anime = await getAnimeByID(element.id)
                        animes.push(anime);
                    }
                }
            }
            resolve(animes);
        });
    })
}

function getAnimeByID(animeid) {
    return new Promise(async (resolve, reject) => {
        await sleep((1000 * 60) /90);
        Anilist.media.anime(animeid).then(data => {
            resolve(data);
        })
    })
}

async function updatePersonalList(username) {
    return new Promise(async (resolve, reject) => {
        var personalList = {};
        await sleep((1000 * 60) /90)
        Anilist.lists.anime(username).then((listData) => {
            listData.forEach((singleList) => {
                if(singleList.status != "PLANNING") {
                    singleList.entries.forEach((entrie, index) => {
                        var mediaentrie = entrie.media;
                        mediaentrie['score'] = entrie.score
                        personalList[entrie.media.title.romaji] = mediaentrie
                    
                        if(index == singleList.entries.length - 1) resolve(personalList);
                    })
                }
            })
        })
    })
}

function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(true);
        }, ms);
    })
}
module.exports = {
    getAllSeasonAnimes,
    getAnimeByID,
    updatePersonalList
}