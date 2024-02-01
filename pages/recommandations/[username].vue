<template>
    <div>
        <nav>
            <button class="home-button" @click="goBack"> <span class="material-icons"> home </span> </button>
            <input :value="username" class="username-input" readonly placeholder="Anilist Username">
        </nav>
        <div>
            <div class="anime-container" v-for="(animeArray, i) in fetchedAnimes">
                <span class="anime-loader"></span>
                <Anime class="anime-component" v-for="(anime, index) in animeArray" :show="anime" :index="(index + 1) + (animeArray.length * (i))" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
const route = useRoute()
const router = useRouter()
const username = route.params.username
const page = ref(0)
const fetchedAnimes: Ref<any[]> = ref([]);

const { data: animes, refresh } = await useFetch(() => `/api/recommendation?user=${username}&limit=20&page=${page.value}`);
refreshNuxtData();
fetchedAnimes.value.push(animes.value)

async function loadMoreAnime() {
    page.value = page.value + 1;
    console.log(page.value)
    nextTick(async () => {
        await refresh();
        fetchedAnimes.value.push(animes.value)
    })
}


function goBack() {
    router.push('/')
}

function checkVisible(elm: HTMLElement, threshold: number = 0, mode: string = 'visible') {
    const rect = elm.getBoundingClientRect();
    const viewHeight = Math.max(document.documentElement.clientHeight, window.innerHeight);
    const above = rect.bottom - threshold < 0;
    const below = rect.top - viewHeight + threshold >= 0;

    return mode === 'above' ? above : (mode === 'below' ? below : !above && !below);
}

function onScroll(event:Event) {
    const spans = document.querySelectorAll('.anime-loader');
    const span = spans[spans.length - 1] as HTMLElement;
    if(!span) return;
    
    const isVisible = checkVisible(span, 15);
    if(isVisible) {
        span.remove();
        loadMoreAnime();
    } 
}

onMounted(() => {
    document.addEventListener('scroll', onScroll);
})

onBeforeMount(() => {
    document.removeEventListener('scroll', onScroll)
})


</script>

<style lang="scss">
nav {
    position: relative;
    display: flex;
    margin-bottom: 4px;

    .home-button {
        position: absolute;
        left: 4px;
        border: none;
        background-color: transparent;
        border-radius: 9999px;

        &:hover {
            background-color: rgba(255, 255, 255, 0.3);
            cursor: pointer;
        }

        span {
            font-size: 2.3rem;
            color: white;
        }
    }

    .username-input {
        margin-left: auto;
        margin-right: auto;

        border: none;
        border-radius: 12px;
        padding: 11px;
        background-color: #006666;
        color: white;
        font-size: 14px;
        text-align: center;

        &:hover {
            cursor: default;
        }

        &::placeholder {
            color: white;
            font-size: 14px;
        }

        &:focus-visible {
            outline: none;
        }

        &:focus {
            outline: none;
        }
    }
}

.anime-container {
    padding: 4px;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    gap: 4px;

    .anime-component {
        margin-top: 4px;
        margin-bottom: 4px;
    }

    .anime-loader {
        height: 1px;
        width: 100%;
    }
}
</style>