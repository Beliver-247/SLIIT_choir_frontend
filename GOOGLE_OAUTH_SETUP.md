# Google OAuth Setup Guide

## Overview
This guide will help you set up Google OAuth for the SLIIT Choir application.

## Prerequisites
- A Google Cloud account (create at https://console.cloud.google.com/)
- Access to Google Cloud Console

## Step-by-Step Setup

### 1. Create a Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click on the project dropdown at the top
3. Click "NEW PROJECT"
4. Enter project name: "SLIIT Choir"
5. Click "CREATE"

### 2. Enable Google+ API
1. In the left sidebar, click "APIs & Services" → "Library"
2. Search for "Google+ API"
3. Click on it and select "ENABLE"

### 3. Create OAuth 2.0 Credentials
1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "OAuth client ID"
3. Choose "Web application" as the application type
4. Name it "SLIIT Choir Backend"

### 4. Configure Authorized Redirect URIs
In the OAuth consent screen and credentials:
- Add these redirect URIs:
  - `http://localhost:5000/api/auth/google/callback` (development)
  - `https://yourdomain.com/api/auth/google/callback` (production)

### 5. Get Your Credentials
1. After creating the OAuth client, you'll see:
   - **Client ID**: Copy this
   - **Client Secret**: Copy this

### 6. Update Your .env File
In `/backend/.env`, update:

```env
GOOGLE_CLIENT_ID=your_client_id_here
GOOGLE_CLIENT_SECRET=your_client_secret_here
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback
```

## Testing Google Login

### 1. Start the Backend Server
```bash
cd /Users/dumindumendis/Downloads/my\ Projects/SLIIT\ choir/backend
npm run dev
```

### 2. Start the Frontend Dev Server
In another terminal:
```bash
cd /Users/dumindumendis/Downloads/my\ Projects/SLIIT\ choir
npm run dev
```

### 3. Test the Login Flow
1. Open http://localhost:5173 in your browser
2. Click "Login" button
3. Click "Sign in with Google"
4. Sign in with your Google account
5. You should be redirected back to the app with your member profile loaded

## Features Implemented

### Backend
- ✅ Passport.js integration with Google OAuth 2.0
- ✅ Automatic member creation from Google profile
- ✅ JWT token generation after OAuth callback
- ✅ Member model with googleId field
- ✅ Google auth routes and controllers

### Frontend
- ✅ Google login button in LoginModal
- ✅ AuthSuccess component to handle OAuth callback
- ✅ localStorage persistence of auth token and member data
- ✅ API utility functions for authenticated requests
- ✅ Auto-login on page refresh if token exists

## API Endpoints

### Google Authentication
- `GET /api/auth/google` - Initiates Google login
- `GET /api/auth/google/callback` - Handles OAuth callback
- `GET /api/auth/google/failure` - Handles failed authentication

### Existing Authentication
- `POST /api/auth/register` - Register with email/password
- `POST /api/auth/login` - Login with email/password
- `GET /api/auth/profile` - Get authenticated user profile

## Environment Variables

```env
# Google OAuth
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback

# Session
SESSION_SECRET=your_session_secret

# Other existing variables
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
FRONTEND_URL=http://localhost:5173
```

## Troubleshooting

### "Redirect URI mismatch" Error
- Ensure the redirect URI in your Google Cloud Console exactly matches `GOOGLE_CALLBACK_URL` in .env

### "Client ID not found" Error
- Verify `GOOGLE_CLIENT_ID` is correctly set in .env
- Restart the backend server after updating .env

### Member Not Created
- Check MongoDB connection is working
- Verify member email doesn't already exist in database

## Production Deployment

When deploying to production:

1. Update redirect URIs in Google Cloud Console:
   ```
   https://yourdomain.com/api/auth/google/callback
   ```

2. Update .env variables:
   ```env
   NODE_ENV=production
   FRONTEND_URL=https://yourdomain.com
   GOOGLE_CALLBACK_URL=https://yourdomain.com/api/auth/google/callback
   ```

3. Use secure session and JWT secrets (generate with `openssl rand -base64 32`)

4. Set `secure: true` in session cookies (already done for production in code)

## Security Notes

- Never commit .env file with real credentials to version control
- Use environment-specific .env files (.env.development, .env.production)
- Regularly rotate your JWT_SECRET and SESSION_SECRET
- Use HTTPS in production
- Enable CORS only for your frontend domain in production
