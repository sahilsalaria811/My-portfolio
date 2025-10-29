/**
 * Footer component with social links and branding
 * Features glassmorphism design and smooth animations
 */

import { motion } from 'framer-motion';
import { 
  Mail, 
  Phone, 
  Linkedin, 
  Github, 
  Twitter, 
  Heart,
  Zap,
  Cloud,
  Lightbulb
} from 'lucide-react';
import { SITE_CONFIG } from '../utils/constants';

const Footer = () => {
  const socialLinks = [
    { 
      href: `mailto:${SITE_CONFIG.email}`, 
      icon: Mail, 
      label: 'Email',
      color: 'hover:text-red-500'
    },
    { 
      href: SITE_CONFIG.social.linkedin, 
      icon: Linkedin, 
      label: 'LinkedIn',
      color: 'hover:text-blue-500'
    },
    { 
      href: SITE_CONFIG.social.github, 
      icon: Github, 
      label: 'GitHub',
      color: 'hover:text-gray-800 dark:hover:text-gray-200'
    },
    { 
      href: SITE_CONFIG.social.twitter, 
      icon: Twitter, 
      label: 'Twitter',
      color: 'hover:text-sky-500'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.footer
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="glass-card border-0 border-t border-white/20 dark:border-white/10 mt-20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand Section */}
          <motion.div variants={itemVariants} className="space-y-4">
            <h3 className="text-2xl font-bold gradient-text">
              Sahil Salaria
            </h3>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              Building quality, precision, and trust in every product through 
              innovative QA solutions and automation.
            </p>
            <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
              <span>Made with</span>
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-primary-500"
              >
                <Zap className="w-4 h-4" />
              </motion.div>
              <span>precision,</span>
              <motion.div
                animate={{ y: [-2, 2, -2] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="text-accent-cyan"
              >
                <Cloud className="w-4 h-4" />
              </motion.div>
              <span>curiosity, and</span>
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="text-accent-purple"
              >
                <Lightbulb className="w-4 h-4" />
              </motion.div>
              <span>purpose by Sahil Salaria.</span>
            </div>
          </motion.div>

          {/* Contact Section */}
          <motion.div variants={itemVariants} className="space-y-4">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Contact
            </h4>
            <div className="space-y-3">
              <a
                href={`mailto:${SITE_CONFIG.email}`}
                className="flex items-center space-x-3 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
              >
                <Mail className="w-4 h-4" />
                <span className="text-sm">{SITE_CONFIG.email}</span>
              </a>
              <div className="flex items-center space-x-3 text-gray-600 dark:text-gray-400">
                <Phone className="w-4 h-4" />
                <div className="text-sm">
                  <div>{SITE_CONFIG.phone}</div>
                  <div>{SITE_CONFIG.phoneAlt}</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Social Links */}
          <motion.div variants={itemVariants} className="space-y-4">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Connect
            </h4>
            <div className="flex space-x-4">
              {socialLinks.map(({ href, icon: Icon, label, color }) => (
                <motion.a
                  key={label}
                  href={href}
                  target={href.startsWith('http') ? '_blank' : undefined}
                  rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.9 }}
                  className={`p-3 rounded-xl glass-card hover:glass-border transition-all duration-200 text-gray-600 dark:text-gray-400 ${color}`}
                  aria-label={label}
                >
                  <Icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Bottom Section */}
        <motion.div
          variants={itemVariants}
          className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700"
        >
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              © {new Date().getFullYear()} Sahil Salaria. All rights reserved.
            </p>
            <div className="flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400">
              <span>Built with</span>
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <Heart className="w-4 h-4 text-red-500" />
              </motion.div>
              <span>using React & TailwindCSS</span>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.footer>
  );
};

export default Footer;