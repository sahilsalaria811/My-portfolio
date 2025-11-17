# Sahil Salaria — Portfolio & Blog

A modern, futuristic portfolio + blog built with React + Vite, TailwindCSS and Firebase. It features glassmorphism, smooth animations, dark/light theme, rich blog tooling and SEO.

![Portfolio Screenshot](https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=1200&h=600&fit=crop)

## 🚀 Features

### 🎨 Design
- **Modern Glassmorphism UI** with blur effects and gradient borders
- **Responsive Design** optimized for mobile, tablet, and desktop
- **Light/Dark Theme Toggle** with persistent preferences
- **Smooth Animations** powered by Framer Motion
- **Gradient Backgrounds** with animated transitions

### 📝 Blog Management
- **Rich Text Editor (React Quill)**
- **Create / Read / Update / Delete**
- **Drafts vs Published** toggle
- **Tags** with filtering and search
- **SEO fields**: `metaTitle`, `seoDescription`
- **View counter** with Firestore `increment`
- **Timestamps**: created + last updated (serverTimestamp)
- **Author tracking** (name + uid)
- **Search** across title/excerpt/seoDescription/tags
- **Image handling**: paste any public URL (upload to Firebase Storage optional)
- **Social sharing** (LinkedIn, X/Twitter, Copy link)

### 🔐 Authentication
- **Firebase Auth (Email/Password)**
- **Auth-guarded routes** for editor
- **Local session fallback** when Firebase is not configured

### ⚡ Performance
- **Lazy loaded routes**
- **Code-splitting** and Suspense fallbacks
- **Image lazy-loading** on cards

## 🛠️ Tech Stack

- **Frontend:** React 18 + Vite
- **Styling:** TailwindCSS (custom glass utilities)
- **Animation:** Framer Motion
- **Routing:** React Router DOM
- **Editor:** React Quill
- **Backend-as-a-Service:** Firebase (Auth, Firestore, Storage)
- **Icons:** Lucide React

## 📦 Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd sahil-portfolio
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables (Firebase):**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your configuration:
   ```env
   # Firebase (required for cloud mode; app works in local mode without these)
   VITE_FIREBASE_API_KEY=
   VITE_FIREBASE_AUTH_DOMAIN=
   VITE_FIREBASE_PROJECT_ID=
   VITE_FIREBASE_STORAGE_BUCKET=
   VITE_FIREBASE_MESSAGING_SENDER_ID=
   VITE_FIREBASE_APP_ID=
   VITE_FIREBASE_MEASUREMENT_ID=
   ```

4. **Start development server:**
   ```bash
   npm run dev
   ```

5. **Build for production (regenerates sitemap + robots):**
   ```bash
   npm run build
   ```

6. **Preview production build:**
   ```bash
   npm run preview
   ```

## 📝 Usage

### Writing Your First Blog Post

1. **Login (Firebase):**
   - Navigate to `/login`
   - Sign in with your Email/Password (created in Firebase Auth)

2. **Create a Blog Post:**
   - Go to `/create-blog` (or click "Create" in the navigation)
   - Fill in title, optional image URL, content, tags, SEO fields
   - Choose Published or Draft
   - Click "Publish"

3. **View Your Blog:**
   - Navigate to `/blog` to see all posts
   - Click on any post to read the full content
   - Use the search and tag filters to find posts

### Customizing Content

#### Home Page Content
Update texts in the components directly (primarily `src/pages/Home.jsx`). Global details like socials and skills live in `src/utils/constants.js`.

#### Styling and Design
- **Colors:** Modify the color palette in `tailwind.config.js`
- **Animations:** Adjust Framer Motion variants in component files
- **Glassmorphism:** Customize glass effects in `src/index.css`

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_FIREBASE_API_KEY` | Firebase API key | Optional |
| `VITE_FIREBASE_AUTH_DOMAIN` | Firebase auth domain | Optional |
| `VITE_FIREBASE_PROJECT_ID` | Firebase project ID | Optional |
| `VITE_FIREBASE_STORAGE_BUCKET` | Firebase storage bucket | Optional |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Firebase messaging sender ID | Optional |
| `VITE_FIREBASE_APP_ID` | Firebase app ID | Optional |
| `VITE_FIREBASE_MEASUREMENT_ID` | Firebase analytics measurement id | Optional |
| `VITE_SITE_URL` | Canonical site URL (used for sitemap & robots) | Recommended |

> `VITE_SITE_URL` should match the domain you serve in production (e.g. `https://sahil-portfolio-751a1.web.app` or your custom domain). The build step uses it for canonical links in `sitemap.xml` and `robots.txt`.

### Firebase Setup (Optional)
### Automated SEO Assets

- `npm run build` now calls a post-build script that fetches published blogs and writes:
  - `dist/sitemap.xml` with canonical URLs for Home, Blog index, and every published post slug.
  - `dist/robots.txt` allowing crawlers while hiding `/login` and `/create-blog`.
- The script prefers live Firestore data (using `VITE_FIREBASE_PROJECT_ID` & `VITE_FIREBASE_API_KEY`) and falls back to local placeholder posts if Firebase is not configured.
- A development `public/robots.txt` is kept in-sync so crawlers see the sitemap during local preview as well.


