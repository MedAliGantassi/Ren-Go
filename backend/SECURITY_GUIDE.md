# REN&GO BACKEND - SECURITY & DEPLOYMENT GUIDE

## 🔴 CRITICAL: Before Production Deployment

### 1. **Environment Variables (.env)**

⚠️ **NEVER commit .env to version control**

Create a strong `.env` file:

```bash
# Generate strong JWT secret (32+ characters)
JWT_SECRET=your-super-strong-random-secret-key-min-32-chars-long

# MongoDB connection (use secure credentials)
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/rengo?retryWrites=true&w=majority

# Environment
NODE_ENV=production

# Server
PORT=5000

# Frontend URL (for CORS)
FRONTEND_URL=https://your-frontend-domain.com
```

**Generate secure JWT_SECRET:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 2. **Git Security**

Add to `.gitignore`:
```
.env
.env.local
.env.production
node_modules/
```

If `.env` was already committed:
```bash
git rm --cached .env
git commit -m "Remove .env from version control"
```

### 3. **Install Dependencies**

```bash
npm install
```

This will install `express-rate-limit` which is now required.

---

## 🛡️ SECURITY IMPROVEMENTS IMPLEMENTED

### ✅ Fixed Issues:

1. **NoSQL Injection Protection** - Input sanitization with regex escaping
2. **Password Requirements** - Minimum 8 characters (update to 12+ for production)
3. **Rate Limiting** - Login (5 attempts/15min), Register (3 attempts/hour)
4. **Payment Race Conditions** - MongoDB transactions for atomic operations
5. **Input Validation** - All numeric inputs, dates, enums validated
6. **Pagination** - All list endpoints now paginated (max 100 items)
7. **Security Headers** - X-Frame-Options, X-Content-Type-Options, HSTS
8. **CORS Configuration** - Restricted to specific frontend origin
9. **Request Size Limits** - 10kb limit to prevent payload attacks
10. **Error Handling** - Generic messages in production, detailed in development

### 🔄 Enhanced Features:

1. **Advanced Property Search** - Filter by bedrooms, bathrooms, maxGuests, price range, location
2. **Dashboard APIs** - CLIENT, PROPRIETAIRE, and ADMIN dashboards with statistics
3. **Response Standardization** - Consistent `{ success, message, data }` format
4. **Minimum Booking Lead Time** - 24 hours advance booking required

---

## 📋 API ENDPOINTS

### Dashboard APIs (NEW)

```
GET /api/dashboard/client          (CLIENT only)
GET /api/dashboard/proprietaire    (PROPRIETAIRE only)
GET /api/dashboard/admin           (ADMIN only)
```

### Property Search (ENHANCED)

```
GET /api/properties?page=1&limit=20&localisation=Tunis&minPrix=100&maxPrix=500&bedrooms=2&bathrooms=1&maxGuests=4
```

Parameters:
- `page` - Page number (default: 1)
- `limit` - Items per page (max: 100, default: 20)
- `localisation` - Search in gouvernorat or delegation
- `minPrix` - Minimum price
- `maxPrix` - Maximum price
- `bedrooms` - Minimum bedrooms
- `bathrooms` - Minimum bathrooms
- `maxGuests` - Minimum guest capacity

---

## 🚀 DEPLOYMENT CHECKLIST

### Before Deploying:

- [ ] Generate strong JWT_SECRET (32+ characters)
- [ ] Update MongoDB credentials (remove default password)
- [ ] Set NODE_ENV=production
- [ ] Configure FRONTEND_URL for CORS
- [ ] Remove `.env` from git history
- [ ] Run `npm install` to get express-rate-limit
- [ ] Test all endpoints in staging environment
- [ ] Set up MongoDB Atlas IP whitelist
- [ ] Enable MongoDB authentication
- [ ] Configure reverse proxy (Nginx) with HTTPS
- [ ] Set up SSL certificate (Let's Encrypt)
- [ ] Configure firewall rules
- [ ] Set up automated backups for MongoDB
- [ ] Configure logging system (Winston, Sentry)
- [ ] Set up monitoring (PM2, New Relic, DataDog)

### Recommended Additional Security:

1. **Helmet.js** - Additional security headers
   ```bash
   npm install helmet
   ```
   In `server.js`:
   ```javascript
   const helmet = require('helmet');
   app.use(helmet());
   ```

2. **MongoDB Transactions** - Already implemented for payments
3. **Input Sanitization** - Already implemented with validators
4. **Rate Limiting** - Already implemented
5. **Password Policy** - Update User model minlength to 12

---

## 🔐 PRODUCTION RECOMMENDATIONS

### 1. Password Policy (Update User.js)

```javascript
password: {
  type: String,
  required: [true, 'Password is required'],
  minlength: [12, 'Password must be at least 12 characters'],
  validate: {
    validator: function(v) {
      return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{12,}$/.test(v);
    },
    message: 'Password must contain uppercase, lowercase, number, and special character'
  }
}
```

### 2. Environment-Specific Logging

```javascript
const winston = require('winston');

const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});
```

### 3. Database Backup Script

```bash
# Daily MongoDB backup
mongodump --uri="mongodb+srv://..." --out=/backups/$(date +%Y%m%d)
```

### 4. PM2 Process Manager

```bash
npm install -g pm2
pm2 start src/server.js --name rengo-api
pm2 startup
pm2 save
```

---

## 🧪 TESTING

### Run the server:
```bash
npm run dev    # Development with nodemon
npm start      # Production
```

### Test endpoints:
```bash
# Health check
curl http://localhost:5000/

# Test rate limiting (login)
for i in {1..6}; do curl -X POST http://localhost:5000/api/auth/login -H "Content-Type: application/json" -d '{"email":"test@test.com","password":"wrong"}'; done
```

---

## 📊 MONITORING METRICS

Track these in production:

- Request rate & latency
- Error rates (4xx, 5xx)
- Database query performance
- Memory & CPU usage
- Failed login attempts
- Payment transaction success rate
- Auto-cancel job execution

---

## 🐛 KNOWN LIMITATIONS

1. **No Email Service** - Needs integration for password reset, verification
2. **No Payment Gateway** - Currently simulated (integrate Stripe/PayPal)
3. **No File Upload** - Images stored as URLs (add Cloudinary/S3)
4. **No WebSocket** - Real-time notifications would require Socket.io
5. **No Search Indexing** - Add MongoDB text indexes for better search

---

## 📞 SUPPORT

For issues, check:
1. Server logs
2. MongoDB connection
3. Environment variables
4. Rate limit headers in response
5. CORS errors in browser console

---

**Last Updated:** 2026-04-04  
**Backend Version:** 1.0.0  
**Security Audit:** Completed ✅
