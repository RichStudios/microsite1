import React from 'react';
import Head from 'next/head';
import { 
  FiTarget, 
  FiShield, 
  FiUsers, 
  FiTrendingUp, 
  FiAward, 
  FiHeart,
  FiCheck,
  FiExternalLink,
  FiMail,
  FiPhone
} from 'react-icons/fi';

// Components
import Layout from '../components/layout/Layout';

// Utils
import { trackButtonClick } from '../utils/analytics';

const AboutPage: React.FC = () => {
  const features = [
    {
      icon: FiShield,
      title: 'Independent Reviews',
      description: 'We provide unbiased, honest reviews based on thorough testing and analysis of each bookmaker.'
    },
    {
      icon: FiTrendingUp,
      title: 'Real-Time Data',
      description: 'Our comparison data is updated regularly to ensure you always have the latest information.'
    },
    {
      icon: FiUsers,
      title: 'Expert Team',
      description: 'Our reviewers are experienced bettors who understand what matters most to Kenyan players.'
    },
    {
      icon: FiTarget,
      title: 'Kenyan Focus',
      description: 'We specialize in bookmakers that serve Kenya, with emphasis on M-Pesa and local sports.'
    },
    {
      icon: FiAward,
      title: 'Quality Standards',
      description: 'We only recommend licensed bookmakers that meet our strict quality and safety criteria.'
    },
    {
      icon: FiHeart,
      title: 'Player First',
      description: 'Your success and safety are our top priorities. We always put players interests first.'
    }
  ];

  const howItWorks = [
    {
      step: '1',
      title: 'Research & Testing',
      description: 'Our team thoroughly tests each bookmaker, from registration to withdrawal, evaluating every aspect of the betting experience.'
    },
    {
      step: '2',
      title: 'Comprehensive Analysis',
      description: 'We analyze odds, bonuses, payment methods, customer service, and mobile experience to create detailed reviews.'
    },
    {
      step: '3',
      title: 'Regular Updates',
      description: 'We continuously monitor bookmakers and update our reviews to reflect any changes in their services or offers.'
    },
    {
      step: '4',
      title: 'Transparent Ratings',
      description: 'Our ratings are based on objective criteria and real user feedback, ensuring complete transparency.'
    }
  ];

  const values = [
    {
      title: 'Transparency',
      description: 'We clearly disclose our affiliate relationships and maintain editorial independence in all our reviews.'
    },
    {
      title: 'Accuracy',
      description: 'We verify all information and update our content regularly to ensure it remains current and accurate.'
    },
    {
      title: 'Responsibility',
      description: 'We promote responsible gambling and provide resources for players who need help managing their betting.'
    },
    {
      title: 'Innovation',
      description: 'We continuously improve our platform to provide better tools and information for our users.'
    }
  ];

  return (
    <Layout>
      <Head>
        <title>About BetCompare.co.ke - Your Trusted Betting Comparison Platform</title>
        <meta name="description" content="Learn about BetCompare.co.ke's mission to help Kenyan bettors find the best bookmakers through independent reviews and comprehensive comparisons." />
        <meta name="keywords" content="about BetCompare, betting comparison Kenya, bookmaker reviews, mission, team" />
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-primary to-primary-dark text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center">
              <h1 className="text-4xl lg:text-5xl font-heading font-bold mb-6">
                About BetCompare.co.ke
              </h1>
              <p className="text-xl text-primary-100 max-w-3xl mx-auto mb-8">
                Your trusted guide to finding the best betting sites in Kenya. We provide independent reviews and comprehensive comparisons to help you make informed decisions.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="/compare"
                  className="btn btn-secondary btn-lg"
                  onClick={() => trackButtonClick('compare_bookmakers', 'about_page')}
                >
                  Compare Bookmakers
                </a>
                <a
                  href="/contact"
                  className="btn btn-outline btn-lg border-white text-white hover:bg-white hover:text-primary"
                  onClick={() => trackButtonClick('contact_us', 'about_page')}
                >
                  Contact Us
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Mission Section */}
        <div className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-heading font-bold text-gray-900 mb-4">
                Our Mission
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                To empower Kenyan bettors with accurate, unbiased information that helps them choose the best bookmakers for their needs while promoting responsible gambling.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="bg-primary-100 rounded-lg p-3">
                      <FiTarget className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Clear Mission
                      </h3>
                      <p className="text-gray-600">
                        We exist to make betting safer, more transparent, and more enjoyable for everyone in Kenya by providing accurate, up-to-date information about betting sites.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="bg-secondary-100 rounded-lg p-3">
                      <FiShield className="h-6 w-6 text-secondary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Player Protection
                      </h3>
                      <p className="text-gray-600">
                        We only recommend licensed, regulated bookmakers and provide resources for responsible gambling to keep players safe.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="bg-warning-100 rounded-lg p-3">
                      <FiUsers className="h-6 w-6 text-warning" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Community Focus
                      </h3>
                      <p className="text-gray-600">
                        We understand the unique needs of Kenyan bettors and focus on factors that matter most to our community.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-soft p-8">
                <h3 className="text-2xl font-heading font-bold text-gray-900 mb-6">
                  Why Choose BetCompare.co.ke?
                </h3>
                <ul className="space-y-4">
                  <li className="flex items-start space-x-3">
                    <FiCheck className="h-5 w-5 text-success-500 mt-0.5" />
                    <span className="text-gray-700">Independent, unbiased reviews</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <FiCheck className="h-5 w-5 text-success-500 mt-0.5" />
                    <span className="text-gray-700">Expert analysis of odds and bonuses</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <FiCheck className="h-5 w-5 text-success-500 mt-0.5" />
                    <span className="text-gray-700">Focus on M-Pesa and local payment methods</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <FiCheck className="h-5 w-5 text-success-500 mt-0.5" />
                    <span className="text-gray-700">Regular updates and real-time data</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <FiCheck className="h-5 w-5 text-success-500 mt-0.5" />
                    <span className="text-gray-700">Commitment to responsible gambling</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-heading font-bold text-gray-900 mb-4">
                What Makes Us Different
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                We go beyond basic comparisons to provide the insights and tools you need to make the best betting decisions.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div key={index} className="text-center">
                  <div className="bg-gray-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* How It Works Section */}
        <div className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-heading font-bold text-gray-900 mb-4">
                How Our Reviews Work
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Our comprehensive review process ensures you get accurate, reliable information about every bookmaker we feature.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {howItWorks.map((item, index) => (
                <div key={index} className="text-center">
                  <div className="bg-primary text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                    {item.step}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-600">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-heading font-bold text-gray-900 mb-4">
                Our Values
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                These core principles guide everything we do at BetCompare.co.ke.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {values.map((value, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {value.title}
                  </h3>
                  <p className="text-gray-600">
                    {value.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Responsible Gambling Section */}
        <div className="py-16 bg-warning-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-heading font-bold text-gray-900 mb-4">
                Responsible Gambling
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                We are committed to promoting safe, responsible gambling practices and providing resources for those who need help.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div>
                <h3 className="text-2xl font-heading font-bold text-gray-900 mb-6">
                  Our Commitment
                </h3>
                <ul className="space-y-4">
                  <li className="flex items-start space-x-3">
                    <FiCheck className="h-5 w-5 text-success-500 mt-0.5" />
                    <span className="text-gray-700">We only recommend licensed, regulated bookmakers</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <FiCheck className="h-5 w-5 text-success-500 mt-0.5" />
                    <span className="text-gray-700">We provide educational content about responsible gambling</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <FiCheck className="h-5 w-5 text-success-500 mt-0.5" />
                    <span className="text-gray-700">We highlight tools for setting limits and self-exclusion</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <FiCheck className="h-5 w-5 text-success-500 mt-0.5" />
                    <span className="text-gray-700">We never target vulnerable populations</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white rounded-lg shadow-soft p-8">
                <h3 className="text-2xl font-heading font-bold text-gray-900 mb-6">
                  Get Help
                </h3>
                <p className="text-gray-600 mb-6">
                  If you or someone you know is struggling with gambling addiction, help is available:
                </p>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <FiPhone className="h-5 w-5 text-primary" />
                    <span className="text-gray-700">GamCare Helpline: 0808 8020 133</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <FiMail className="h-5 w-5 text-primary" />
                    <span className="text-gray-700">help@gamcare.org.uk</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <FiExternalLink className="h-5 w-5 text-primary" />
                    <a href="https://www.begambleaware.org" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      BeGambleAware.org
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-heading font-bold text-gray-900 mb-4">
                Get in Touch
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Have questions, suggestions, or feedback? We'd love to hear from you.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-primary-100 rounded-lg p-4 w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <FiMail className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Email Us</h3>
                <p className="text-gray-600 mb-3">Get in touch with our team</p>
                <a href="mailto:info@betcompare.co.ke" className="text-primary hover:underline">
                  info@betcompare.co.ke
                </a>
              </div>

              <div className="text-center">
                <div className="bg-secondary-100 rounded-lg p-4 w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <FiUsers className="h-8 w-8 text-secondary" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Community</h3>
                <p className="text-gray-600 mb-3">Join our Telegram community</p>
                <a href="#" className="text-primary hover:underline">
                  @BetCompareKenya
                </a>
              </div>

              <div className="text-center">
                <div className="bg-warning-100 rounded-lg p-4 w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <FiExternalLink className="h-8 w-8 text-warning" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Partnership</h3>
                <p className="text-gray-600 mb-3">Business inquiries</p>
                <a href="mailto:partnerships@betcompare.co.ke" className="text-primary hover:underline">
                  partnerships@betcompare.co.ke
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="py-16 bg-gradient-to-r from-primary to-primary-dark text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-heading font-bold mb-4">
              Ready to Find Your Perfect Bookmaker?
            </h2>
            <p className="text-xl text-primary-100 mb-8">
              Use our comprehensive comparison tools to find the best betting site for your needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/compare"
                className="btn btn-secondary btn-lg"
                onClick={() => trackButtonClick('compare_cta', 'about_page')}
              >
                Compare Bookmakers
              </a>
              <a
                href="/bonuses"
                className="btn btn-outline btn-lg border-white text-white hover:bg-white hover:text-primary"
                onClick={() => trackButtonClick('bonuses_cta', 'about_page')}
              >
                View Bonuses
              </a>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AboutPage; 