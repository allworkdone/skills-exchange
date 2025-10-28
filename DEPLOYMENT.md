# SkillSwap Deployment Guide

## Deploying to Production

### Option 1: Vercel (Frontend) + Railway/Heroku (Backend)

#### Frontend Deployment (Vercel)

1. Push code to GitHub
2. Connect repository to Vercel
3. Set environment variables:
   ```
   BACKEND_URL=https://your-backend-api.com
   NEXT_PUBLIC_BACKEND_URL=https://your-backend-api.com
   ```
4. Deploy automatically on push

#### Backend Deployment (Railway)

1. Create Railway account
2. Create new project → Import GitHub repo
3. Add MongoDB plugin or use external MongoDB
4. Set environment variables:
   ```
   MONGO_URL=your_production_mongodb_uri
   JWT_SECRET=generate_a_secure_key
   CLIENT_URL=https://your-frontend-domain.com
   NODE_ENV=production
   ADMIN_ID=your_admin_id
   ```
5. Deploy

### Option 2: Single Provider Deployment

#### Deploy on Netlify/Vercel (Frontend)
```bash
npm run build
vercel deploy
```

#### Deploy Backend on Heroku
```bash
heroku create your-app-name
heroku config:set MONGO_URL=your_uri
heroku config:set JWT_SECRET=your_secret
heroku config:set CLIENT_URL=https://your-domain
git push heroku main
```

## Production Checklist

- [ ] Update `JWT_SECRET` to a strong random string
- [ ] Set `NODE_ENV=production` in backend
- [ ] Configure MongoDB connection for production
- [ ] Enable HTTPS/SSL
- [ ] Set up domain names
- [ ] Configure CORS for specific domains only
- [ ] Set up email service (optional)
- [ ] Enable logging/monitoring (Sentry recommended)
- [ ] Backup MongoDB regularly
- [ ] Set up database indexes
- [ ] Configure rate limiting
- [ ] Test all API endpoints
- [ ] Set up error tracking
- [ ] Enable CDN for static files

## Environment Variables - Production

### Frontend (.env.production)
```
BACKEND_URL=https://api.yourskillswap.com
NEXT_PUBLIC_BACKEND_URL=https://api.yourskillswap.com
```

### Backend (.env.production)
```
PORT=5000
NODE_ENV=production
MONGO_URL=mongodb+srv://user:pass@cluster.mongodb.net/skillswap
JWT_SECRET=generate_secure_key_with_cryptographically_secure_generator
CLIENT_URL=https://yourskillswap.com
ADMIN_ID=your_admin_user_id
```

## Health Monitoring

Monitor these endpoints:
- `GET /api/health` - Backend health check
- Monitor database connections
- Monitor real-time chat connections
- Set up error logging with Sentry

## Performance Optimization

- Enable caching headers
- Compress responses with gzip
- Optimize MongoDB queries with indexes
- Use CDN for static assets
- Implement pagination for large datasets
- Monitor database performance
- Set up rate limiting

## Database Backup Strategy

- Daily automated backups to cloud storage
- Test restore procedures regularly
- Keep backup snapshots for 30 days
- Monitor backup sizes

## Security Hardening

- Use strong JWT secrets (32+ characters)
- Keep dependencies updated
- Use environment variables for all secrets
- Enable HTTPS only
- Set secure CORS policies
- Implement rate limiting
- Use helmet.js for security headers
- Regular security audits

## Troubleshooting Production Issues

### Backend won't connect to MongoDB
- Check network access in MongoDB Atlas
- Verify IP whitelist includes server IP
- Check connection string format

### Frontend can't reach backend API
- Verify domain DNS records
- Check CORS configuration
- Verify SSL certificates
- Check firewall rules

### Real-time chat not working
- Check Socket.io CORS settings
- Verify WebSocket connections allowed
- Check load balancer sticky sessions
- Monitor Socket.io connections

## Rollback Procedure

If deployment fails:
1. Identify the issue
2. Revert to previous commit
3. Test locally
4. Deploy again

## Monitoring & Logging

Set up monitoring with:
- Sentry for error tracking
- Datadog or New Relic for performance
- LogRocket for user session tracking
- Custom Analytics for business metrics

## Support & Maintenance

- Monitor error logs daily
- Review performance metrics weekly
- Update dependencies monthly
- Test disaster recovery quarterly
- Review user feedback and issues

---

Ready to deploy! Follow the checklist and contact your infrastructure team if needed.
