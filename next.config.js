/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    env: {
        TEST_VAR: process.env.TEST_VAR,
        BUNGIE_API_KEY: process.env.BUNGIE_API_KEY
    },
    images: {
        domains: [
            "bungie.net",
            "www.bungie.net",
            "cdn.discordapp.com",
            "raidhub-app.s3.amazonaws.com"
        ]
    }
}

module.exports = nextConfig
