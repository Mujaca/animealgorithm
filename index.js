const config = require('./config.json')
const fs = require('fs');
const { calcuteSimilarities, getRecommandations } = require('./functions/getRecommandations');
const { updatePersonalList } = require('./functions/anilist');
var personalList = {}

config.group.forEach(async (user) => {
    personalList[user] = await updatePersonalList(user);
})

setTimeout(() => {
    fs.writeFileSync('./data/animes.json', JSON.stringify(personalList));
    getRecommandations(personalList['Mujaca'], personalList);
}, 30000);

