#!/usr/bin/env bash
# scripts/integration.sh

echo "========================================="
echo "             INTEGRATION TESTS             "
echo "========================================="

DIR="$(cd "$(dirname "$0")" && pwd)"
source $DIR/setenv.sh

docker compose up -d
echo '🟡 - Waiting for database to be ready...'
$DIR/wait-for-it.sh "${DATABASE_URL}" -- echo '🟢 - Database is ready!'
npx prisma migrate dev --name init

REDIS_URL="${REDIS_URL}" vitest -c ./vitest.config.integration.ts --run
