// eslint-disable-next-line @typescript-eslint/no-var-requires
const withBundleAnalyzer = require("@next/bundle-analyzer")({
    enabled: process.env.ANALYZE === "true"
})

module.exports = withBundleAnalyzer({
    experimental: {
        ppr: true
    },
    reactStrictMode: false,
    compiler: {
        styledComponents: true
    },
    env: {
        APP_ENV: process.env.APP_ENV,
        APP_VERSION: process.env.APP_VERSION,
        BUNGIE_API_KEY: process.env.BUNGIE_API_KEY,
        RAIDHUB_API_URL: process.env.RAIDHUB_API_URL ?? "https://api.raidhub.io",
        RAIDHUB_API_KEY: process.env.RAIDHUB_API_KEY
    },
    images: {
        remotePatterns: [
            /** Only optimize images from our cdn */
            {
                protocol: "https",
                hostname: "cdn.raidhub.io"
            }
        ]
    },
    redirects: async () => {
        return [
            {
                source: "/profile/:membershipType/:destinyMembershipId",
                destination: "/profile/:destinyMembershipId",
                permanent: true
            }
        ]
    },
    rewrites: () => [
        {
            source: "/:vanity([a-zA-Z0-9]+)",
            destination: "/user/:vanity"
        }
    ]
})
