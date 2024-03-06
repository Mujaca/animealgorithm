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
                <button class="close-button" @click="regenerate"><span class="material-icons"> refresh
                    </span></button>
            </div>

            <div class="settings-area">
                <div class="settings-section">
                    <select v-model="algorithm">
                        <option selected value="new">New Algorithm (faster)</option>
                        <option value="old">Old Algorithm (slower)</option>
                    </select>
                    <div class="checkboxes">
                        <div>
                            <input v-model="showPlanned" type="checkbox">
                            <span>Show Planning</span>
                        </div>

                        <div>
                            <input v-model="showDropped" type="checkbox">
                            <span>Show Dropped</span>
                        </div>
                    </div>
                </div>
                <div class="settings-section">
                    <div>
                        <input v-model="keyWordCount" type="number">
                        <span>How often should a Keyword be present to be considered?</span>
                    </div>
                </div>
                <div class="settings-section">
                    <div class="genres-container">
                        <div class="genre-chip" v-for="tag in tags" @click="tagChipClick($event, tag)"> {{ tag }}
                        </div>
                    </div>
                </div>
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

const algorithm: Ref<String> = ref("new");
    const reload: Ref<boolean> = ref(false)
const selectedGenres: Ref<string[]> = ref([]);
const disabledGenres: Ref<string[]> = ref([]);
const selectedTags: Ref<string[]> = ref([]);
const disabledTags: Ref<string[]> = ref([]);
const keyWordCount: Ref<number> = ref(30);
const showPlanned: Ref<boolean> = ref(false);
const showDropped: Ref<boolean> = ref(false);

const { data: animes, refresh } = await useFetch(() => `/api/recommendation?user=${username}&limit=20
&page=${page.value}
&algorithm=${algorithm.value}
&keywords=${keyWordCount.value}
&showPlanned=${showPlanned.value}
&showDropped=${showDropped.value}
${selectedGenres.value.length > 0 ? '&include_genres=' + selectedGenres.value.join(';') : ''}
${disabledGenres.value.length > 0 ? '&excluded_genres=' + disabledGenres.value.join(';') : ''}
${selectedTags.value.length > 0 ? '&include_tags=' + selectedTags.value.join(';') : ''}
${disabledTags.value.length > 0 ? '&excluded_tags=' + disabledTags.value.join(';') : ''}
${reload.value ? '&regenerate=1' : ''}
`);
const { data: genres } = await useFetch<string[]>('/api/genres');
const { data: tags } = await useFetch<string[]>('/api/tags');
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

    if (isEnabled) selectedGenres.value.splice(selectedGenres.value.indexOf(genre), 1);
    if (isDisabled) disabledGenres.value.splice(disabledGenres.value.indexOf(genre), 1);
    target.classList.remove('active')
    target.classList.remove('disabled')
    return refreshAnimes()
}

async function tagChipClick(event: MouseEvent, genre: string) {
    const target = event.target as HTMLDivElement
    const doubleClicked = event.detail == 2;
    const isDisabled = disabledTags.value.includes(genre);
    const isEnabled = selectedTags.value.includes(genre);

    if (doubleClicked) {
        if (!isDisabled) {
            selectedTags.value.splice(selectedTags.value.indexOf(genre), 1);
            disabledTags.value.push(genre);
            target.classList.add('disabled')
            target.classList.remove('active')
            return refreshAnimes();
        }
    }

    if (!isEnabled && !isDisabled) {
        selectedTags.value.push(genre);
        target.classList.add('active');
        return refreshAnimes()
    }

    if (isEnabled) selectedTags.value.splice(selectedTags.value.indexOf(genre), 1);
    if (isDisabled) disabledTags.value.splice(disabledTags.value.indexOf(genre), 1);
    target.classList.remove('active')
    target.classList.remove('disabled')
    return refreshAnimes()
}



let refreshTimer: any;
function refreshAnimes() {
    if (refreshTimer) {
        clearTimeout(refreshTimer);
        refreshTimer = null;
    }

    refreshTimer = setTimeout(() => {
        fetchedAnimes.value = [];
        page.value = 0;
        nextTick(async () => {
            await refresh();
            reload.value = false;
            fetchedAnimes.value.push(animes.value)
        })
    }, 200);

}

function regenerate() {
    reload.value = true;
    refreshAnimes();
    showSettings.value = false;
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
    overflow-y: auto;

    .header {
        display: flex;
        align-items: center;

        p {
            margin-left: auto;
            margin-right: auto;
            text-align: center;
            font-weight: bold;
            font-size: 1.3rem;
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

    .settings-area {
        .settings-section {
            position: relative;
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;

            align-items: center;
            justify-content: space-between;
            padding: 24px;

            &:not(:last-child)::after {
                width: 95%;
                border-bottom: 1px solid white;
                opacity: .5;
                position: absolute;
                bottom: 0;
                left: 50%;
                transform: translate(-50%, -50%);
                content: '';
            }
        }

        .checkboxes {
            display: flex;
            flex-direction: column;

            span {
                font-size: 1rem;
            }
        }

        input[type='checkbox'] {
            width: 1.2rem;
            height: 1.2rem;
            margin: 4px;
            accent-color: #006666;

            &:checked {
                color: #004242;
            }
        }

        input[type='number'] {
            border: none;
            background-color: #006666;
            border-radius: 24px;
            -moz-appearance: textfield;
            padding: 6px 8px;
            color: white;
            margin: 4px;
            margin-left: 0;

            &::-webkit-outer-spin-button,
            &::-webkit-inner-spin-button {
                -webkit-appearance: none;
                margin: 0;
            }

            &:focus {
                outline: none;
            }

            &:focus-visible {
                outline: none;
            }
        }

        select {
            border: none;
            background-color: #006666;
            color: white;
            padding: 12px;
            border-radius: 24px;
            font-size: 0.9rem;
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