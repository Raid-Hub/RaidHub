if $APP_ENV == "staging"; then
    # Staging
    export APP_VERSION=$(date '+%Y%m%d')-$VERCEL_GIT_COMMIT_SHA
    export DEPLOY_URL="https://staging.raidhub.io"

    printenv

    bun prisma generate
    bun next build
fi