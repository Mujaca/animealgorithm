<template>
  <div class="anime_recommandation">
    <img class="background_picture" :src="show['coverImage'].medium">
    <div class="picture-container">
      <img class="anime_picture" :alt="show.title.romaji" :src="show['coverImage'].large" />
    </div>
    <div class="anime_title" @click="openAnime()">
      <span class="anime_title_text">{{ show.title.romaji }}</span>
    </div>
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

<style lang="scss">
.anime_recommandation {
  margin-left: 5px;
  margin-right: 5px;
  margin-top: 5px;
  position: relative;
  overflow: hidden;
  max-width: 460px;

  border-radius: 15px;

  &:hover {
    .anime_description {
      display: inherit;
    }
  }

  .background_picture {
    width: 100%;

    position: absolute;
    left: 0;
    top: 0;
    z-index: -1;
    filter: blur(100px) brightness(80%);
  }


  .picture-container {
    width: 100%;
    display: flex;

    .anime_picture {
      max-width: 360px;
      margin: auto;
    }
  }

  .anime_title {
    position: absolute;
    bottom: 0;
    padding: 5px 0;
    width: 100%;
    background-color: #008080;
    height: 27px;
    word-break: break-all;
    overflow: hidden;
    display: flex;

    text-align: center;
    font-size: 1.2rem;

    &:hover {
      cursor: pointer;
    }

    .anime_title_text {
      width: 100%;
      padding: 0 1rem;
    }
  }

  .anime_placement {
    position: absolute;
    left: 5px;
    top: 5px;
    border-radius: 50%;
    padding: 8px;
    aspect-ratio: 1;


    background-color: #008080;
    font-size: 1rem;
    text-align: center;
    display: flex;
    align-items: center;
    align-content: center;
    justify-items: center;
    justify-content: center;
  }

  .anime_description {
    overflow-y: auto;
    position: absolute;
    top: 0;
    z-index: 1;
    display: none;
    background-color: rgba(0, 0, 0, 0.733);
    width: calc(100% - 2rem);
    height: calc(100% - 69px);
    padding: 1rem;
  }

  .anime_description_text {
    display: inherit;

    font-family: 'Open Sans', sans-serif;
    font-size: 0.9rem;
  }
}
</style>