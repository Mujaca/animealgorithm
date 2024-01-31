<template>
    <div class="anime_recommandation">
        <img class="anime_picture" :alt="show.title.romaji" :src="show['coverImage'].medium" />
        <div class="anime_title" @click="openAnime()"> {{ show.title.romaji }} </div>
        <div class="anime_description">
            <div class="anime_description_text" v-html="show.description" />
        </div>
        <div class="anime_placement"> #{{ index }} </div>
    </div>
</template>

<script setup lang="ts">
import type { AnimeEntry } from 'anilist-node';

interface props {
    show: AnimeEntry
    index: number
}

const props = defineProps<props>();

function openAnime() {
    window.open('https://anilist.co/anime/' + props.show.id, '_blank')
}
</script>

<style>
.anime_recommandation {
  margin-left: 5px;
  margin-right: 5px;
  margin-top: 5px;
  position: relative;
  overflow: hidden;
  width: 230px;

  border-radius: 15px;
}

.anime_picture {
  width: 230px;
  height: 345px;
}

.anime_title {
  position: absolute;
  bottom: 3px;
  padding: 5px;
  width: 100%;
  background-color: rgba(0, 100, 200);
  height: 22px;
  word-break: break-all;
  overflow: hidden;

  text-align: center;
  font-size: 1.2rem;
}

.anime_title:hover {
  cursor: pointer;
}

.anime_placement {
  position: absolute;
  left: 5px;
  top: 5px;
  min-width: 35px;
  min-height: 35px;
  border-radius: 100%;


  background-color: rgb(0, 120, 240);
  font-size: 1.5rem;
  text-align: center;
}

.anime_description {
  height: 314px;
  width: 230px;
  overflow-y: auto;
  position: absolute;
  top: 0;
  z-index: 1;
}

.anime_description_text {
  display: none;
}

.anime_description:hover .anime_title {
  display: none;
}

.anime_description:hover {
  background-color: rgba(0, 0, 0, 0.733);
}

.anime_description:hover .anime_description_text{
  display: inherit;
  width: 90%;
  margin: auto;
  margin-top: 10px;

  font-family: 'Quicksand', sans-serif;
  font-size: 0.9rem;
}
</style>