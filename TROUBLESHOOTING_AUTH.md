# Authentication Troubleshooting Guide

This guide will help you resolve the 401 error you're experiencing during sign-in.

## Common Causes and Solutions

### 1. Invalid Credentials
- Make sure you're using the correct email and password
- If you haven't registered yet, go to `/auth/register` to create an account first
- Passwords are case-sensitive

### 2. Cached Authentication Data
Your browser might be storing invalid authentication data. To clear it:
1. Open your browser's developer tools (F12)
2. Go to the "Application" tab (Chrome) or "Storage" tab (Firefox)
3. Clear Local Storage for this site
4. Or simply open an incognito/private window and try logging in again

### 3. Backend Server Configuration
If the JWT secret was recently changed:
1. Restart the backend server:
   ```bash
   cd backend
   npm run dev
   ```

### 4. Environment Configuration
Make sure your environment files are properly set up:
- `BACKEND_URL` in `.env.local` should match your backend server URL
- `JWT_SECRET` in `backend/.env` should be a strong secret key

## Steps to Resolve 401 Error

1. **Clear Browser Data**
   - Clear your browser's local storage
   - Or use an incognito/private window

2. **Restart Backend Server**
   - Stop the running backend server (Ctrl+C)
   - Start it again: `cd backend && npm run dev`

3. **Verify Credentials**
   - Make sure you're using correct login credentials
   - If unsure, register a new account first to test

4. **Check Console for Errors**
   - Open browser developer tools (F12)
   - Check the Console and Network tabs for specific error messages

## Testing the Fix

After implementing the above steps, test the authentication flow:

1. Visit the login page: `/auth/login`
2. Enter your credentials
3. Check if the login is successful

## Additional Notes

- The backend server must be running on the configured port (default: 5001)
- Make sure both frontend (Next.js) and backend (Express) servers are running
- If you continue to experience issues, check the server logs for more detailed error messages