1. Create a Firebase project
2. Enable Firestore Database and Authentication (Email/Password)
3. Add your Firebase config to `.env`
4. (Optional) Security rules example:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /blogs/{document} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

## 🎨 Design System

### Colors
- **Primary:** #7C3AED (violet)
- **Accent Cyan:** #06B6D4
- **Accent Purple:** #9333EA
- **Glass Background:** rgba(255, 255, 255, 0.1)
- **Glass Border:** rgba(255, 255, 255, 0.2)

### Typography
- **Font Family:** Inter (primary), Outfit (alternative)
- **Body Line Height:** 150%
- **Heading Line Height:** 120%
- **Font Weights:** 300, 400, 500, 600, 700, 800, 900

### Spacing
- **Base Unit:** 8px
- **Breakpoints:** 
  - Mobile: < 768px
  - Tablet: 768px - 1024px
  - Desktop: > 1024px

### Components
- **Glass Cards:** Backdrop blur with subtle borders
- **Buttons:** Gradient backgrounds with hover animations
- **Forms:** Glass-styled inputs with focus states
- **Navigation:** Sticky header with glassmorphism

## 📁 Project Structure

```
src/
├── assets/                 # Static assets
├── components/            # Reusable components
│   ├── AuthGuard.jsx     # Authentication wrapper
│   ├── BlogCard.jsx      # Blog post card
│   ├── Footer.jsx        # Site footer
│   ├── ImageUploader.jsx # Image upload component
│   ├── Layout.jsx        # Main layout wrapper
│   ├── Navbar.jsx        # Navigation component
│   ├── RichTextEditor.jsx# Rich text editor
│   ├── ThemeToggle.jsx   # Dark/light theme toggle
│   └── Toast.jsx         # Toast notifications
├── pages/                # Page components
│   ├── BlogDetail.jsx    # Single blog post view
│   ├── BlogList.jsx      # Blog posts listing
│   ├── CreateBlog.jsx    # Blog creation form
│   ├── Home.jsx          # Homepage
│   └── Login.jsx         # Admin login
├── routes/               # Routing configuration
│   └── AppRoutes.jsx     # Route definitions
├── services/             # Business logic
│   ├── authService.js    # Authentication service
│   ├── blogService.js    # Blog CRUD operations
│   └── firebase.js       # Firebase configuration
├── utils/                # Utility functions
│   ├── constants.js      # App constants
│   └── formatDate.js     # Date formatting
├── App.tsx               # Root component
├── main.tsx              # App entry point
└── index.css             # Global styles
```

## 🚀 Deployment

### Firebase Hosting

1. Install CLI: `npm i -g firebase-tools` and `firebase login`
2. Build: `npm run build`
3. Ensure `firebase.json` exists (public: `dist`, SPA rewrites enabled)
4. Deploy: `firebase deploy --only hosting`
5. Hosting URL will be printed in the terminal

### GitHub Pages

**Option 1: Manual Deployment**
1. Build for GitHub Pages: `npm run build:github`
2. Push the `dist` folder contents to the `gh-pages` branch, or
3. Use a tool like `gh-pages`: `npx gh-pages -d dist`

**Option 2: Automated Deployment (Recommended)**
1. Enable GitHub Pages in your repository settings (Settings → Pages → Source: GitHub Actions)
2. Push to `main` branch - the workflow (`.github/workflows/deploy-gh-pages.yml`) will automatically:
   - Build with GitHub Pages base path (`/My-portfolio/`)
   - Deploy to GitHub Pages
3. Your site will be available at: `https://sahilsalaria811.github.io/My-portfolio/`

**Note:** Make sure to set up GitHub Secrets for Firebase environment variables if you're using Firebase features.

## 🔍 SEO & Sharing

- **Dynamic `<title>`** from blog `metaTitle` (fallback to title)
- **Meta description** from `seoDescription`
- **Semantic HTML:** Structured content with proper headings
- **Image Alt Text:** Descriptive alt attributes for all images
- **Clean URLs:** SEO-friendly routing structure
- **Performance:** Optimized loading and Core Web Vitals
- **Open Graph/Twitter Cards:** ready to extend

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes with proper commit messages
4. Push to the branch: `git push origin feature-name`
5. Open a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👨‍💻 About the Developer

**Sahil Salaria** — Team Lead • Quality Analyst • Automation & AI Innovator

- 📧 Email: sahilsalaria811@gmail.com
- 📱 Phone: +91 9878977894 / +91 9781677894
- 💼 LinkedIn: [linkedin.com/in/sahilsalaria](https://linkedin.com/in/sahilsalaria)
- 🐱 GitHub: [github.com/sahilsalaria811](https://github.com/sahilsalaria811)
- 🐦 X/Twitter: [x.com/Iamsahilsalaria](https://x.com/Iamsahilsalaria)

---

Made with ⚡ precision, ☁ curiosity, and 💡 purpose by Sahil Salaria.
# My-portfolio
# My-portfolio
