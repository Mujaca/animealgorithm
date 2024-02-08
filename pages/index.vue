<template>
    <div class="index-container" v-if="!load">
        <main>
            <h1>Anime recommandations</h1>
            <h2>Get anime recommendations generated based on your anilist</h2>
            <div class="username-input">
                <input v-model="username" placeholder="Enter your username here" type="search">
                <button class="confirm-btn" @click="pushToPage()"> <span class="material-icons"> arrow_forward_ios
                    </span> </button>
            </div>
        </main>
    </div>
    <div class="spinner" v-else>
        <div class="lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
    </div>
</template>

<script setup lang="ts">
const router = useRouter()
const username = ref("")
const load = ref(false)

function confirmEvent(event: KeyboardEvent) {
    if (event?.key != "Enter") return;

    pushToPage();

    router.push({ path: '/recommandations/' + username.value })
}

function pushToPage() {
    if (username.value == "") return;

    load.value = true;
    nextTick(() => {
        router.push({ path: '/recommandations/' + username.value })
    })
}

onMounted(() => {
    window.addEventListener('keypress', confirmEvent)
})

/**beforeUnmount(() => {
    window.removeEventListener('keypress', confirmEvent)
})**/
</script>

<style lang="scss" scoped>
.index-container {
    height: 98vh;
    display: grid;
    place-items: center;

    main {
        text-align: center;

        h1,
        h2 {
            font-weight: 500;
        }

        h1 {
            font-size: 3rem;
            margin-bottom: .2rem;
        }

        h2 {
            font-size: 1.5rem;
            margin-top: .1rem;
        }

        .username-input {
            display: flex;
            flex-direction: row;

            input {
                width: calc(100% - 3rem);
                border: none;
                border-top-left-radius: 12px;
                border-bottom-left-radius: 12px;
                padding: 11px;
                background-color: #008080;
                color: white;
                font-size: 14px;

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

            .confirm-btn {
                width: 3rem;
                border: none;
                border-top-right-radius: 12px;
                border-bottom-right-radius: 12px;
                background-color: #008080;
                border-left: 1px solid white;

                .material-icons {
                    color: white;
                }

                &:hover {
                    background-color: #66b2b2;
                    cursor: pointer;
                }

                &:focus-visible {
                    outline: none;
                    background-color: #66b2b2;
                }

                &:focus {
                    background-color: #66b2b2;
                    outline: none;
                }
            }
        }
    }
}

@media screen and (max-width:720px) {
    .index-container {

        main {
            max-width: 100%;

            h1 {
                font-size: 2rem;
                margin-bottom: .2rem;
            }

            h2 {
                font-size: 1.3rem;
                margin-top: .1rem;
            }
        }
    }
}

.spinner {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}

.lds-roller {
    display: inline-block;
    position: relative;
    width: 80px;
    height: 80px;
}

.lds-roller div {
    animation: lds-roller 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
    transform-origin: 40px 40px;
}

.lds-roller div:after {
    content: " ";
    display: block;
    position: absolute;
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: #fff;
    margin: -4px 0 0 -4px;
}

.lds-roller div:nth-child(1) {
    animation-delay: -0.036s;
}

.lds-roller div:nth-child(1):after {
    top: 63px;
    left: 63px;
}

.lds-roller div:nth-child(2) {
    animation-delay: -0.072s;
}

.lds-roller div:nth-child(2):after {
    top: 68px;
    left: 56px;
}

.lds-roller div:nth-child(3) {
    animation-delay: -0.108s;
}

.lds-roller div:nth-child(3):after {
    top: 71px;
    left: 48px;
}

.lds-roller div:nth-child(4) {
    animation-delay: -0.144s;
}

.lds-roller div:nth-child(4):after {
    top: 72px;
    left: 40px;
}

.lds-roller div:nth-child(5) {
    animation-delay: -0.18s;
}

.lds-roller div:nth-child(5):after {
    top: 71px;
    left: 32px;
}

.lds-roller div:nth-child(6) {
    animation-delay: -0.216s;
}

.lds-roller div:nth-child(6):after {
    top: 68px;
    left: 24px;
}

.lds-roller div:nth-child(7) {
    animation-delay: -0.252s;
}

.lds-roller div:nth-child(7):after {
    top: 63px;
    left: 17px;
}

.lds-roller div:nth-child(8) {
    animation-delay: -0.288s;
}

.lds-roller div:nth-child(8):after {
    top: 56px;
    left: 12px;
}

@keyframes lds-roller {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}</style>