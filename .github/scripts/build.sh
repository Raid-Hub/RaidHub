if [ "$VERCEL_GIT_COMMIT_REF" = "test" ] && [ "$VERCEL_ENV" = "preview" ]; then
    # Staging
    export APP_VERSION=$(date '+%Y%m%d')-$VERCEL_GIT_COMMIT_SHA
    export DEPLOY_URL="https://staging.raidhub.io"

    bun prisma generate
    bun next build
fi