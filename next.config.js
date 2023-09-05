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
        remotePatterns: [
            /** Only optimize images from our cdn */
            {
                protocol: "https",
                hostname: "cdn.discordapp.com",
                pathname: "/attachments/1136751502912934060/*/*.*"
            }
        ]
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
