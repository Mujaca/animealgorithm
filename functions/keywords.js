const keyword_extractor = require("keyword-extractor");
var keywords = {}
var min_keywordcount = 30


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
        var number = keywords[result]
        if(result != "source" && number > 10) real.push({number, keyword: result})
        
    })

    real.sort(function(a, b) {
        return b.number - a.number;
    });
    return real
}

function generateKeyWordsByDescription(animes){
    var keywords = {};
    var animes_already_done = []
    Object.keys(animes).forEach((key, index) => {
        Object.keys(animes[key]).forEach((anime, i) => {
            if(animes[key][anime] instanceof Object && animes[key][anime].title instanceof Object && !animes_already_done.includes(animes[key][anime].title.romaji)) {
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
                    }
                })
            }
        })
    })
    console.log("done")
}

function setMinKeywordCount(number) {
    min_keywordcount = number;
}

module.exports = {
    getKeyWords,
    generateKeyWordsByDescription,
    setMinKeywordCount,
}
exports.getKeyWords = getKeyWords;
exports.generateKeyWordsByDescription = generateKeyWordsByDescription;
exports.setMinKeywordCount = setMinKeywordCount;