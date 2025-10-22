# Vercel Deployment Guide

## 🚀 Quick Deployment to Vercel

### Option 1: Deploy from GitHub (Recommended)

1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Optimized Angular app for production"
   git push origin main
   ```

2. **Connect to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will auto-detect Angular and use the `vercel.json` config

### Option 2: Deploy with Vercel CLI

1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Deploy**:
   ```bash
   cd frontend
   vercel --prod
   ```

## 🔧 Configuration Files

### vercel.json
```json
{
  "version": 2,
  "builds": [
    {
      "src": "dist/frontend/browser/**",
      "use": "@vercel/static"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/dist/frontend/browser/$1"
    },
    {
      "src": "/",
      "dest": "/dist/frontend/browser/index.html"
    }
  ],
  "outputDirectory": "dist/frontend/browser",
  "installCommand": "npm install",
  "buildCommand": "npm run build:prod",
  "framework": "angular"
}
```

## 📊 Build Output Structure

After optimization, Angular outputs to:
```
dist/frontend/browser/
├── index.html
├── main-*.js
├── polyfills-*.js
├── styles-*.css
├── chunk-*.js (lazy loaded)
└── assets/
```

## 🎯 Environment Variables

Set these in Vercel dashboard:

### Frontend Environment Variables
```
NODE_ENV=production
```

### Backend Environment Variables (if deploying backend too)
```
DATABASE_URL=your_postgresql_url
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=1h
REDIS_URL=your_redis_url
PORT=4000
NODE_ENV=production
```

## 🚀 Deployment Commands

### Build for Production
```bash
npm run build:prod
```

### Build with Analysis
```bash
npm run build:analyze
```

### Test Locally
```bash
npm start
```

## 📈 Performance Optimizations Applied

✅ **Bundle Size**: 306.33 kB (under 500 kB budget)
✅ **Lazy Loading**: Components load on-demand
✅ **CDN Bootstrap**: External CSS/JS from CDN
✅ **Critical CSS**: Inline critical styles
✅ **Font Optimization**: Inline fonts
✅ **Code Splitting**: Smart chunk splitting

## 🔍 Troubleshooting

### Common Issues

1. **404 Error**: 
   - Check `vercel.json` routes configuration
   - Ensure `outputDirectory` points to `dist/frontend/browser`

2. **Build Fails**:
   - Check Node.js version (18+ required)
   - Run `npm install` first
   - Check for TypeScript errors

3. **Assets Not Loading**:
   - Verify asset paths in `angular.json`
   - Check CDN links in `index.html`

### Build Commands

```bash
# Clean install
rm -rf node_modules package-lock.json
npm install

# Build
npm run build:prod

# Test locally
npx serve dist/frontend/browser
```

## 📱 PWA Features

The app includes:
- ✅ Service Worker (when enabled)
- ✅ Web App Manifest
- ✅ Offline capabilities
- ✅ Mobile optimization

## 🎉 Success Metrics

After deployment, you should see:
- **Bundle Size**: ~306 kB (47% smaller than original)
- **Load Time**: Significantly faster
- **Lighthouse Score**: 90+ for Performance
- **Core Web Vitals**: All green

## 🔗 Useful Links

- [Vercel Documentation](https://vercel.com/docs)
- [Angular Deployment Guide](https://angular.dev/guide/deployment)
- [Performance Optimization Guide](./PERFORMANCE_OPTIMIZATION.md)
