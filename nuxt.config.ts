import pkg from './package.json'

export default defineNuxtConfig({
    runtimeConfig: {
        version: pkg.version,
        public: {
            version: pkg.version
        }
    },
    app: {
        head: {
            link: [
                {rel: 'stylesheet', href: "https://fonts.googleapis.com/icon?family=Material+Icons"}
            ]
        }
    }
})
