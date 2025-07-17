import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaEnvelope, FaCheckCircle, FaExclamationTriangle, FaPaperPlane, FaPhone, FaMapMarkerAlt, FaGithub, FaLinkedin, FaTwitter, FaInstagram } from 'react-icons/fa';
import Navbar from '../components/Navbar';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [status, setStatus] = useState({
    type: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: 'loading', message: 'Sending message...' });

    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      setStatus({
        type: 'error',
        message: 'Please fill in all fields before sending.'
      });
      setTimeout(() => setStatus({ type: '', message: '' }), 3000);
      return;
    }

    try {
      const response = await fetch('https://formspree.io/f/xjkrzkdd', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          _replyto: formData.email,
          _subject: `New contact from eduHeaven: ${formData.subject}`,
        }),
      });

      if (response.ok) {
        setStatus({
          type: 'success',
          message: 'Message sent successfully! I\'ll get back to you soon. ✉️'
        });
        setFormData({ name: '', email: '', subject: '', message: '' });
        setTimeout(() => setStatus({ type: '', message: '' }), 5000);
      } else throw new Error('Failed to send message');
    } catch (error) {
      console.error(error);
      setStatus({
        type: 'error',
        message: 'Failed to send message. Please try again or email warriorofgod2001@gmail.com.'
      });
      setTimeout(() => setStatus({ type: '', message: '' }), 7000);
    }
  };

  return (
    <>
      <Navbar />
      <div className="contact-page min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white overflow-x-hidden w-full">
        <main className="pt-24 sm:pt-28 pb-8 sm:pb-12 px-4 sm:px-6 lg:px-8 w-full max-w-full">
          <div className="max-w-4xl mx-auto w-full">
            {/* Header Section */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-8 sm:mb-12"
            >
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ duration: 1 }}
                className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-500 rounded-full mb-6"
              >
                <FaPaperPlane className="text-white text-xl" />
              </motion.div>
              
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight mb-4">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-slate-300">
                  Get in{' '}
                </span>
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-slate-300">
                  Touch
                </span>
              </h1>
              
              <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
                Have questions about <strong>eduHeaven</strong>? Suggestions? Just want to say hi? I'd love to hear from you.
              </p>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="w-full"
            >
              <div className="contact-form-container">
                {status.message && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`contact-status-message mb-6 flex items-center gap-3 text-sm ${
                      status.type === 'success' ? 'contact-status-success'
                      : status.type === 'error' ? 'contact-status-error'
                      : 'contact-status-loading'
                    }`}
                  >
                    {status.type === 'success' && <FaCheckCircle />}
                    {status.type === 'error' && <FaExclamationTriangle />}
                    {status.type === 'loading' && (
                      <motion.div
                        className="w-4 h-4 border-2 border-blue-300 border-t-transparent rounded-full animate-spin"
                      />
                    )}
                    <span>{status.message}</span>
                  </motion.div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4, duration: 0.6 }}
                    >
                      <input
                        type="text"
                        name="name"
                        placeholder="Your Name"
                        value={formData.name}
                        onChange={handleChange}
                        className="contact-form-input w-full"
                        required
                      />
                    </motion.div>
                    
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5, duration: 0.6 }}
                    >
                      <input
                        type="email"
                        name="email"
                        placeholder="Email Address"
                        value={formData.email}
                        onChange={handleChange}
                        className="contact-form-input w-full"
                        required
                      />
                    </motion.div>
                  </div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.6 }}
                  >
                    <input
                      type="text"
                      name="subject"
                      placeholder="Subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="contact-form-input w-full"
                      required
                    />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7, duration: 0.6 }}
                  >
                    <textarea
                      name="message"
                      placeholder="Write your message..."
                      value={formData.message}
                      onChange={handleChange}
                      rows={6}
                      className="contact-form-input w-full resize-none"
                      required
                    />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 0.6 }}
                  >
                    <motion.button
                      type="submit"
                      disabled={status.type === 'loading'}
                      whileTap={{ scale: 0.98 }}
                      whileHover={{ scale: status.type === 'loading' ? 1 : 1.02 }}
                      className="contact-form-button w-full flex items-center justify-center gap-2"
                    >
                      {status.type === 'loading' ? (
                        <>
                          <motion.div
                            className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"
                          />
                          <span className="text-white font-medium">Sending...</span>
                        </>
                      ) : (
                        <>
                          <FaPaperPlane className="text-sm" />
                          <span className="text-white font-medium">Send</span>
                        </>
                      )}
                    </motion.button>
                  </motion.div>
                </form>
              </div>
            </motion.div>
          </div>
        </main>

        {/* Contact Information Footer */}
        <motion.footer
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="contact-footer-section relative px-4 sm:px-6 lg:px-8 py-12 border-t border-white/10"
        >
          <div className="max-w-4xl mx-auto">
            <div className="contact-footer-container">
              <div className="text-center mb-8">
                <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                  Let's Stay Connected
                </h3>
                <p className="text-gray-300 text-sm sm:text-base">
                  Ready to collaborate? Reach out through any of these channels
                </p>
              </div>
              
              

              {/* Social Links */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9, duration: 0.6 }}
                className="contact-social-section"
              >
                <h4 className="text-center text-white text-lg font-semibold mb-4">
                  Follow Me
                </h4>
                <div className="contact-social-links">
                  <a href="https://github.com/sahoo-abhi" className="contact-social-link">
                    <FaGithub />
                  </a>
                  <a href="https://www.linkedin.com/in/abhishek-sahoo-938a692b5/" className="contact-social-link">
                    <FaLinkedin />
                  </a>
                  <a href="#" className="contact-social-link">
                    <FaTwitter />
                  </a>
                  <a href="https://www.instagram.com/warrior__of_god/" className="contact-social-link">
                    <FaInstagram />
                  </a>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.footer>
      </div>
    </>
  );
};

export default Contact;
