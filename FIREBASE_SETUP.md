# Firebase Authentication Setup Guide

## 🔐 Setting Up Your Admin User

Your portfolio now uses **Firebase Authentication** for secure login. Follow these steps to create your admin user account.

### Step 1: Enable Email/Password Authentication

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **sahil-portfolio-751a1**
3. Navigate to **Authentication** → **Sign-in method**
4. Click on **Email/Password**
5. Enable **Email/Password** provider (toggle ON)
6. Click **Save**

### Step 2: Create Your Admin User

**Option A: Via Firebase Console (Recommended for first user)**
1. Go to **Authentication** → **Users**
2. Click **Add user**
3. Enter your email: `sahilsalaria811@gmail.com`
4. Enter a temporary password (you'll set the actual password in Option B)
5. Click **Add user**

**Option B: Set/Update Password**
1. Go to **Authentication** → **Users**
2. Click on your user email
3. Click **Reset password** (sends email) OR manually set password in user details

**Option C: Let users register themselves (if you want)**
- Users can register via the login page if you add a sign-up option
- You can restrict access by checking email domains

### Step 3: Test Your Login

1. Run your development server: `npm run dev`
2. Navigate to `/login`
3. Enter:
   - **Email:** `sahilsalaria811@gmail.com`
   - **Password:** `Sahilsalaria@62629`
4. You should be redirected to `/create-blog` upon successful login

### Step 4: Configure Firestore Security Rules (Important!)

Your blog posts are stored in Firestore. Set up security rules:

1. Go to **Firestore Database** → **Rules**
2. Update the rules to allow authenticated writes:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow anyone to read blogs
    match /blogs/{blogId} {
      allow read: if true;
      // Only allow authenticated users to write
      allow write: if request.auth != null;
    }
  }
}
```

### Step 5: Deploy Your Site

Once everything works locally:

```bash
# Build your project
npm run build

# Deploy to Firebase Hosting
firebase deploy
```

## 🔒 Security Notes

- ✅ **Email/Password Authentication** - Secure, managed by Firebase
- ✅ **Session Management** - Handled automatically by Firebase Auth
- ✅ **No Password Storage** - Passwords never stored locally, only hashed by Firebase
- ✅ **Production Ready** - Works seamlessly with Firebase Hosting

## 📝 Login Credentials

- **Email:** `sahilsalaria811@gmail.com`
- **Password:** `Sahilsalaria@62629`

**Remember:** Never commit your password to version control. This password should only be stored in Firebase Authentication console.

## 🆘 Troubleshooting

### "Firebase is not configured" error
- Check that all `VITE_FIREBASE_*` variables are in your `.env` file
- Restart your dev server after adding environment variables

### "No account found" error
- Make sure you've created the user in Firebase Console
- Verify email address matches exactly (case-sensitive)

### "Incorrect password" error
- Verify the password in Firebase Console
- Use "Reset password" in Firebase Console if needed

### Auth not persisting after page refresh
- Check browser console for Firebase errors
- Verify Firebase config is correct
- Make sure you're using `https` in production (Firebase Auth requires secure contexts)

## 🎉 You're All Set!

Once your user is created and tested, your portfolio is ready for deployment with secure Firebase Authentication!

