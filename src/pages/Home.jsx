/**
 * Home page component with hero section, about, skills, and contact
 * Features animated gradients, glassmorphism cards, and smooth scrolling
 */

import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  Code, 
  ShieldCheck, 
  GitBranch, 
  Server, 
  Globe, 
  Brain,
  Mail,
  Phone,
  Linkedin,
  Github,
  Twitter,
  Sparkles,
  Zap,
  Target
} from 'lucide-react';
import { ROUTES, SITE_CONFIG, SKILLS } from '../utils/constants';

const Home = () => {
  // Icon mapping for skills
  const iconMap = {
    'shield-check': ShieldCheck,
    'code': Code,
    'git-branch': GitBranch,
    'server': Server,
    'globe': Globe,
    'brain': Brain
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const floatingVariants = {
    animate: {
      y: [-10, 10, -10],
      rotate: [0, 5, -5, 0],
      transition: {
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            variants={floatingVariants}
            animate="animate"
            className="absolute top-20 left-10 w-20 h-20 rounded-full bg-gradient-to-br from-primary-500/20 to-accent-cyan/20 blur-xl"
          />
          <motion.div
            variants={floatingVariants}
            animate="animate"
            style={{ animationDelay: '2s' }}
            className="absolute top-40 right-20 w-32 h-32 rounded-full bg-gradient-to-br from-accent-purple/20 to-primary-500/20 blur-xl"
          />
          <motion.div
            variants={floatingVariants}
            animate="animate"
            style={{ animationDelay: '4s' }}
            className="absolute bottom-20 left-20 w-24 h-24 rounded-full bg-gradient-to-br from-accent-cyan/20 to-accent-purple/20 blur-xl"
          />
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-4xl mx-auto text-center relative z-10"
        >
          <motion.div
            variants={itemVariants}
            className="mb-6"
          >
            <div className="inline-flex items-center space-x-2 px-4 py-2 glass-card text-sm text-gray-600 dark:text-gray-400">
              <Sparkles className="w-4 h-4 text-primary-500" />
              <span>Welcome to my digital space</span>
            </div>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="text-4xl md:text-6xl lg:text-7xl font-bold gradient-text mb-6"
          >
            Hi, I'm Sahil Salaria
          </motion.h1>

          <motion.h2
            variants={itemVariants}
            className="text-xl md:text-2xl lg:text-3xl text-gray-800 dark:text-gray-200 mb-4"
          >
            Building Quality, Precision, and Trust in Every Product
          </motion.h2>

          <motion.div
            variants={itemVariants}
            className="text-lg md:text-xl text-primary-600 dark:text-primary-400 font-semibold mb-8"
          >
            Team Lead • Quality Analyst • Automation & AI Enthusiast
          </motion.div>

          <motion.p
            variants={itemVariants}
            className="text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-12 max-w-3xl mx-auto leading-relaxed"
          >
            I lead QA teams focused on delivering seamless, bug-free user experiences. 
            My current focus is blending automation, AI, and DevOps to redefine how 
            testing empowers smarter product decisions.
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => document.getElementById('skills').scrollIntoView({ behavior: 'smooth' })}
              className="px-8 py-4 bg-gradient-to-r from-primary-500 to-accent-purple text-white font-semibold rounded-xl hover:from-primary-600 hover:to-accent-purple transition-all duration-200 flex items-center justify-center space-x-2"
            >
              <Target className="w-5 h-5" />
              <span>View My Work</span>
            </motion.button>

            <Link to={ROUTES.BLOG}>
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 glass-card hover:glass-border text-gray-800 dark:text-gray-200 font-semibold rounded-xl transition-all duration-200 flex items-center justify-center space-x-2"
              >
                <span>Read My Blog</span>
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* About Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold gradient-text mb-6">
              About Me
            </h2>
            <div className="space-y-6">
              <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                I'm a passionate Quality Analyst and emerging developer driven by curiosity and precision.
                I specialize in API Testing, Automation, and AI-powered QA workflows — ensuring every release meets the highest standards.
              </p>
              <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                Currently, I'm leading QA initiatives and experimenting with modern tech stacks, including Python, Selenium, and cloud integrations.
              </p>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-12 glass-card p-8 inline-block"
            >
              <blockquote className="text-xl md:text-2xl italic text-gray-800 dark:text-gray-200">
                "Quality is not an act, it's a habit — and innovation keeps that habit alive."
              </blockquote>
            </motion.div>

            {/* Highlights */}
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="glass-card p-6 hover:glass-border transition-all duration-200"
              >
                <Zap className="w-8 h-8 text-primary-500 mb-4 mx-auto" />
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  Test Planning & Automation
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Comprehensive test frameworks and automation strategies
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="glass-card p-6 hover:glass-border transition-all duration-200"
              >
                <Code className="w-8 h-8 text-accent-cyan mb-4 mx-auto" />
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  Technical Proficiency
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Postman, Java, Python, Git, and modern testing tools
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="glass-card p-6 hover:glass-border transition-all duration-200"
              >
                <Brain className="w-8 h-8 text-accent-purple mb-4 mx-auto" />
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  AI & Innovation
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Exploring DevOps and AI-driven QA methodologies
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold gradient-text mb-6">
              Technical Skills & Tools
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              A comprehensive toolkit for delivering quality software solutions
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SKILLS.map((skill, index) => {
              const IconComponent = iconMap[skill.icon];
              return (
                <motion.div
                  key={skill.title}
                  initial={{ opacity: 0, y: 30, scale: 0.9 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  whileHover={{ scale: 1.02, y: -5 }}
                  viewport={{ once: true }}
                  transition={{ 
                    duration: 0.5, 
                    delay: index * 0.1,
                    ease: "easeOut"
                  }}
                  className="glass-card p-8 hover:glass-border transition-all duration-300 group"
                >
                  <div className="text-center">
                    <motion.div
                      whileHover={{ rotate: 5, scale: 1.1 }}
                      className="w-16 h-16 mx-auto mb-6 rounded-xl bg-gradient-to-br from-primary-500 to-accent-purple flex items-center justify-center group-hover:from-accent-cyan group-hover:to-primary-500 transition-all duration-300"
                    >
                      <IconComponent className="w-8 h-8 text-white" />
                    </motion.div>
                    
                    <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">
                      {skill.title}
                    </h3>
                    
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                      {skill.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold gradient-text mb-6">
              Let's Connect
            </h2>
            
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed">
              I'm open to collaborations, QA consulting, or discussing how AI can elevate 
              automation and testing. If you have a project or want to exchange ideas — let's talk.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {/* Email */}
              <motion.a
                href={`mailto:${SITE_CONFIG.email}`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.05, y: -5 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="glass-card p-6 hover:glass-border transition-all duration-200 group"
              >
                <Mail className="w-8 h-8 text-red-500 mb-4 mx-auto group-hover:scale-110 transition-transform" />
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Email</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm break-all">
                  {SITE_CONFIG.email}
                </p>
              </motion.a>

              {/* Phone */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="glass-card p-6 hover:glass-border transition-all duration-200 group"
              >
                <Phone className="w-8 h-8 text-green-500 mb-4 mx-auto group-hover:scale-110 transition-transform" />
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Phone</h3>
                <div className="text-gray-600 dark:text-gray-400 text-sm">
                  <div>{SITE_CONFIG.phone}</div>
                  <div>{SITE_CONFIG.phoneAlt}</div>
                </div>
              </motion.div>

              {/* Social */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="glass-card p-6 hover:glass-border transition-all duration-200"
              >
                <div className="flex justify-center space-x-4 mb-4">
                  <motion.a
                    href={SITE_CONFIG.social.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className="text-blue-600 hover:text-blue-700"
                  >
                    <Linkedin className="w-6 h-6" />
                  </motion.a>
                  <motion.a
                    href={SITE_CONFIG.social.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1, rotate: -5 }}
                    className="text-gray-800 dark:text-gray-200 hover:text-gray-900 dark:hover:text-gray-100"
                  >
                    <Github className="w-6 h-6" />
                  </motion.a>
                  <motion.a
                    href={SITE_CONFIG.social.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className="text-sky-500 hover:text-sky-600"
                  >
                    <Twitter className="w-6 h-6" />
                  </motion.a>
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Social</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Connect on social platforms
                </p>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-center"
            >
              <motion.a
                href={`mailto:${SITE_CONFIG.email}`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-primary-500 to-accent-purple text-white font-semibold rounded-xl hover:from-primary-600 hover:to-accent-purple transition-all duration-200"
              >
                <Mail className="w-5 h-5" />
                <span>Get In Touch</span>
                <ArrowRight className="w-5 h-5" />
              </motion.a>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;