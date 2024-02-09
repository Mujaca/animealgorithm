<template>
    <div>
        <nav>
            <button class="home-button" @click="goBack"> <span class="material-icons"> home </span> </button>
            <input :value="username" class="username-input" readonly placeholder="Anilist Username">
            <button class="home-button" @click="showSettings = !showSettings"> <span class="material-icons"> settings
                </span> </button>
        </nav>
        <div class="settings-underlay" v-if="showSettings" @click="showSettings = false"></div>
        <div class="settings-container" v-if="showSettings">
            <div class="header">
                <button class="close-button" @click="showSettings = false"><span class="material-icons">
                        close</span></button>
                <p> Einstellungen </p>
                <button class="close-button" @click="showSettings = false"><span class="material-icons"> refresh
                    </span></button>
            </div>

            <div class="settings-area">
                Coming soon ... <br>
                maybe ... <br>
                some day ... <br>
                in 3-5 buisness days
            </div>
        </div>
        <div class="genres-container">
            <div class="genre-chip" v-for="genre in genres" @click="genreChipClick($event, genre)"> {{ genre }}</div>
        </div>
        <div>
            <div class="anime-container" v-for="(animeArray, i) in fetchedAnimes">
                <span class="anime-loader"></span>
                <Anime class="anime-component" v-for="(anime, index) in animeArray" :show="anime"
                    :index="(index + 1) + (animeArray.length * (i))" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
const route = useRoute()
const router = useRouter()

const showSettings = ref(false);

const username = route.params.username
const page = ref(0)
const fetchedAnimes: Ref<any[]> = ref([]);

const selectedGenres: Ref<string[]> = ref([]);
const disabledGenres: Ref<string[]> = ref([]);

const { data: animes, refresh } = await useFetch(() => `/api/recommendation?user=${username}&limit=20
&page=${page.value}
${selectedGenres.value.length > 0 ? '&include_genres=' + selectedGenres.value.join(';') : ''}
${disabledGenres.value.length > 0 ? '&excluded_genres=' + disabledGenres.value.join(';') : ''}
`);
const { data: genres } = await useFetch<string[]>('/api/genres');
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

function onScroll(event: Event) {
    const spans = document.querySelectorAll('.anime-loader');
    const span = spans[spans.length - 1] as HTMLElement;
    if (!span) return;

    const isVisible = checkVisible(span, 15);
    if (isVisible) {
        span.remove();
        loadMoreAnime();
    }
}

async function genreChipClick(event: MouseEvent, genre: string) {
    const target = event.target as HTMLDivElement
    const doubleClicked = event.detail == 2;
    const isDisabled = disabledGenres.value.includes(genre);
    const isEnabled = selectedGenres.value.includes(genre);

    if (doubleClicked) {
        if (!isDisabled) {
            selectedGenres.value.splice(selectedGenres.value.indexOf(genre), 1);
            disabledGenres.value.push(genre);
            target.classList.add('disabled')
            target.classList.remove('active')
            return refreshAnimes();
        }
    }

    if (!isEnabled && !isDisabled) {
        selectedGenres.value.push(genre);
        target.classList.add('active');
        return refreshAnimes()
    }

    if(isEnabled) selectedGenres.value.splice(selectedGenres.value.indexOf(genre), 1);
    if(isDisabled) disabledGenres.value.splice(disabledGenres.value.indexOf(genre), 1);
    target.classList.remove('active')
    target.classList.remove('disabled')
    return refreshAnimes()
}

let refreshTimer:any;
function refreshAnimes() {
    if(refreshTimer) {
        clearTimeout(refreshTimer);
        refreshTimer = null;
    }

    refreshTimer = setTimeout(() => {
        fetchedAnimes.value = [];
        page.value = 0;
        nextTick(async () => {
            await refresh();
            fetchedAnimes.value.push(animes.value)
        })
    }, 200);

}

useHead({
    title: `${username}'s Anime recommandations'`
})

onMounted(() => {
    document.addEventListener('scroll', onScroll);
})

onBeforeMount(() => {
    document.removeEventListener('scroll', onScroll)
})


</script>

<style lang="scss" scoped>
nav {
    display: flex;
    margin-bottom: 8px;
    margin-top: 8px;

    .home-button {
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

.settings-underlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;

    background-color: black;
    opacity: 0.6;
    z-index: 99;
}

.settings-container {
    position: fixed;
    background-color: #23272A;
    z-index: 100;

    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

    border-radius: 16px;
    padding: 8px;

    width: 50%;
    max-height: 80%;

    .header {
        display: flex;
        align-items: center;

        p {
            margin-left: auto;
            margin-right: auto;
            text-align: center;
            font-weight: bold;
        }

        .close-button {
            span {
                font-size: 1.5rem;
            }
        }

        .placeholder {
            width: 37px;
        }
    }


}

.genres-container {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-evenly;
    padding: 4px;
    gap: 1rem;

    .genre-chip {
        background-color: #006666;
        border: 1px solid #006666;
        padding: 8px 10px;
        border-radius: 64px;
        user-select: none;

        &:hover {
            border: 1px solid white;
            cursor: pointer;
        }

        &.active {
            border: 1px solid white;
        }

        &.disabled {
            background-color: #004242;
            border: 1px solid #004242;
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

button {
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
</style>