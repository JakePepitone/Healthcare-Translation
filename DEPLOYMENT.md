# Deployment Guide - Healthcare Translation Assistant

This guide will help you deploy the Healthcare Translation Assistant to Vercel or other platforms.

## 🚀 Vercel Deployment (Recommended)

### Prerequisites
- GitHub account
- Vercel account (free tier available)
- OpenAI API key with credits

### Step 1: Prepare Your Repository

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit: Healthcare Translation Assistant"
   git push origin main
   ```

2. **Ensure your repository includes**:
   - All source code
   - `package.json`
   - `next.config.ts`
   - `.gitignore` (should exclude `.env.local`)

### Step 2: Deploy to Vercel

1. **Go to Vercel**
   - Visit [https://vercel.com](https://vercel.com)
   - Sign in with your GitHub account

2. **Import Project**
   - Click "New Project"
   - Select your GitHub repository
   - Vercel will auto-detect Next.js settings

3. **Configure Environment Variables**
   - In the project settings, go to "Environment Variables"
   - Add: `OPENAI_API_KEY` = `your_openai_api_key_here`
   - Save the configuration

4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete (usually 2-3 minutes)

### Step 3: Verify Deployment

1. **Test the Application**
   - Visit your Vercel URL
   - Test voice recording functionality
   - Verify translation works
   - Check mobile responsiveness

2. **Monitor Logs**
   - Check Vercel function logs for any errors
   - Monitor API usage and costs

## 🌐 Alternative Deployment Options

### Netlify Deployment

1. **Connect to Netlify**
   ```bash
   npm install -g netlify-cli
   netlify login
   ```

2. **Build and Deploy**
   ```bash
   npm run build
   netlify deploy --prod --dir=out
   ```

3. **Set Environment Variables**
   - Go to Netlify dashboard
   - Site settings → Environment variables
   - Add `OPENAI_API_KEY`

### Railway Deployment

1. **Connect Repository**
   - Go to [railway.app](https://railway.app)
   - Connect your GitHub repository

2. **Configure Environment**
   - Add `OPENAI_API_KEY` in Railway dashboard
   - Set build command: `npm run build`
   - Set start command: `npm start`

### AWS Amplify

1. **Connect to AWS Amplify**
   - Go to AWS Amplify Console
   - Connect your GitHub repository

2. **Configure Build Settings**
   ```yaml
   version: 1
   frontend:
     phases:
       preBuild:
         commands:
           - npm install
       build:
         commands:
           - npm run build
     artifacts:
       baseDirectory: .next
       files:
         - '**/*'
   ```

3. **Add Environment Variables**
   - Go to App settings → Environment variables
   - Add `OPENAI_API_KEY`

## 🔧 Environment Configuration

### Required Environment Variables

```bash
# Production
OPENAI_API_KEY=sk-your-actual-api-key-here

# Optional (for development)
NODE_ENV=production
```

### Environment-Specific Settings

#### Development
```bash
# .env.local
OPENAI_API_KEY=your-dev-api-key
NODE_ENV=development
```

#### Production
```bash
# Vercel/Platform environment variables
OPENAI_API_KEY=your-prod-api-key
NODE_ENV=production
```

## 📊 Performance Optimization

### Build Optimization

1. **Enable Compression**
   ```typescript
   // next.config.ts
   const nextConfig = {
     compress: true,
     poweredByHeader: false,
   };
   ```

2. **Optimize Images**
   - Use Next.js Image component
   - Implement proper caching headers

3. **Enable Caching**
   ```typescript
   // next.config.ts
   const nextConfig = {
     async headers() {
       return [
         {
           source: '/api/:path*',
           headers: [
             {
               key: 'Cache-Control',
               value: 'public, max-age=3600, s-maxage=3600',
             },
           ],
         },
       ];
     },
   };
   ```

## 🔒 Security Considerations

### Production Security

1. **API Key Security**
   - Never commit API keys to version control
   - Use environment variables in production
   - Rotate API keys regularly

2. **Rate Limiting**
   - Implement proper rate limiting
   - Monitor API usage
   - Set up alerts for unusual activity

3. **CORS Configuration**
   ```typescript
   // next.config.ts
   const nextConfig = {
     async headers() {
       return [
         {
           source: '/api/:path*',
           headers: [
             {
               key: 'Access-Control-Allow-Origin',
               value: 'https://yourdomain.com',
             },
           ],
         },
       ];
     },
   };
   ```

## 📈 Monitoring and Analytics

### Vercel Analytics

1. **Enable Vercel Analytics**
   - Go to project settings
   - Enable "Analytics"
   - Monitor performance metrics

2. **Custom Monitoring**
   ```typescript
   // Add to your API routes
   console.log('API call:', {
     endpoint: '/api/Translate',
     timestamp: new Date().toISOString(),
     userAgent: req.headers['user-agent'],
   });
   ```

### Error Tracking

1. **Sentry Integration**
   ```bash
   npm install @sentry/nextjs
   ```

2. **Configure Sentry**
   ```typescript
   // sentry.client.config.ts
   import * as Sentry from "@sentry/nextjs";

   Sentry.init({
     dsn: "your-sentry-dsn",
     environment: process.env.NODE_ENV,
   });
   ```

## 🚨 Troubleshooting Deployment

### Common Issues

1. **Build Failures**
   ```bash
   # Check build locally
   npm run build
   
   # Check for TypeScript errors
   npx tsc --noEmit
   ```

2. **Environment Variables**
   - Verify variables are set in deployment platform
   - Check variable names match exactly
   - Ensure no extra spaces or quotes

3. **API Key Issues**
   - Verify API key has sufficient credits
   - Check API key permissions
   - Test API key locally first

4. **Function Timeouts**
   - Increase function timeout in Vercel
   - Optimize API response times
   - Implement proper error handling

### Debug Commands

```bash
# Check deployment status
vercel ls

# View function logs
vercel logs

# Test API locally
curl -X POST http://localhost:3000/api/Translate \
  -H "Content-Type: application/json" \
  -d '{"inputText":"hello","inputLang":"en","outputLang":"es"}'
```

## 📱 Mobile Deployment Considerations

### PWA Configuration

1. **Add PWA Support**
   ```bash
   npm install next-pwa
   ```

2. **Configure PWA**
   ```typescript
   // next.config.ts
   const withPWA = require('next-pwa')({
     dest: 'public',
     register: true,
     skipWaiting: true,
   });

   module.exports = withPWA({
     // your existing config
   });
   ```

### Mobile Optimization

1. **Viewport Configuration**
   ```html
   <!-- app/layout.tsx -->
   <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
   ```

2. **Touch Optimization**
   - Ensure buttons are at least 44px
   - Implement proper touch targets
   - Test on actual mobile devices

## 🎯 Post-Deployment Checklist

- [ ] Test voice recording functionality
- [ ] Verify translation accuracy
- [ ] Check mobile responsiveness
- [ ] Test audio playback
- [ ] Monitor API usage and costs
- [ ] Set up error monitoring
- [ ] Configure analytics
- [ ] Test on different browsers
- [ ] Verify HTTPS is working
- [ ] Check loading performance

## 📞 Support

If you encounter deployment issues:

1. Check the troubleshooting section
2. Review platform-specific documentation
3. Check function logs for errors
4. Verify environment variables
5. Test API endpoints directly

---

**Note**: This deployment guide covers the most common scenarios. For enterprise deployments, consider additional security, compliance, and scalability requirements. 