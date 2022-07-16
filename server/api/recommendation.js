import * as fs from "fs";
import * as recoms from "../../functions/getRecommandations.js"
import * as anilist from "../../functions/anilist.js";
import * as keywords from "../../functions/keywords.js";
import * as config from "../../config.json";

var personalList = {}
var generated = {}

config.group.forEach(async (user) => {
    personalList[user] = await anilist.updatePersonalList(user);
})

export default defineEventHandler(async (event) => {
  // Get the Querys / set the default values for them
  const query = useQuery(event)
  var limit = query.limit ? query.limit : 100
  var page = query.page ? query.page : 0
  var keyword = query.keywords ? query.keywords : 30
  //Return if no User is found
  //TODO Change to real 400 error code & check if User exists
  if(!query.user) return { staus: 400, message: "No User given" }

  //Update the Algo Values
  keywords.setMinKeywordCount(keyword);

  //Add the User to the List & into the config, if he isnt there yet
  if(personalList[query.user] == undefined) {
    personalList[query.user] = await anilist.updatePersonalList(query.user);
    if(!config.group.includes(query.user)) config.group.push(query.user);
    fs.writeFileSync('../config.json', JSON.stringify(config));
  }

  //Generate the User recomnadations, if none are cached or regenerate is given
  var userreoms = generated[query.user]
  if(generated[query.user] == undefined || (query.regenerate == true || query.regenerate == 1)) userreoms = await recoms.getRecommandations(personalList[query.user], personalList)
  userreoms.forEach((anime,index) => {
    if(!anime.coverImage) {
      userreoms.splice(index, 1);
      index--;
    }
  })
  generated[query.user] = userreoms
  //Cut everything in multiple pages
  var limited = userreoms.slice();
  limited = limited.splice(limit * page, limit)

  return limited
})