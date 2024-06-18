if [ "$VERCEL_GIT_COMMIT_REF" = "main" ] && [ "$VERCEL_ENV" = "preview" ]; then
    echo "Building STAGING"

    export APP_ENV="staging"
    export APP_VERSION=$(date '+%Y%m%d')-$VERCEL_GIT_COMMIT_SHA
    export DEPLOY_URL="https://staging.raidhub.io"

    bun prisma generate
    bun next build

elif [ "$VERCEL_ENV" = "preview" ]; then
    echo "Building PREVIEW"
    
    export APP_VERSION=$(date '+%Y%m%d')-$VERCEL_GIT_COMMIT_SHA

    bun prisma generate
    bun next build

elif [ "$VERCEL_ENV" = "production" ]; then
    echo "Building PRODUCTION"

    bun prisma generate
    bun next build
fi