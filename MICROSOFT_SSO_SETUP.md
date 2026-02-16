# Microsoft SSO Integration Setup Guide

## Frontend Implementation Complete ✓

The frontend has been integrated with Microsoft SSO using MSAL.js. Here's what was implemented:

### Changes Made:

1. **Updated `src/index.base.html`**
   - Added MSAL.js script from CDN
   - Loading: `https://alcdn.msftauth.net/lib/2.13.1/msal-browser.min.js`

2. **Updated `src/htmlFragments/login-dialog.html`**
   - Added Microsoft sign-in button alongside Google sign-in
   - Updated description to be platform-agnostic

3. **Created `src/utils/microsoftAuth.ts`**
   - Handles MSAL initialization
   - Provides MSal instance management
   - Functions: `initializeMsalBrowser()`, `handleMicrosoftSignIn()`, `getMicrosoftAccessToken()`, `handleMicrosoftLogout()`

4. **Updated `src/utils/authentication.ts`**
   - Added `handleMicrosoftAuthResponse()` handler
   - Mirrors Google auth flow for Microsoft tokens

5. **Updated `src/utils/ui/authUi.ts`**
   - Initialize Microsoft Sign-in button on page load
   - Handle Microsoft token on existing session restart
   - Updated logout to handle Microsoft logout

6. **Updated `src/types.d.ts`**
   - Added MSAL window type definitions

## Environment Configuration

Add this to your `.env.local` file (or set in your deployment platform):

```
VITE_MICROSOFT_CLIENT_ID=your-microsoft-app-client-id-here
```

### Getting Your Microsoft Client ID:

1. Go to [Azure Portal](https://portal.azure.com)
2. Navigate to **Azure Active Directory** > **App registrations**
3. Click **+ New registration**
4. Fill in:
   - **Name**: Mission Sea Turtle Nest
   - **Supported account types**: Accounts in any organizational directory (Any Azure AD directory - Multitenant) and personal Microsoft accounts (e.g. Skype, Xbox)
   - **Redirect URI**: 
     - Web: `https://your-domain.com` (your actual domain)
     - Also add: `https://your-domain.com/` (with trailing slash)
     - For local dev: `https://localhost:5173`
5. Copy the **Application (client) ID** - this is your `VITE_MICROSOFT_CLIENT_ID`
6. In **Manifest**, ensure:
   ```json
   "signInAudience": "AzureADandPersonalMicrosoftAccount"
   ```

## Backend Integration - What Your Hono.js App Needs To Do

### 1. Receive Microsoft Token at `/api/login`

The frontend will POST to the same `/api/login` endpoint with:

```typescript
{
  "service": "microsoft",
  "token": "eyJ0eXAiOiJKV1QiLCJhbGc..." // Access token from MSAL
}
```

### 2. Validate the Microsoft Token

Use the Microsoft Graph API or `jsonwebtoken` library with Microsoft's public keys:

**Option A: Using Microsoft Graph API (Recommended)**
```bash
GET https://graph.microsoft.com/v1.0/me
Authorization: Bearer {access_token}
```

This returns:
```json
{
  "id": "user_unique_id",
  "userPrincipalName": "user@example.com",
  "displayName": "User Name",
  "mail": "user@example.com",
  "mailNickname": "user"
}
```

**Option B: Validate JWT Token Signature**
- Fetch Microsoft's public keys from: `https://login.microsoftonline.com/common/discovery/v2.0/keys`
- Validate the token signature
- Extract claims: `oid` (object ID), `email`, `name`

### 3. Handle User Data

Extract from the token or Microsoft Graph response:
- **Email**: `mail` or `email` claim
- **Name**: `displayName` or `name` claim
- **External User ID**: `oid` or `sub` claim
- **Profile Picture**: Can be fetched via Graph API

```typescript
const microsoftUser = {
  externalId: response.oid || response.sub,
  email: response.mail || response.email,
  name: response.displayName || response.name,
  ssoPlatform: "microsoft",
  // optional: profilePicUrl from Graph API
};
```

### 4. Return Same Response Format

Your backend should return the same `LoginResponse` format as for Google:

```typescript
{
  "message": "Login successful",
  "isNewPlayer": true,
  "player": {
    "externalId": "user_oid",
    "ssoPlatform": "microsoft",
    "name": "User Name",
    "email": "user@example.com",
    "profilePicUrl": "https://...",
    "createdAt": "2024-02-14T...",
    "lastLoginAt": "2024-02-14T...",
    "settings": {
      "controlPosition": "Right",
      "audioVolume": 0.5
    },
    "lastGame": null
  },
  "personalBest": null
}
```

### 5. Session Management

- Store the Microsoft `externalId` + `ssoPlatform` combination to uniquely identify users
- On subsequent visits, the frontend will send the stored token
- Validate the token is still valid before logging the user in

## Testing

1. Set `VITE_MICROSOFT_CLIENT_ID` environment variable
2. Run `npm run dev`
3. Click the "Sign in with Microsoft" button
4. You'll see the Microsoft login popup
5. After authentication, the token is sent to your backend's `/api/login` endpoint

## Troubleshooting

- **"MSAL Browser library not loaded"**: Check that the script tag loaded successfully in Network tab
- **Redirect URI mismatch**: Ensure your Azure app registration's Redirect URIs match your domain exactly (including http/https and trailing slashes)
- **Token validation fails**: Verify you're using the correct validation method for the token format
