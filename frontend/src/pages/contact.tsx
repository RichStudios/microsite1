import React, { useState } from 'react';
import { FiMail, FiPhone, FiMapPin, FiMessageSquare, FiSend, FiClock, FiUser, FiAlertCircle } from 'react-icons/fi';
import { FaTelegram, FaWhatsapp, FaTwitter } from 'react-icons/fa';

// Components
import Layout from '../components/layout/Layout';

// Utils
import { trackButtonClick } from '../utils/analytics';

interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
  category: string;
}

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState<ContactForm>({
    name: '',
    email: '',
    subject: '',
    message: '',
    category: 'general'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errors, setErrors] = useState<Partial<ContactForm>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name as keyof ContactForm]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<ContactForm> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitStatus('success');
        setFormData({ name: '', email: '', subject: '', message: '', category: 'general' });
        trackButtonClick('contact_form_submit', 'success');
      } else {
        setSubmitStatus('error');
        trackButtonClick('contact_form_submit', 'error');
      }
    } catch (error) {
      setSubmitStatus('error');
      trackButtonClick('contact_form_submit', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactMethods = [
    {
      icon: FiMail,
      title: 'Email',
      value: 'hello@betcompare.co.ke',
      description: 'Send us an email for general inquiries',
      action: () => window.open('mailto:hello@betcompare.co.ke')
    },
    {
      icon: FaTelegram,
      title: 'Telegram',
      value: '@BetCompareKenya',
      description: 'Join our Telegram for quick support',
      action: () => {
        trackButtonClick('contact_telegram', 'header');
        window.open('https://t.me/BetCompareKenya');
      }
    },
    {
      icon: FaWhatsapp,
      title: 'WhatsApp',
      value: '+254 700 000 000',
      description: 'WhatsApp us for instant support',
      action: () => {
        trackButtonClick('contact_whatsapp', 'header');
        window.open('https://wa.me/254700000000');
      }
    },
    {
      icon: FaTwitter,
      title: 'Twitter',
      value: '@BetCompareKE',
      description: 'Follow us for updates and news',
      action: () => {
        trackButtonClick('contact_twitter', 'header');
        window.open('https://twitter.com/BetCompareKE');
      }
    }
  ];

  const faqs = [
    {
      question: 'How do I report an issue with a bookmaker?',
      answer: 'Use our contact form with the "Report Issue" category, or send us an email with details about the problem you encountered.'
    },
    {
      question: 'Can you help me choose the best bookmaker?',
      answer: 'Absolutely! Our comparison tool and reviews are designed to help you make informed decisions. You can also contact us for personalized recommendations.'
    },
    {
      question: 'How often do you update your information?',
      answer: 'We update our bookmaker information, odds, and bonuses daily to ensure you have the most current data available.'
    },
    {
      question: 'Do you offer affiliate partnerships?',
      answer: 'Yes, we work with selected bookmakers. Contact us with details about your services for partnership opportunities.'
    }
  ];

  return (
    <Layout
      title="Contact Us - BetCompare.co.ke"
      description="Get in touch with BetCompare.co.ke for support, partnerships, or general inquiries. Multiple ways to reach our team including email, Telegram, and WhatsApp."
      keywords="contact BetCompare, betting site support, bookmaker comparison help, Kenya betting contact"
    >
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-primary-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold mb-6">
              Contact Us
            </h1>
            <p className="text-xl md:text-2xl text-primary-100 max-w-3xl mx-auto mb-8">
              Have questions about betting sites or need help choosing the right bookmaker? 
              We're here to help you make informed decisions.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-heading font-bold text-primary mb-4">
              Get in Touch
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Choose your preferred method to reach out to our team. We're available to help with any questions or concerns.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {contactMethods.map((method, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center hover:shadow-md transition-shadow duration-300 cursor-pointer"
                onClick={method.action}
              >
                <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <method.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-heading font-bold text-gray-900 mb-2">
                  {method.title}
                </h3>
                <p className="text-primary font-medium mb-2">{method.value}</p>
                <p className="text-gray-600 text-sm">{method.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-16 bg-neutral-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-heading font-bold text-primary mb-4">
              Send Us a Message
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Fill out the form below and we'll get back to you within 24 hours.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`block w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                      errors.name ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Your full name"
                  />
                  {errors.name && (
                    <p className="mt-2 text-sm text-red-600 flex items-center">
                      <FiAlertCircle className="w-4 h-4 mr-1" />
                      {errors.name}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`block w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                      errors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="your@email.com"
                  />
                  {errors.email && (
                    <p className="mt-2 text-sm text-red-600 flex items-center">
                      <FiAlertCircle className="w-4 h-4 mr-1" />
                      {errors.email}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="general">General Inquiry</option>
                    <option value="support">Technical Support</option>
                    <option value="partnership">Partnership</option>
                    <option value="report">Report Issue</option>
                    <option value="feedback">Feedback</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                    Subject *
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    className={`block w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                      errors.subject ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Brief description of your inquiry"
                  />
                  {errors.subject && (
                    <p className="mt-2 text-sm text-red-600 flex items-center">
                      <FiAlertCircle className="w-4 h-4 mr-1" />
                      {errors.subject}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={6}
                  value={formData.message}
                  onChange={handleInputChange}
                  className={`block w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                    errors.message ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Please provide detailed information about your inquiry..."
                />
                {errors.message && (
                  <p className="mt-2 text-sm text-red-600 flex items-center">
                    <FiAlertCircle className="w-4 h-4 mr-1" />
                    {errors.message}
                  </p>
                )}
              </div>

              {/* Submit Status */}
              {submitStatus === 'success' && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center mr-3">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <p className="text-green-800 font-medium">
                      Message sent successfully! We'll get back to you within 24 hours.
                    </p>
                  </div>
                </div>
              )}

              {submitStatus === 'error' && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <FiAlertCircle className="w-5 h-5 text-red-500 mr-3" />
                    <p className="text-red-800 font-medium">
                      Failed to send message. Please try again or contact us directly.
                    </p>
                  </div>
                </div>
              )}

              <div className="text-center">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn btn-primary btn-lg inline-flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <FiSend className="mr-2 h-5 w-5" />
                      Send Message
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Business Hours & Info */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Business Hours */}
            <div>
              <h3 className="text-2xl font-heading font-bold text-primary mb-6">
                Business Hours
              </h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <FiClock className="w-5 h-5 text-primary mr-3" />
                  <div>
                    <p className="font-medium text-gray-900">Monday - Friday</p>
                    <p className="text-gray-600">9:00 AM - 6:00 PM EAT</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <FiClock className="w-5 h-5 text-primary mr-3" />
                  <div>
                    <p className="font-medium text-gray-900">Saturday</p>
                    <p className="text-gray-600">10:00 AM - 4:00 PM EAT</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <FiClock className="w-5 h-5 text-primary mr-3" />
                  <div>
                    <p className="font-medium text-gray-900">Sunday</p>
                    <p className="text-gray-600">Closed</p>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <h4 className="text-lg font-heading font-bold text-gray-900 mb-4">
                  Response Times
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Email:</span>
                    <span className="font-medium text-gray-900">Within 24 hours</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Telegram:</span>
                    <span className="font-medium text-gray-900">Within 2 hours</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">WhatsApp:</span>
                    <span className="font-medium text-gray-900">Within 1 hour</span>
                  </div>
                </div>
              </div>
            </div>

            {/* FAQ */}
            <div>
              <h3 className="text-2xl font-heading font-bold text-primary mb-6">
                Frequently Asked Questions
              </h3>
              <div className="space-y-6">
                {faqs.map((faq, index) => (
                  <div key={index} className="border-l-4 border-primary pl-4">
                    <h4 className="font-medium text-gray-900 mb-2">{faq.question}</h4>
                    <p className="text-gray-600 text-sm">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary to-primary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-heading font-bold text-white mb-4">
            Need Help Choosing a Bookmaker?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Use our comparison tool to find the perfect betting site for your needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => {
                trackButtonClick('compare_bookmakers_cta', 'contact_bottom');
                window.location.href = '/compare';
              }}
              className="btn btn-secondary btn-lg inline-flex items-center"
            >
              <FiMessageSquare className="mr-2 h-5 w-5" />
              Compare Bookmakers
            </button>
            <button
              onClick={() => {
                trackButtonClick('view_reviews_cta', 'contact_bottom');
                window.location.href = '/reviews';
              }}
              className="btn btn-outline btn-lg inline-flex items-center text-white border-white hover:bg-white hover:text-primary"
            >
              <FiUser className="mr-2 h-5 w-5" />
              Read Reviews
            </button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ContactPage; 