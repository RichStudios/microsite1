import React from 'react';
import Layout from '../components/layout/Layout';
import SEOHead from '../components/seo/SEOHead';

const BonusesPage: React.FC = () => {
  const bonuses = [
    {
      id: 1,
      bookmaker: 'Betway',
      logo: '/images/logos/betway-logo.png',
      bonus: 'Up to KSh 10,000 Welcome Bonus',
      wagering: '5x',
      minDeposit: 'KSh 100',
      mpesa: true,
      featured: true
    },
    {
      id: 2,
      bookmaker: 'MelBet',
      logo: '/images/logos/melbet-logo.png',
      bonus: '100% up to KSh 15,000',
      wagering: '4x',
      minDeposit: 'KSh 50',
      mpesa: true,
      featured: true
    },
    {
      id: 3,
      bookmaker: '1xBet',
      logo: '/images/logos/1xbet-logo.png',
      bonus: 'KSh 20,000 Welcome Package',
      wagering: '6x',
      minDeposit: 'KSh 100',
      mpesa: true,
      featured: false
    },
    {
      id: 4,
      bookmaker: 'Betwinner',
      logo: '/images/logos/betwinner-logo.png',
      bonus: '100% up to KSh 12,000',
      wagering: '5x',
      minDeposit: 'KSh 80',
      mpesa: true,
      featured: false
    }
  ];

  return (
    <Layout>
      <SEOHead
        title="Best Betting Bonuses in Kenya 2024 - BetCompare.co.ke"
        description="Compare the best betting bonuses and welcome offers from top Kenyan bookmakers. Find M-Pesa compatible bonuses with low wagering requirements."
      />

      <div className="bg-primary-navy text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-6">Best Betting Bonuses in Kenya</h1>
            <p className="text-xl opacity-90">
              Compare welcome bonuses, free bets, and promotions from Kenya's top bookmakers
            </p>
          </div>
        </div>
      </div>

      <div className="py-16">
        <div className="container mx-auto px-4">
          {/* Featured Bonuses */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-primary-navy mb-8 text-center">Featured Bonuses</h2>
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              {bonuses.filter(bonus => bonus.featured).map(bonus => (
                <div key={bonus.id} className="bg-white border-2 border-primary-orange rounded-xl p-6 hover:shadow-lg transition-shadow duration-300">
                  <div className="flex items-center gap-4 mb-4">
                    <img src={bonus.logo} alt={`${bonus.bookmaker} logo`} className="w-16 h-16 rounded-lg" />
                    <div>
                      <h3 className="text-xl font-semibold text-primary-navy">{bonus.bookmaker}</h3>
                      <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded">
                        M-Pesa Ready
                      </span>
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-primary-orange mb-4">{bonus.bonus}</p>
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                      <p className="text-sm text-gray-600">Wagering</p>
                      <p className="font-semibold">{bonus.wagering}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Min Deposit</p>
                      <p className="font-semibold">{bonus.minDeposit}</p>
                    </div>
                  </div>
                  <button className="w-full bg-primary-orange text-white py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors duration-200">
                    Claim Bonus
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* All Bonuses Table */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 border-b">
              <h2 className="text-2xl font-bold text-primary-navy">All Available Bonuses</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left py-3 px-6 font-semibold text-gray-700">Bookmaker</th>
                    <th className="text-left py-3 px-6 font-semibold text-gray-700">Bonus</th>
                    <th className="text-left py-3 px-6 font-semibold text-gray-700">Wagering</th>
                    <th className="text-left py-3 px-6 font-semibold text-gray-700">Min Deposit</th>
                    <th className="text-left py-3 px-6 font-semibold text-gray-700">M-Pesa</th>
                    <th className="text-left py-3 px-6 font-semibold text-gray-700">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {bonuses.map(bonus => (
                    <tr key={bonus.id} className="border-b hover:bg-gray-50">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <img src={bonus.logo} alt={`${bonus.bookmaker} logo`} className="w-10 h-10 rounded" />
                          <span className="font-medium">{bonus.bookmaker}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-primary-orange font-semibold">{bonus.bonus}</td>
                      <td className="py-4 px-6">{bonus.wagering}</td>
                      <td className="py-4 px-6">{bonus.minDeposit}</td>
                      <td className="py-4 px-6">
                        {bonus.mpesa ? (
                          <span className="text-green-500">✓</span>
                        ) : (
                          <span className="text-red-500">✗</span>
                        )}
                      </td>
                      <td className="py-4 px-6">
                        <button className="bg-primary-orange text-white px-4 py-2 rounded font-medium text-sm hover:bg-orange-600 transition-colors duration-200">
                          Claim
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Bonus Tips */}
          <div className="mt-12 bg-blue-50 rounded-xl p-8">
            <h3 className="text-2xl font-bold text-primary-navy mb-6">Bonus Tips</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-lg mb-3">What to Look For:</h4>
                <ul className="space-y-2 text-gray-600">
                  <li>• Low wagering requirements (5x or less)</li>
                  <li>• M-Pesa deposit compatibility</li>
                  <li>• Reasonable minimum deposit amounts</li>
                  <li>• Clear terms and conditions</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-lg mb-3">How to Claim:</h4>
                <ol className="space-y-2 text-gray-600">
                  <li>1. Click "Claim Bonus" for your chosen offer</li>
                  <li>2. Register a new account</li>
                  <li>3. Make your first deposit via M-Pesa</li>
                  <li>4. Bonus will be credited automatically</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default BonusesPage;