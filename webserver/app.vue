<template>
  <div class="container">
    <div class="input">
      <div class="center">
        <input placeholder="Anilist Username" class="input_username" v-model="username">
        <button class="input_search" @click="getRecommandations">
          <span class="material-icons"> check </span>
        </button>
      </div>
      <button v-if="page != 0" class="left_page input_search" @click="removePage"> <span class="material-icons"> arrow_backwards_ios </span> </button>
      <button class="right_page input_search" @click="addPage"> <span class="material-icons"> arrow_forward_ios </span> </button>
    </div>

    <div class="recomandations">
      <div class="anime_recommandation" v-for="(show,index) in recomandations" :key="index" >
        <img class="anime_picture" :alt="show.title.romaji" :src="show['coverImage'].medium"/>
        <div class="anime_title"> {{show.title.romaji}} </div>
        <div class="anime_description"> <div class="anime_description_text" v-html="show.description"/> </div>
        <div class="anime_placement"> #{{(index + 1) + (recomandations.length * (page))}} </div>
      </div>
    </div>

    <div class="lds-spinner" v-if="loading"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
  </div>
</template>

<script setup>
var username = ref("");
var recomandations = ref([])
var loading = ref(false);
var page = ref(0)

async function addPage(){
  page.value++;
  getRecommandations();
}

async function removePage(){
  page.value--;
  getRecommandations();
}

async function getRecommandations(){
  loading.value = true;
  var arr = await $fetch(`/api/recommendation?user=${username.value}&limit=14&page=${page.value}`).catch((error) => {
    loading.value = false;
    return;
  })

  if(arr.length) {
    arr.forEach((anime,index) => {
      if(!anime.coverImage) {
        arr.splice(index, 1);
        index--;
      }
    })

    recomandations.value = arr;

    loading.value = false;
  }
}

</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@300&display=swap');

body {
  background-color: #23272A;
  color: white;
}

.right_page {
  position: absolute;
  right: 0;
  top: 0;
}

.left_page {
  position: absolute;
  left: 0;
  top: 0;
}

.input .center {
  width: 13%;
  margin: auto;
}

.input {
  position: relative;
  height: 35px;
}

.input_username {
  background: #197cdf;
  color: white;
  height: 30.4px;
  width: 200px;
  text-align: center;

  box-sizing: border-box;
  border-radius: 32px;
  border: 0;
  padding: 1em;
}

.input_search {
    padding: .3rem .4rem;
    border-radius: 9999px;
    width: 30.2px;

    font-size: 1rem;
    background: #197cdf;
    border: unset;
    margin-left: 5px;
}

.input_search:hover {
  cursor: pointer;
}

.input_search span {
  color: white;
  font-size: 1.1rem;
}

.recomandations {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;

  width: 95%;
  margin: auto;
}

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

.lds-spinner {
  color: official;
  display: inline-block;
  position: fixed;
  width: 80px;
  height: 80px;
  z-index: 99;

  left: 50%;
  top: 50%;

  background-color: #23272A;
}
.lds-spinner div {
  transform-origin: 40px 40px;
  animation: lds-spinner 1.2s linear infinite;
}
.lds-spinner div:after {
  content: " ";
  display: block;
  position: absolute;
  top: 3px;
  left: 37px;
  width: 6px;
  height: 18px;
  border-radius: 20%;
  background: #fff;
}
.lds-spinner div:nth-child(1) {
  transform: rotate(0deg);
  animation-delay: -1.1s;
}
.lds-spinner div:nth-child(2) {
  transform: rotate(30deg);
  animation-delay: -1s;
}
.lds-spinner div:nth-child(3) {
  transform: rotate(60deg);
  animation-delay: -0.9s;
}
.lds-spinner div:nth-child(4) {
  transform: rotate(90deg);
  animation-delay: -0.8s;
}
.lds-spinner div:nth-child(5) {
  transform: rotate(120deg);
  animation-delay: -0.7s;
}
.lds-spinner div:nth-child(6) {
  transform: rotate(150deg);
  animation-delay: -0.6s;
}
.lds-spinner div:nth-child(7) {
  transform: rotate(180deg);
  animation-delay: -0.5s;
}
.lds-spinner div:nth-child(8) {
  transform: rotate(210deg);
  animation-delay: -0.4s;
}
.lds-spinner div:nth-child(9) {
  transform: rotate(240deg);
  animation-delay: -0.3s;
}
.lds-spinner div:nth-child(10) {
  transform: rotate(270deg);
  animation-delay: -0.2s;
}
.lds-spinner div:nth-child(11) {
  transform: rotate(300deg);
  animation-delay: -0.1s;
}
.lds-spinner div:nth-child(12) {
  transform: rotate(330deg);
  animation-delay: 0s;
}
@keyframes lds-spinner {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}


</style>