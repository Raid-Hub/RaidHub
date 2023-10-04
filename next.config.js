/** @type {import('./src/util/presentation/localized-strings').SupportedLanguage[]} */
const locales = ["en"]

const cloudflareHost = "85AvSk7Z9-QdHfmk4t5dsw"

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
                hostname: "cdn.raidhub.app",
                pathname: `/cdn-cgi/imagedelivery/${cloudflareHost}/*`
            },
            {
                protocol: "https",
                hostname: "imagedelivery.net",
                pathname: `/${cloudflareHost}/*`
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
