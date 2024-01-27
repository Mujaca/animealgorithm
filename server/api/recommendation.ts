import * as fs from "fs";
import * as config from "../../config.json";
import type { allUser } from "~/@types/anilist";
import { updatePersonalList } from "~/functions/anilist";
import { setMinKeywordCount } from "~/functions/keywords";
import { fetchAnimes, getRecommandations } from "~/functions/getRecommandations";
import type { AnimeEntry } from "anilist-node";


const personalList: allUser = {}
const generated:{[username:string]: AnimeEntry[]} = {}

config.group.forEach(async (user) => {
    personalList[user] = await updatePersonalList(user);
});

(async() => {
    await fetchAnimes();
})()

export default defineEventHandler(async (event) => {
    const query = getQuery(event)
    const limit: number = query.limit ? query.limit as number : 100
    const page: number = query.page ? query.page as number : 0
    const keyword: number = query.keywords ? query.keywords as number : 30
    const username:string = query.user as string;
    if (!query.user) return { staus: 400, message: "No User given" }

    setMinKeywordCount(keyword);

    if (personalList[username] == undefined) {
        personalList[username] = await updatePersonalList(username);
        if (!config.group.includes(username)) config.group.push(username);
        fs.writeFileSync('../config.json', JSON.stringify(config));
    }

    let userreoms = generated[username]
    if (generated[username] == undefined || (query.regenerate == true || query.regenerate == 1)) userreoms = await getRecommandations(personalList[username], personalList)

    for (let index = 0; index < userreoms.length; index++) {
        const anime = userreoms[index];
        
        /**if (!anime.coverImage) {
            userreoms.splice(index, 1);
            index--;
        }**/
    }

    generated[username] = userreoms
    let limited = userreoms.slice();
    limited = limited.splice(limit * page, limit)

    return limited
})