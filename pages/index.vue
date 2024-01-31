<template>
    <div class="index-container">
        <main>    
            <h1>Anilist recommandations</h1>
            <h2>Get anime recommendations generated based on your anilist</h2>
            <div class="username-input">
                <input v-model="username" placeholder="Enter your username here">
                <button class="confirm-btn" @click="confirmButton()"> <span class="material-icons"> arrow_forward_ios </span> </button>
            </div>
        </main>
    </div>
</template>

<script setup lang="ts">
const router = useRouter()
const username = ref("")

function confirmEvent(event:KeyboardEvent) {
    if(event?.key != "Enter" || username.value == "") return;

    router.push({path: '/recommandations/' + username.value})
}

function confirmButton() {
    if(username.value == "") return;
    router.push({path: '/recommandations/' + username.value})
}

onMounted(() => {
    window.addEventListener('keypress', confirmEvent)
})

/**beforeUnmount(() => {
    window.removeEventListener('keypress', confirmEvent)
})**/
</script>

<style lang="scss">
.index-container {
    height: 98vh;
    display: grid;
    place-items: center;

    main {
        text-align: center;

        h1, h2 {
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
                background-color:#008080;
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
</style>