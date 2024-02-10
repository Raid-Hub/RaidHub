declare global {
    namespace NodeJS {
        interface ProcessEnv {
            NODE_ENV: "development" | "production"
            APP_ENV: "local" | "production" | "development" | "test" | "staging"

            BUNGIE_API_KEY: string
            BUNGIE_CLIENT_ID: string
            BUNGIE_CLIENT_SECRET: string

            RAIDHUB_API_URL?: string
            RAIDHUB_API_KEY: string
            RAIDHUB_CLIENT_SECRET?: string

            AWS_S3_ACCESS_KEY_ID?: string
            AWS_S3_SECRET_ACCESS_KEY?: string
            AWS_S3_BUCKET_NAME?: string
            AWS_S3_REGION?: string

            DISCORD_CLIENT_ID?: string
            DISCORD_CLIENT_SECRET?: string

            TWITCH_CLIENT_ID?: string
            TWITCH_CLIENT_SECRET?: string

            TWITTER_CLIENT_ID?: string
            TWITTER_CLIENT_SECRET?: string

            GOOGLE_CLIENT_ID?: string
            GOOGLE_CLIENT_SECRET?: string

            MYSQL_DATABASE: string
            MYSQL_ROOT_PASSWORD: string
            MYSQL_PORT: "8080"
            DATABASE_URL: "mysql://root:xxxxxxxxxxxxxxxxxxxxxx@xxxxxxxxx:${MYSQL_PORT}/${MYSQL_DATABASE}?schema=public"
            NEXTAUTH_URL: "https://localhost:3000"
            NEXTAUTH_SECRET: string
        }
    }
}
// Path: src/types/overrides.d.ts
