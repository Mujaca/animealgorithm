import type { AnimeEntry } from "anilist-node";
import fs from 'fs';

const animeStorage:Map<number, AnimeEntry> = new Map();
readCache();

export function addToCache(id:number, anime:AnimeEntry){
    animeStorage.set(id, anime);
    writeCache();
}

export function isInCache(id:number):boolean {
    return animeStorage.has(id);
}

export function getFromCache(id:number):AnimeEntry | undefined {
    return animeStorage.get(id);
}

function writeCache(){
    if(!fs.existsSync('./storage')) fs.mkdirSync('./storage')

    const keys = animeStorage.keys();
    for(let key of keys) {
        const filename = `./storage/${key}.json`
        if(fs.existsSync(filename)) continue;

        fs.writeFileSync(filename, JSON.stringify(animeStorage.get(key)));
    }
}

function readCache(){
    if(!fs.existsSync('./storage')) return;

    const files = fs.readdirSync('./storage', {
        'withFileTypes': false
    });

    console.log(`Loaded ${files.length} from cache`)

    for(let file of files) {
        const fileString = fs.readFileSync(`./storage/${file}`, 'utf-8');
        const fileObject = JSON.parse(fileString) as AnimeEntry;

        const fileIdString = file as string
        const id = parseInt(fileIdString.replaceAll('.json', ''));

        animeStorage.set(id, fileObject);
    }
}