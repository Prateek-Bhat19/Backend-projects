# Access Hub - Simple Frontend

A clean, minimal frontend for testing the Access Hub authentication system.

## 🚀 Quick Start

1. **Make sure the backend is running**:
   ```bash
   npm run dev
   ```

2. **Open the frontend**:
   ```
   http://localhost:8000
   ```

3. **Test the flow**:
   - Click "Login with GitHub"
   - Authorize the app
   - You'll be redirected back to the dashboard
   - Test protected routes, refresh tokens, and logout

## 📁 Files

- `index.html` - Main HTML structure
- `styles.css` - Styling
- `app.js` - Authentication logic

## ✨ Features

- ✅ GitHub OAuth login
- ✅ Protected route testing
- ✅ Token refresh
- ✅ Logout functionality
- ✅ Clean, responsive design

## 🎯 How It Works

1. **Login**: Redirects to `/auth/github` → GitHub OAuth → Returns with access token
2. **Protected Route**: Tests `/protected` endpoint with Bearer token
3. **Refresh**: Calls `/auth/refresh` with cookies to get new access token
4. **Logout**: Calls `/auth/logout` to revoke session

All cookie handling is automatic - the browser manages the `refresh_token` cookie!
