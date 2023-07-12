/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    env: {
        BUNGIE_API_KEY: process.env.BUNGIE_API_KEY
    },
    images: {
        domains: ["bungie.net"]
    }
}

module.exports = nextConfig
