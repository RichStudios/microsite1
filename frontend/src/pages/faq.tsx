import React, { useState } from 'react';
import Head from 'next/head';
import { FiPlus, FiMinus, FiSearch, FiHelpCircle, FiShield, FiTrendingUp, FiDollarSign, FiSettings } from 'react-icons/fi';

// Components
import Layout from '../components/layout/Layout';

// Utils
import { trackButtonClick } from '../utils/analytics';

interface FAQItem {
  id: number;
  question: string;
  answer: string;
  category: string;
}

const FAQPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedItems, setExpandedItems] = useState<number[]>([]);

  const categories = [
    { id: 'all', name: 'All Questions', icon: FiHelpCircle },
    { id: 'getting-started', name: 'Getting Started', icon: FiSettings },
    { id: 'betting-basics', name: 'Betting Basics', icon: FiTrendingUp },
    { id: 'bonuses', name: 'Bonuses & Promotions', icon: FiDollarSign },
    { id: 'safety', name: 'Safety & Security', icon: FiShield },
  ];

  const faqItems: FAQItem[] = [
    // Getting Started
    {
      id: 1,
      question: 'How do I choose the right bookmaker?',
      answer: 'Consider factors like licensing, odds quality, bonus offers, payment methods (especially M-Pesa), customer support, and mobile app quality. Our comparison tool helps you evaluate these factors side by side.',
      category: 'getting-started'
    },
    {
      id: 2,
      question: 'What is M-Pesa and why is it important for betting?',
      answer: 'M-Pesa is Kenya\'s mobile money service that allows instant deposits and withdrawals. It\'s crucial for betting because it enables fast, secure transactions without needing a bank account. Most reputable bookmakers in Kenya support M-Pesa.',
      category: 'getting-started'
    },
    {
      id: 3,
      question: 'How do I register with a bookmaker?',
      answer: 'Registration typically involves: 1) Clicking the "Join Now" button, 2) Providing personal details (name, phone, email), 3) Verifying your identity with an ID document, 4) Making your first deposit. The process usually takes 5-10 minutes.',
      category: 'getting-started'
    },
    {
      id: 4,
      question: 'What documents do I need to verify my account?',
      answer: 'You\'ll typically need a valid Kenyan ID card or passport, and sometimes proof of address like a utility bill. Some bookmakers may also require a photo of yourself holding your ID for additional security.',
      category: 'getting-started'
    },

    // Betting Basics
    {
      id: 5,
      question: 'What are betting odds and how do they work?',
      answer: 'Betting odds represent the probability of an outcome and determine your potential winnings. Higher odds mean lower probability but higher potential returns. For example, odds of 2.0 mean you\'ll double your money if you win.',
      category: 'betting-basics'
    },
    {
      id: 6,
      question: 'What\'s the difference between decimal and fractional odds?',
      answer: 'Decimal odds (like 2.50) show your total return including stake. Fractional odds (like 3/2) show profit relative to stake. Most Kenyan bookmakers use decimal odds as they\'re easier to understand.',
      category: 'betting-basics'
    },
    {
      id: 7,
      question: 'What is a betting market?',
      answer: 'A betting market is a specific type of bet you can place on an event. Common markets include: Match Winner, Over/Under Goals, Both Teams to Score, Handicap betting, and First Goal Scorer.',
      category: 'betting-basics'
    },
    {
      id: 8,
      question: 'How do I place a bet?',
      answer: 'To place a bet: 1) Select your sport and event, 2) Choose your market and odds, 3) Enter your stake amount, 4) Review your bet slip, 5) Confirm your bet. Make sure you understand the market before placing your bet.',
      category: 'betting-basics'
    },
    {
      id: 9,
      question: 'What is cash out and how does it work?',
      answer: 'Cash out allows you to settle your bet before the event ends, guaranteeing a profit or minimizing losses. Not all bookmakers offer this feature, and it\'s usually available for popular markets only.',
      category: 'betting-basics'
    },
    {
      id: 10,
      question: 'What are live/in-play bets?',
      answer: 'Live betting allows you to place bets while the event is happening. Odds change constantly based on what\'s happening in the game. This requires quick decision-making and good knowledge of the sport.',
      category: 'betting-basics'
    },

    // Bonuses
    {
      id: 11,
      question: 'What is a welcome bonus and how does it work?',
      answer: 'A welcome bonus is an incentive for new customers, usually matching your first deposit up to a certain amount. For example, a 100% bonus up to KES 10,000 means if you deposit KES 10,000, you get an additional KES 10,000 to bet with.',
      category: 'bonuses'
    },
    {
      id: 12,
      question: 'What are wagering requirements?',
      answer: 'Wagering requirements determine how many times you must bet your bonus before you can withdraw any winnings. A 5x wagering requirement on a KES 1,000 bonus means you must place KES 5,000 worth of bets.',
      category: 'bonuses'
    },
    {
      id: 13,
      question: 'What\'s the difference between a free bet and a deposit bonus?',
      answer: 'A free bet is a bet you can place without using your own money. A deposit bonus adds extra funds to your account when you deposit. Free bets usually have lower wagering requirements.',
      category: 'bonuses'
    },
    {
      id: 14,
      question: 'Can I withdraw my bonus immediately?',
      answer: 'No, you cannot withdraw bonus funds immediately. You must meet the wagering requirements first. Only the winnings from bonus bets can be withdrawn, not the bonus amount itself.',
      category: 'bonuses'
    },

    // Safety & Security
    {
      id: 15,
      question: 'How do I know if a bookmaker is safe and legitimate?',
      answer: 'Look for: 1) Valid gambling license, 2) SSL encryption on their website, 3) Positive user reviews, 4) Responsible gambling tools, 5) Clear terms and conditions. We only recommend licensed, regulated bookmakers.',
      category: 'safety'
    },
    {
      id: 16,
      question: 'What licenses should I look for?',
      answer: 'For Kenya, look for BCLB (Betting Control and Licensing Board) license. International licenses like Malta Gaming Authority, UK Gambling Commission, and Curacao eGaming are also reputable.',
      category: 'safety'
    },
    {
      id: 17,
      question: 'Is online betting legal in Kenya?',
      answer: 'Yes, online betting is legal in Kenya for licensed operators. The BCLB regulates the industry. You must be 18 or older to bet legally. Always check that your chosen bookmaker holds a valid license.',
      category: 'safety'
    },
    {
      id: 18,
      question: 'How can I bet responsibly?',
      answer: 'Set deposit limits, time limits, and loss limits. Never bet more than you can afford to lose. Don\'t chase losses. Take regular breaks. Use self-exclusion tools if needed. Seek help if gambling becomes a problem.',
      category: 'safety'
    },
    {
      id: 19,
      question: 'What should I do if I have a problem with a bookmaker?',
      answer: 'First, contact the bookmaker\'s customer support. If unresolved, contact the licensing authority (BCLB for Kenyan operators). Keep records of all communications. You can also file complaints with gambling ombudsman services.',
      category: 'safety'
    },

    // Additional Questions
    {
      id: 20,
      question: 'How long do withdrawals take?',
      answer: 'Withdrawal times vary by bookmaker and payment method. M-Pesa withdrawals are usually instant to 24 hours. Bank transfers may take 1-5 business days. Check our reviews for specific withdrawal times.',
      category: 'getting-started'
    },
    {
      id: 21,
      question: 'Are there any fees for deposits and withdrawals?',
      answer: 'Most bookmakers don\'t charge fees for deposits. Withdrawal fees vary - some are free, others charge a small fee. M-Pesa transactions may have network fees. Check the bookmaker\'s terms for specific fee information.',
      category: 'getting-started'
    },
    {
      id: 22,
      question: 'Can I have accounts with multiple bookmakers?',
      answer: 'Yes, you can have accounts with multiple bookmakers. This allows you to compare odds and take advantage of different bonuses. However, manage your bankroll carefully across all accounts.',
      category: 'getting-started'
    },
    {
      id: 23,
      question: 'What is the minimum age for betting in Kenya?',
      answer: 'The minimum age for betting in Kenya is 18 years old. All licensed bookmakers will verify your age during registration. Underage gambling is illegal and strictly prohibited.',
      category: 'safety'
    },
    {
      id: 24,
      question: 'Can I bet on my mobile phone?',
      answer: 'Yes, most bookmakers offer mobile betting through mobile apps or mobile-optimized websites. Mobile betting allows you to place bets anywhere, anytime. Check our reviews for mobile app quality ratings.',
      category: 'getting-started'
    }
  ];

  const filteredFAQs = faqItems.filter(item => {
    const matchesSearch = item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleExpanded = (id: number) => {
    setExpandedItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  return (
    <Layout>
      <Head>
        <title>FAQ - Betting Guide & Help Center | BetCompare.co.ke</title>
        <meta name="description" content="Get answers to common betting questions. Learn about odds, bonuses, safety, and how to choose the best bookmaker in Kenya." />
        <meta name="keywords" content="betting FAQ, betting guide Kenya, how to bet, betting help, odds explained" />
      </Head>

      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-heading font-bold text-primary mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Get answers to common betting questions and learn everything you need to know about betting in Kenya.
            </p>
          </div>

          {/* Search and Filter */}
          <div className="bg-white rounded-lg shadow-soft p-6 mb-8">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search questions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                  />
                </div>
              </div>

              {/* Category Filter */}
              <div className="lg:w-64">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                >
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Category Navigation */}
          <div className="flex flex-wrap gap-4 mb-8">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-primary text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                <category.icon className="h-4 w-4" />
                <span>{category.name}</span>
              </button>
            ))}
          </div>

          {/* FAQ Items */}
          <div className="space-y-4">
            {filteredFAQs.map(item => (
              <div key={item.id} className="bg-white rounded-lg shadow-soft overflow-hidden">
                <button
                  onClick={() => toggleExpanded(item.id)}
                  className="w-full px-6 py-4 text-left hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-900 pr-4">
                      {item.question}
                    </h3>
                    {expandedItems.includes(item.id) ? (
                      <FiMinus className="h-5 w-5 text-gray-500 flex-shrink-0" />
                    ) : (
                      <FiPlus className="h-5 w-5 text-gray-500 flex-shrink-0" />
                    )}
                  </div>
                </button>
                {expandedItems.includes(item.id) && (
                  <div className="px-6 pb-4">
                    <div className="pt-4 border-t border-gray-200">
                      <p className="text-gray-600 leading-relaxed">
                        {item.answer}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* No Results */}
          {filteredFAQs.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <FiHelpCircle className="h-12 w-12 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No questions found</h3>
              <p className="text-gray-600">
                Try adjusting your search or browse a different category.
              </p>
            </div>
          )}

          {/* Help Section */}
          <div className="mt-16 bg-white rounded-lg shadow-soft p-8">
            <div className="text-center">
              <h2 className="text-2xl font-heading font-bold text-gray-900 mb-4">
                Still Have Questions?
              </h2>
              <p className="text-gray-600 mb-8">
                Can't find what you're looking for? Our team is here to help you with any betting-related questions.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="/contact"
                  className="btn btn-primary btn-lg"
                  onClick={() => trackButtonClick('contact_faq', 'faq_page')}
                >
                  Contact Support
                </a>
                <a
                  href="/blog"
                  className="btn btn-outline btn-lg"
                  onClick={() => trackButtonClick('read_guides', 'faq_page')}
                >
                  Read Our Guides
                </a>
              </div>
            </div>
          </div>

          {/* Popular Topics */}
          <div className="mt-16">
            <h2 className="text-2xl font-heading font-bold text-gray-900 mb-8 text-center">
              Popular Topics
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow-soft p-6 text-center">
                <div className="bg-primary-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <FiTrendingUp className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Understanding Odds
                </h3>
                <p className="text-gray-600 text-sm">
                  Learn how betting odds work and how to calculate your potential winnings.
                </p>
              </div>

              <div className="bg-white rounded-lg shadow-soft p-6 text-center">
                <div className="bg-secondary-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <FiDollarSign className="h-8 w-8 text-secondary" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Bonus Terms
                </h3>
                <p className="text-gray-600 text-sm">
                  Understand wagering requirements and how to claim your bonuses.
                </p>
              </div>

              <div className="bg-white rounded-lg shadow-soft p-6 text-center">
                <div className="bg-success-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <FiShield className="h-8 w-8 text-success" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Safe Betting
                </h3>
                <p className="text-gray-600 text-sm">
                  Tips for responsible gambling and choosing legitimate bookmakers.
                </p>
              </div>

              <div className="bg-white rounded-lg shadow-soft p-6 text-center">
                <div className="bg-warning-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <FiSettings className="h-8 w-8 text-warning" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Account Setup
                </h3>
                <p className="text-gray-600 text-sm">
                  Step-by-step guide to creating and verifying your betting account.
                </p>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="mt-16 text-center">
            <div className="bg-gradient-to-r from-primary to-primary-dark text-white rounded-lg p-8">
              <h2 className="text-2xl font-heading font-bold mb-4">
                Ready to Start Betting?
              </h2>
              <p className="text-primary-100 mb-6">
                Now that you know the basics, find the perfect bookmaker for your betting needs.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="/compare"
                  className="btn btn-secondary btn-lg"
                  onClick={() => trackButtonClick('compare_faq_cta', 'faq_page')}
                >
                  Compare Bookmakers
                </a>
                <a
                  href="/bonuses"
                  className="btn btn-outline btn-lg border-white text-white hover:bg-white hover:text-primary"
                  onClick={() => trackButtonClick('bonuses_faq_cta', 'faq_page')}
                >
                  View Bonuses
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default FAQPage; 