# Quick Reference - Google Login Integration

## 🚀 Getting Started in 5 Minutes

### Step 1: Get Google OAuth Credentials
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Go to APIs & Services → Credentials
4. Click "Create Credentials" → "OAuth client ID"
5. Select "Web application"
6. Add redirect URI: `http://localhost:5000/api/auth/google/callback`
7. Copy Client ID and Client Secret

### Step 2: Update Environment
Edit `/backend/.env`:
```env
GOOGLE_CLIENT_ID=your_client_id_from_step_1
GOOGLE_CLIENT_SECRET=your_client_secret_from_step_1
```

### Step 3: Run the App
```bash
# Terminal 1 - Backend
cd "/Users/dumindumendis/Downloads/my Projects/SLIIT choir/backend"
npm run dev

# Terminal 2 - Frontend
cd "/Users/dumindumendis/Downloads/my Projects/SLIIT choir"
npm run dev
```

### Step 4: Test
1. Open http://localhost:5173
2. Click "Login"
3. Click "Sign in with Google"
4. Sign in with Google account
5. You should be logged in! ✅

---

## 📝 Key Changes Made

| Component | Change | Purpose |
|-----------|--------|---------|
| `server.js` | Added Passport + session middleware | Enable OAuth authentication |
| `Member.js` | Added `googleId` field | Link Google accounts |
| `LoginModal.tsx` | Added Google button | Provide OAuth login option |
| `App.tsx` | Added auth event listener | Handle OAuth callback |
| `api.ts` | Created API utility | Centralized API calls with auth |
| `AuthSuccess.tsx` | Created component | Handle OAuth callback |

---

## 🔐 Login Methods Available

### 1. Google OAuth
- Click "Sign in with Google"
- Automatic account creation
- Fast login

### 2. Email & Password
- Use email/password form
- Create account via registration
- Full control of credentials

---

## 💾 What Gets Stored

### localStorage
```javascript
{
  authToken: "jwt_token_here",
  member: {
    _id: "mongodb_id",
    firstName: "John",
    lastName: "Doe",
    email: "john@example.com",
    role: "member",
    status: "active",
    googleId: "google_id_if_oauth" // Only for Google users
  }
}
```

---

## 🔗 API Endpoints (All Working!)

### Authentication
```
POST   /api/auth/register          - Register with email/password
POST   /api/auth/login             - Login with email/password
GET    /api/auth/google            - Start Google OAuth
GET    /api/auth/google/callback   - Google OAuth callback
GET    /api/auth/profile           - Get current user profile
```

### Members
```
GET    /api/members                - List members (moderator+)
GET    /api/members/:id            - Get member details
PUT    /api/members/:id            - Update profile
PUT    /api/members/:id/status     - Change member status
DELETE /api/members/:id            - Delete member
```

### Events
```
GET    /api/events                 - List events
POST   /api/events                 - Create event (moderator+)
GET    /api/events/:id             - Get event details
PUT    /api/events/:id             - Update event
DELETE /api/events/:id             - Delete event
POST   /api/events/:id/register    - Register for event
DELETE /api/events/:id/register    - Unregister from event
```

### Donations
```
POST   /api/donations              - Create donation
GET    /api/donations              - List donations (moderator+)
GET    /api/donations/:id          - Get donation details
GET    /api/donations/stats/summary - Get statistics
PUT    /api/donations/:id/status   - Update payment status
DELETE /api/donations/:id          - Delete donation
```

---

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| "Invalid client ID" | Check GOOGLE_CLIENT_ID in .env matches Google Cloud Console |
| "Redirect URI mismatch" | Ensure callback URL matches in Google Cloud AND .env |
| "Connection refused" | Verify backend is running on port 5000 |
| "Member not created" | Check MongoDB connection and email uniqueness |
| Login button not working | Check browser console for errors |
| Token expired | Clear localStorage and login again |

---

## 📚 Documentation Files

- **GOOGLE_OAUTH_SETUP.md** - Complete setup guide with screenshots
- **GOOGLE_LOGIN_IMPLEMENTATION.md** - Technical implementation details
- **This file** - Quick reference

---

## 🎯 What's Next?

1. **Register a test account** via email/password
2. **Verify Google login** works with your Google account
3. **Test member portal** features (Events, Donations)
4. **Check localStorage** to see stored token
5. **Verify logout** clears data

---

## 💡 Tips

✅ Use developer tools (F12) to inspect Network tab when testing
✅ Clear localStorage (F12 → Application → localStorage) to test fresh login
✅ Check backend console for detailed error messages
✅ Always have two terminals open (one for backend, one for frontend)
✅ MongoDB Atlas shows all created members in dashboard

---

## 📞 Support Resources

- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Passport.js Documentation](http://www.passportjs.org/)
- [Mongoose Documentation](https://mongoosejs.com/)
- [Express Documentation](https://expressjs.com/)

Happy coding! 🎉
