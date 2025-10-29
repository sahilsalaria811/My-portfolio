/**
 * Application constants and configuration
 */

export const SITE_CONFIG = {
  name: 'Sahil Salaria',
  title: 'Sahil Salaria — Building Quality, Precision, and Trust in Every Product',
  description: 'Team Lead • Quality Analyst • Automation & AI Enthusiast',
  email: 'sahilsalaria811@gmail.com',
  phone: '+91 9878977894',
  phoneAlt: '+91 9781677894',
  social: {
    linkedin: 'https://www.linkedin.com/in/sahilsalaria',
    github: 'https://github.com/sahilsalaria',
    twitter: 'https://twitter.com/sahilsalaria'
  }
};

export const ROUTES = {
  HOME: '/',
  BLOG: '/blog',
  BLOG_DETAIL: '/blog/:id',
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
    description: 'Selenium, Postman, API Testing',
    icon: 'shield-check'
  },
  {
    title: 'Programming',
    description: 'Java, Python, JavaScript (basics)',
    icon: 'code'
  },
  {
    title: 'Version Control',
    description: 'Git, GitHub',
    icon: 'git-branch'
  },
  {
    title: 'DevOps',
    description: 'Hosting, DNS, SSL, CI/CD',
    icon: 'server'
  },
  {
    title: 'Web & WordPress',
    description: 'Setup, Deployment, Customization',
    icon: 'globe'
  },
  {
    title: 'AI Integration',
    description: 'Adding AI to Automation (in progress)',
    icon: 'brain'
  }
];

export const PLACEHOLDER_BLOGS = [
  {
    id: '1',
    title: 'The Future of AI in Quality Assurance',
    content: '<p>Exploring how artificial intelligence is revolutionizing the QA landscape and what it means for the future of testing.</p><p>As we advance into a more automated world, AI-powered testing tools are becoming essential for maintaining quality at scale...</p>',
    image: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=800',
    date: new Date('2024-01-15').toISOString(),
    excerpt: 'Exploring how artificial intelligence is revolutionizing the QA landscape and what it means for the future of testing.'
  },
  {
    id: '2',
    title: 'API Testing Best Practices with Postman',
    content: '<p>A comprehensive guide to effective API testing strategies using Postman and automation frameworks.</p><p>API testing has become a cornerstone of modern software development. Here are the essential practices every QA professional should know...</p>',
    image: 'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=800',
    date: new Date('2024-01-10').toISOString(),
    excerpt: 'A comprehensive guide to effective API testing strategies using Postman and automation frameworks.'
  },
  {
    id: '3',
    title: 'Building Robust Selenium Test Frameworks',
    content: '<p>Learn how to create maintainable and scalable test automation frameworks using Selenium WebDriver.</p><p>A well-structured test framework is the foundation of successful test automation. Let me share my approach to building robust frameworks...</p>',
    image: 'https://images.pexels.com/photos/574080/pexels-photo-574080.jpeg?auto=compress&cs=tinysrgb&w=800',
    date: new Date('2024-01-05').toISOString(),
    excerpt: 'Learn how to create maintainable and scalable test automation frameworks using Selenium WebDriver.'
  }
];