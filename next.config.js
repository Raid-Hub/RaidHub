/** @type {import('./src/util/presentation/localized-strings').SupportedLanguage[]} */
const locales = ["en"]

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    env: {
        BUNGIE_API_KEY: process.env.BUNGIE_API_KEY,
        APP_ENV: process.env.APP_ENV
    },
    images: {
        domains: [
            "bungie.net",
            "www.bungie.net",
            "cdn.discordapp.com",
            "raidhub-app.s3.amazonaws.com"
        ]
    },
    i18n: {
        locales,
        defaultLocale: "en"
    }
}

module.exports = nextConfig
