/**
 * Application constants and configuration
 */

export const SITE_CONFIG = {
  name: 'Sahil Salaria',
  title: 'Sahil Salaria — Crafting Quality, Automation & AI-Driven Assurance',
  description: 'Team Lead • Quality Analyst • Automation & AI Innovator',
  email: 'sahilsalaria811@gmail.com',
  phone: '+91 9878977894',
  phoneAlt: '+91 9781677894',
  social: {
    linkedin: 'https://www.linkedin.com/in/sahil-salaria/',
    github: 'https://github.com/sahilsalaria811',
    twitter: 'https://x.com/Iamsahilsalaria'
  }
};

export const ROUTES = {
  HOME: '/',
  BLOG: '/blog',
  BLOG_DETAIL: '/blog/:slug',
  CREATE_BLOG: '/create-blog',
  LOGIN: '/login'
};

export const STORAGE_KEYS = {
  THEME: 'sahil-theme',
  AUTH_SESSION: 'sahil-auth',
  BLOGS: 'sahil-blogs'
};

export const THEME = {
  LIGHT: 'light',
  DARK: 'dark'
};

export const SKILLS = [
  {
    title: 'QA & Automation',
    description: 'Selenium, Postman, API Testing, Test Strategy Design',
    icon: 'shield-check'
  },
  {
    title: 'Programming',
    description: 'Java (proficient), Python (intermediate), JavaScript basics',
    icon: 'code'
  },
  {
    title: 'Version Control & Workflows',
    description: 'Git, GitHub Actions, branching strategies',
    icon: 'git-branch'
  },
  {
    title: 'DevOps Foundations',
    description: 'Hosting, DNS/SSL, CI/CD pipelines, container basics',
    icon: 'server'
  },
  {
    title: 'Web & WordPress Development',
    description: 'WordPress setup, theme customization, deployment',
    icon: 'globe'
  },
  {
    title: 'AI Integration',
    description: 'Embedding AI logic into automation flows (in progress)',
    icon: 'brain'
  }
];

export const PLACEHOLDER_BLOGS = [
  {
    id: '1',
    title: 'The Future of AI in Quality Assurance',
    slug: 'the-future-of-ai-in-quality-assurance',
    content: '<p>Exploring how artificial intelligence is revolutionizing the QA landscape and what it means for the future of testing.</p><p>As we advance into a more automated world, AI-powered testing tools are becoming essential for maintaining quality at scale...</p>',
    image: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=800',
    date: new Date('2024-01-15').toISOString(),
    excerpt: 'Exploring how artificial intelligence is revolutionizing the QA landscape and what it means for the future of testing.'
  },
  {
    id: '2',
    title: 'API Testing Best Practices with Postman',
    slug: 'api-testing-best-practices-with-postman',
    content: '<p>A comprehensive guide to effective API testing strategies using Postman and automation frameworks.</p><p>API testing has become a cornerstone of modern software development. Here are the essential practices every QA professional should know...</p>',
    image: 'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=800',
    date: new Date('2024-01-10').toISOString(),
    excerpt: 'A comprehensive guide to effective API testing strategies using Postman and automation frameworks.'
  },
  {
    id: '3',
    title: 'Building Robust Selenium Test Frameworks',
    slug: 'building-robust-selenium-test-frameworks',
    content: '<p>Learn how to create maintainable and scalable test automation frameworks using Selenium WebDriver.</p><p>A well-structured test framework is the foundation of successful test automation. Let me share my approach to building robust frameworks...</p>',
    image: 'https://images.pexels.com/photos/574080/pexels-photo-574080.jpeg?auto=compress&cs=tinysrgb&w=800',
    date: new Date('2024-01-05').toISOString(),
    excerpt: 'Learn how to create maintainable and scalable test automation frameworks using Selenium WebDriver.'
  }
];