import { defineNuxtConfig } from 'nuxt'

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
    app: {
        head: {
            link: [
                {rel: 'stylesheet', href: "https://fonts.googleapis.com/icon?family=Material+Icons"}
            ]
        }
    }
})
