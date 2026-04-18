#!/bin/sh
set -e

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  Glamour Makeup Store"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

echo ""
echo "→ Pushing database schema..."
npm run db:push

echo ""
echo "→ Seeding database..."
npm run db:seed

echo ""
echo "→ Starting Next.js dev server..."
exec npm run dev
