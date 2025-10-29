# Sahil Salaria — Portfolio & Blog Website

A modern, futuristic portfolio and blog website built with React, featuring glassmorphism design, smooth animations, and a powerful content management system.

![Portfolio Screenshot](https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=1200&h=600&fit=crop)

## 🚀 Features

### 🎨 Design
- **Modern Glassmorphism UI** with blur effects and gradient borders
- **Responsive Design** optimized for mobile, tablet, and desktop
- **Light/Dark Theme Toggle** with persistent preferences
- **Smooth Animations** powered by Framer Motion
- **Gradient Backgrounds** with animated transitions

### 📝 Blog Management
- **Rich Text Editor** with formatting, images, and code blocks
- **Local Storage** with Firebase-ready architecture
- **Search Functionality** to find blog posts
- **Social Sharing** integration (LinkedIn, Twitter, Copy Link)
- **SEO-Friendly** URLs and meta content

### 🔐 Authentication
- **Secure Admin Login** with bcrypt password hashing
- **Session Management** with 7-day expiration
- **Protected Routes** for content creation
- **Firebase Auth Ready** for scalable user management

### ⚡ Performance
- **Lazy Loading** for optimal bundle splitting
- **Code Splitting** by routes and components
- **Optimized Images** with proper loading strategies
- **Minimal Dependencies** for fast load times

## 🛠️ Tech Stack

- **Frontend:** React 18 + Vite
- **Styling:** TailwindCSS with custom glassmorphism utilities
- **Animation:** Framer Motion
- **Routing:** React Router DOM
- **Editor:** React Quill
- **Authentication:** bcryptjs
- **Storage:** localStorage (Firebase-ready)
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

3. **Set up environment variables:**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your configuration:
   ```env
   # Admin Password (default: admin123)
   VITE_ADMIN_PASSWORD_HASH=$2a$10$K8yF1c.Wn7rJ5v4Bb2xO9u8Q3zN9Lb1F5pD7gK6M2aE8vR4nC1xTy
   
   # Optional Firebase Configuration
   VITE_FIREBASE_API_KEY=your-api-key
   VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your-project-id
   VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
   VITE_FIREBASE_APP_ID=1:123456789:web:abcdef123456
   ```

4. **Start development server:**
   ```bash
   npm run dev
   ```

5. **Build for production:**
   ```bash
   npm run build
   ```

6. **Preview production build:**
   ```bash
   npm run preview
   ```

## 📝 Usage

### Writing Your First Blog Post

1. **Login as Admin:**
   - Navigate to `/login`
   - Enter password: `admin123` (default)
   - You'll be redirected to the blog creation page

2. **Create a Blog Post:**
   - Go to `/create-blog` (or click "Create" in the navigation)
   - Enter a compelling title
   - Add a featured image URL (optional)
   - Write your content using the rich text editor
   - Click "Publish Post"

3. **View Your Blog:**
   - Navigate to `/blog` to see all posts
   - Click on any post to read the full content
   - Use the search bar to find specific posts

### Customizing Content

#### Home Page Content
Edit `src/utils/constants.js` to update:
- Personal information and contact details
- Skills and expertise areas
- Social media links
- Site configuration

#### Styling and Design
- **Colors:** Modify the color palette in `tailwind.config.js`
- **Animations:** Adjust Framer Motion variants in component files
- **Glassmorphism:** Customize glass effects in `src/index.css`

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_ADMIN_PASSWORD_HASH` | Bcrypt hash of admin password | Yes |
| `VITE_FIREBASE_API_KEY` | Firebase API key | Optional |
| `VITE_FIREBASE_AUTH_DOMAIN` | Firebase auth domain | Optional |
| `VITE_FIREBASE_PROJECT_ID` | Firebase project ID | Optional |
| `VITE_FIREBASE_STORAGE_BUCKET` | Firebase storage bucket | Optional |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Firebase messaging sender ID | Optional |
| `VITE_FIREBASE_APP_ID` | Firebase app ID | Optional |

### Generating Password Hash

To generate a new admin password hash:

```javascript
import bcrypt from 'bcryptjs';

// Generate hash for your password
const hash = await bcrypt.hash('your-new-password', 10);
console.log(hash);
```

Update the `VITE_ADMIN_PASSWORD_HASH` in your `.env` file.

### Firebase Setup (Optional)

For production deployment with persistent storage:

1. Create a Firebase project
2. Enable Firestore Database
3. Set up authentication (optional)
4. Add your Firebase config to `.env`
5. Update Firestore security rules:

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
│   └── ThemeToggle.jsx   # Dark/light theme toggle
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
├── App.jsx               # Root component
├── main.jsx             # App entry point
└── index.css            # Global styles
```

## 🚀 Deployment

### Vercel (Recommended)
1. Push code to GitHub
2. Import project in Vercel
3. Set environment variables in Vercel dashboard
4. Deploy automatically on git push

### Netlify
1. Build the project: `npm run build`
2. Drag `dist` folder to Netlify deploy
3. Set environment variables in Netlify dashboard

### Manual Deployment
1. Build: `npm run build`
2. Upload `dist` folder contents to your web server
3. Configure server to serve `index.html` for all routes

## 🔍 SEO Optimization

- **Meta Tags:** Properly configured title and descriptions
- **Semantic HTML:** Structured content with proper headings
- **Image Alt Text:** Descriptive alt attributes for all images
- **Clean URLs:** SEO-friendly routing structure
- **Performance:** Optimized loading and Core Web Vitals

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes with proper commit messages
4. Push to the branch: `git push origin feature-name`
5. Open a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👨‍💻 About the Developer

**Sahil Salaria** - Quality Analyst & Emerging Developer

- 📧 Email: sahilsalaria811@gmail.com
- 📱 Phone: +91 9878977894 / +91 9781677894
- 💼 LinkedIn: [linkedin.com/in/sahilsalaria](https://linkedin.com/in/sahilsalaria)
- 🐱 GitHub: [github.com/sahilsalaria](https://github.com/sahilsalaria)
- 🐦 Twitter: [twitter.com/sahilsalaria](https://twitter.com/sahilsalaria)

---

Made with ⚡ precision, ☁ curiosity, and 💡 purpose by Sahil Salaria.# My-portfolio
