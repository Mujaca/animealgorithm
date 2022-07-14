const keyword_extractor = require("keyword-extractor");
var keywords = {}


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
        if(result != "source" && number > 5) real.push({number, keyword: result})
        
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
                    }
                })
            }
        })
    })
    console.log("done")
}

module.exports = {
    getKeyWords,
    generateKeyWordsByDescription,
}
exports.getKeyWords = getKeyWords;
exports.generateKeyWordsByDescription = generateKeyWordsByDescription;