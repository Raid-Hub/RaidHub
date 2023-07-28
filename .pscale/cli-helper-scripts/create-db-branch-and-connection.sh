#!/bin/bash

. use-pscale-docker-image.sh
. wait-for-branch-readiness.sh

. authenticate-ps.sh

BRANCH_NAME="$1"

. set-db-and-org-and-branch-name.sh

. ps-create-helper-functions.sh
if [[ $HAS_SCHEMA_CHANGES == true ]] ; then
    create-db-branch "$DB_NAME" "$BRANCH_NAME" "$ORG_NAME" "recreate"
fi


. create-branch-connection-string.sh
create-branch-connection-string "$DB_NAME" "$BRANCH_NAME" "$ORG_NAME" "creds-${BRANCH_NAME}"
. ps-create-helper-functions.sh

if [[ $HAS_SCHEMA_CHANGES == true ]] ; then
    create-deploy-request "$DB_NAME" "$BRANCH_NAME" "$ORG_NAME"
fi