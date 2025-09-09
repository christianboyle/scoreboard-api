#!/bin/bash

# Docker startup script for scoreboard-api

echo "🚀 Starting Scoreboard API Docker Container..."

# Check if we should use dev or production mode
if [ "$1" = "dev" ]; then
    echo "📋 Starting in DEVELOPMENT mode (port 4000)..."
    docker-compose -f docker-compose.dev.yml up --build -d
    PORT="4000"
else
    echo "🏭 Starting in PRODUCTION mode (port 7777)..."
    docker-compose up --build -d
    PORT="7777"
fi

echo "✅ Scoreboard API is running at http://localhost:$PORT"
echo "📊 Test the API:"
echo "   curl http://localhost:$PORT/api/v1/sports/mlb/events"
echo ""
echo "🔧 To stop the service, run:"
if [ "$1" = "dev" ]; then
    echo "   docker-compose -f docker-compose.dev.yml down"
else
    echo "   docker-compose down"
fi
echo ""
echo "💡 Usage: ./scripts/docker-start.sh [dev]"
echo "   - No argument: Production mode (port 7777)"
echo "   - 'dev' argument: Development mode (port 4000)"