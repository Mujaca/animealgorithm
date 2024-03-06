import { getGenres, getTags } from "~/functions/anilist"

const tags:String[] = [];

export default defineEventHandler(async (event) => {
    if(tags.length != 0) return tags;

    const fetched = await getTags()
    tags.push(...fetched);

    return tags;
})