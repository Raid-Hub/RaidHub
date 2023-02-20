/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    domains: ["lh3.googleusercontent.com"],
  },
  compiler: {
    styledComponents: true,
  },
  env: {
    BUNGIE_API_KEY: process.env.BUNGIE_API_KEY,
    BUNGIE_CLIENT_ID: process.env.BUNGIE_CLIENT_ID,
    BUNGIE_CLIENT_SECRET: process.env.BUNGIE_CLIENT_SECRET,
  },
};

module.exports = nextConfig;
