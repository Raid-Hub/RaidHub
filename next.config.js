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
            "raidhub.s3.amazonaws.com",
            "raidhub-staging.s3.amazonaws.com",
            "raidhub-app.s3.amazonaws.com",
            "cdn.discordapp.com/attachments/1136751502912934060",
            "www.speedrun.com/userasset"
        ],
        unoptimized: true
    },
    i18n: {
        locales,
        defaultLocale: "en"
    }
}

const withBundleAnalyzer = require("@next/bundle-analyzer")({
    enabled: process.env.ANALYZE === "true"
})

module.exports = process.env.APP_ENV === "local" ? withBundleAnalyzer(nextConfig) : nextConfig
