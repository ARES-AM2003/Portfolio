#!/bin/sh
set -e

echo "🚀 Starting Portfolio App..."

# Run Prisma migrations using local prisma
echo "📦 Running database migrations..."
npx prisma db push --skip-generate --accept-data-loss

# Check if migration was successful
if [ $? -eq 0 ]; then
  echo "✅ Database migrations completed successfully"
else
  echo "❌ Database migration failed"
  exit 1
fi

# Start the Next.js application
echo "🌐 Starting Next.js server..."
exec node server.js
