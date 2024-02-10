const withBundleAnalyzer = require("@next/bundle-analyzer")({
    enabled: process.env.ANALYZE === "true"
})

const cloudflareHost = "85AvSk7Z9-QdHfmk4t5dsw"

module.exports = withBundleAnalyzer({
    experimental: {
        ppr: true
    },
    reactStrictMode: false,
    compiler: {
        styledComponents: true
    },
    env: {
        BUNGIE_API_KEY: process.env.BUNGIE_API_KEY,
        APP_ENV: process.env.APP_ENV,
        RAIDHUB_API_URL: process.env.RAIDHUB_API_URL ?? "https://api.raidhub.io",
        RAIDHUB_API_KEY:
            process.env.RAIDHUB_API_KEY ??
            Array.from({ length: 32 }, () => Math.random().toString(36)[2]).join("")
    },
    images: {
        remotePatterns: [
            /** Only optimize images from our cdn */
            {
                protocol: "https",
                hostname: "cdn.raidhub.io",
                pathname: `/cdn-cgi/imagedelivery/${cloudflareHost}/*`
            }
        ]
    }
})
