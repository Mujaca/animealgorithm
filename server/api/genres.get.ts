import { getGenres } from "~/functions/anilist"

const genres:String[] = [];

export default defineEventHandler(async (event) => {
    if(genres.length != 0) return genres;

    const fetched = await getGenres()
    genres.push(...fetched);

    return genres;
})