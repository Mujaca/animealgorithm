const animes = require('../data/test.json');
const keyword_extractor = require("keyword-extractor");
const fs = require('fs')
const data = require('../data/keywords_nodisplay.json');

function getKeyWords(text){
    var real = [];
    var extraction_result = keyword_extractor.extract(text,{
        language:"english",
        remove_digits: true,
        return_changed_case:true,
        remove_duplicates: true,
        return_chained_words: false,
    });

    extraction_result.forEach((result, index) => {
        var number = data[result]
        if(result != "source") real.push({number, keyword: result})
        
    })

    real.sort(function(a, b) {
        return b.number - a.number;
    });
    real.splice(5, real.length - 5)
    return real
}

function generateKeyWordsByDescription(){
    var keywords = {};
    var animes_already_done = []
    Object.keys(animes).forEach((key, index) => {
        Object.keys(animes[key]).forEach((anime, i) => {
            if(!animes_already_done.includes(animes[key][anime].title.romaji)) {
                animes_already_done.push(animes[key][anime].title.romaji);
                const extraction_result = keyword_extractor.extract(animes[key][anime].description,{
                    language:"english",
                    remove_digits: true,
                    return_changed_case:true,
                    remove_duplicates: true,
                    return_chained_words: false,
                });
                extraction_result.forEach((keyword) => {
                    if(!(keyword == "source")) {
                        if(!keywords[keyword]) keywords[keyword] = 0
                        keywords[keyword]++;
                        /*console.clear();
                        console.log("##############################################################################")
                        console.log("Current User:                  " + `${index + 1}/${Object.keys(animes).length}`)
                        console.log("Current Anime:                 " + `${i + 1}/${Object.keys(animes[key]).length}`)
                        console.log("Animes already extracted:      " + animes_already_done.length);
                        console.log("Keywords currently extraceted: " + Object.keys(keywords).length)
                        console.log("##############################################################################")*/
                    }
                })
            }
            if(Object.keys(animes).length -1 == index && Object.keys(animes[key]).length - 1 == i) {
                /*var byNumber = {}
                var arr = Object.keys(keywords)
                for (let index = 0; index < arr.length; index++) {
                    const element = keywords[arr[index]];
                    if(!byNumber[element]) byNumber[element] = [];
                    byNumber[element].push(arr[index])
                    fs.writeFileSync('./data/keyword.json', JSON.stringify(byNumber))
                }**/
                fs.writeFileSync('../data/keywords_nodisplay.json', JSON.stringify(keywords))
            }
        })
    })
}

function generateKeyWordsByName(){
    var keywords = {};
    var animes_already_done = []
    Object.keys(animes).forEach((key, index) => {
        Object.keys(animes[key]).forEach((anime, i) => {
            if(!animes_already_done.includes(animes[key][anime].title.romaji)) {
                animes_already_done.push(animes[key][anime].title.romaji);
                const extraction_result = keyword_extractor.extract(animes[key][anime].title.english,{
                    language:"english",
                    remove_digits: true,
                    return_changed_case:true,
                    remove_duplicates: true,
                    return_chained_words: false,
                });
                extraction_result.forEach((keyword) => {
                    if(!keywords[keyword]) keywords[keyword] = 0
                    keywords[keyword]++;
                    /*console.clear();
                        console.log("##############################################################################")
                        console.log("Current User:                  " + `${index + 1}/${Object.keys(animes).length}`)
                        console.log("Current Anime:                 " + `${i + 1}/${Object.keys(animes[key]).length}`)
                        console.log("Animes already extracted:      " + animes_already_done.length);
                        console.log("Keywords currently extraceted: " + Object.keys(keywords).length)
                        console.log("##############################################################################")*/
                })
            }
            if(Object.keys(animes).length -1 == index && Object.keys(animes[key]).length - 1 == i) {
                /**var byNumber = {}
                var arr = Object.keys(keywords)
                for (let index = 0; index < arr.length; index++) {
                    const element = keywords[arr[index]];
                    if(!byNumber[element]) byNumber[element] = [];
                    byNumber[element].push(arr[index])
                    fs.writeFileSync('./data/keyword.json', JSON.stringify(byNumber))
                }*/
                fs.writeFileSync('../data/keywords_nodisplay.json', JSON.stringify(keywords))
            }
        })
    })
}

module.exports = {
    getKeyWords,
    generateKeyWordsByDescription,
    generateKeyWordsByName
}
exports.getKeyWords = getKeyWords;
exports.generateKeyWordsByDescription = generateKeyWordsByDescription;
exports.generateKeyWordsByName = generateKeyWordsByName;