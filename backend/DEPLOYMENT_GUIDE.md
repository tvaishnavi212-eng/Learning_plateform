# Vercel Deployment Guide

## 🚀 Deploy Your Backend to Vercel

### Prerequisites
- Vercel account
- GitHub repository (recommended)
- MongoDB Atlas (for production database)
- Cloudinary account (for image uploads)

### Step 1: Update Environment Variables

Create your production environment variables in Vercel dashboard:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database_name
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLERK_SECRET_KEY=your_clerk_secret_key
CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
NODE_ENV=production
```

### Step 2: Deploy to Vercel

#### Option A: Using Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd backend
vercel --prod
```

#### Option B: Using GitHub (Recommended)
1. Push your code to GitHub
2. Connect your Vercel account to GitHub
3. Import your repository
4. Vercel will automatically deploy

### Step 3: Update Frontend API URL

Create `frontend/.env` file:
```env
VITE_API_URL=https://your-vercel-app-name.vercel.app
```

### Step 4: Test Your Deployment

1. Visit your Vercel URL
2. Test API endpoints:
   - `GET /` - Should return "API Working 🚀"
   - `GET /api/course/all` - Should return courses
   - `GET /api/educator/courses` - Should return educator courses

### Step 5: Update Webhooks

Update your webhook URLs in:
- Clerk dashboard: `https://your-vercel-app-name.vercel.app/clerk`
- Stripe dashboard: `https://your-vercel-app-name.vercel.app/stripe`

### Common Issues & Solutions

#### 1. CORS Issues
Make sure your frontend URL is added to CORS origins.

#### 2. Database Connection
Use MongoDB Atlas for production, not localhost.

#### 3. File Uploads
Vercel has file size limits, use Cloudinary for images.

#### 4. Environment Variables
Never commit `.env` files to Git, use Vercel dashboard.

### Monitoring

- Check Vercel Functions tab for logs
- Monitor MongoDB Atlas for database performance
- Set up error tracking (Sentry, etc.)

### Production Tips

1. **Database**: Use MongoDB Atlas with proper indexing
2. **Images**: Always use Cloudinary for production
3. **Security**: Enable rate limiting and input validation
4. **Performance**: Monitor Vercel function execution time
5. **Backup**: Regular database backups

### API Endpoints After Deployment

Your API will be available at:
```
https://your-app-name.vercel.app/api/educator/dashboard
https://your-app-name.vercel.app/api/course/all
https://your-app-name.vercel.app/api/user/data
```

### Troubleshooting

If you encounter issues:
1. Check Vercel deployment logs
2. Verify environment variables
3. Test database connection
4. Check CORS configuration
5. Monitor function timeouts (max 30 seconds on Vercel)
