#!/bin/bash

# Vercel Deployment Script
echo "🚀 Starting Vercel deployment..."

# Clean previous builds
echo "🧹 Cleaning previous builds..."
rm -rf dist/
rm -rf .angular/

# Install dependencies
echo "📦 Installing dependencies..."
npm ci

# Build for production
echo "🔨 Building for production..."
npm run build:prod

# Check if build was successful
if [ ! -d "dist/frontend/browser" ]; then
    echo "❌ Build failed - dist/frontend/browser not found"
    exit 1
fi

echo "✅ Build successful!"

# Deploy to Vercel
echo "🚀 Deploying to Vercel..."
npx vercel --prod

echo "🎉 Deployment complete!"
echo "📊 Bundle size: $(du -sh dist/frontend/browser | cut -f1)"
echo "📁 Output directory: dist/frontend/browser"
