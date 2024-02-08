const keyword_extractor = require('keyword-extractor')


function getKeyWords(text, keywords, minKeywords) {
    const real = [];
    const extraction_result = keyword_extractor.extract(text, {
        language: "english",
        remove_digits: true,
        return_changed_case: true,
        remove_duplicates: true,
        return_chained_words: false,
    });

    for (let result of extraction_result) {
        const number = keywords[result]
        if (result != "source" && number > minKeywords) real.push({ number, keyword: result })
    }

    real.sort(function (a, b) {
        return b.number - a.number;
    });

    return real
}

exports.getKeyWords = getKeyWords;