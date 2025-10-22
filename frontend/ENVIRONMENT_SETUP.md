# Environment Configuration

This project uses Angular environment files to manage different configurations for development and production.

## Environment Files

- `src/environments/environment.ts` - Development environment
- `src/environments/environment.prod.ts` - Production environment

## Configuration

### Development Environment
- **API URL**: `http://localhost:4000`
- Used when running `ng serve` or `ng build` (default)

### Production Environment  
- **API URL**: `https://taskb-livid.vercel.app`
- Used when running `ng build --configuration production`

## Usage

### Development
```bash
npm start
# or
ng serve
```

### Production Build
```bash
npm run build:prod
# or
ng build --configuration production
```

## Services Updated

The following services now use environment variables instead of hardcoded URLs:

- `ApiService` - Main API service for HTTP requests
- `AuthService` - Authentication service
- Test files - Updated to use environment variables

## Benefits

1. **Environment-specific URLs**: Different backend URLs for dev/prod
2. **Easy deployment**: No need to manually change URLs when deploying
3. **Maintainable**: Single source of truth for API configuration
4. **Secure**: Production URLs are not exposed in development code
