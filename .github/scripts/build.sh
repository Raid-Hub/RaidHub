# Staging
export APP_VERSION=$(date '+%Y%m%d')-$(git rev-parse --short HEAD)
export DEPLOY_URL="https://staging.raidhub.io"

printenv

bun prisma generate
bun next build