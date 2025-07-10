import React from 'react';
import Head from 'next/head';
import Layout from '../components/layout/Layout';
import HeroSection from '../components/home/HeroSection';
import FeaturedBookmakers from '../components/home/FeaturedBookmakers';
import LatestBonuses from '../components/home/LatestBonuses';
import WhyChooseUs from '../components/home/WhyChooseUs';
import StatsSection from '../components/home/StatsSection';
import ComparisonPreview from '../components/home/ComparisonPreview';
import BlogPreview from '../components/home/BlogPreview';

const HomePage: React.FC = () => {
  return (
    <>
      <Head>
        <title>BetCompare Kenya - Compare Best Betting Sites & Odds</title>
        <meta 
          name="description" 
          content="Compare Kenya's top betting sites. Find the best odds, M-Pesa bonuses, and reviews before you bet. Licensed bookmakers with fast payouts." 
        />
        <meta name="keywords" content="betting sites Kenya, M-Pesa betting, sports betting, bookmaker comparison, best odds Kenya" />
        <meta property="og:title" content="BetCompare Kenya - Compare Best Betting Sites & Odds" />
        <meta property="og:description" content="Find Kenya's best betting sites with M-Pesa support, great bonuses and reliable payouts" />
        <meta property="og:image" content="/images/og-betcompare-home.jpg" />
        <meta property="og:url" content="https://betcompare.co.ke" />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="canonical" href="https://betcompare.co.ke" />
      </Head>

      <Layout>
        <HeroSection />
        <FeaturedBookmakers />
        <WhyChooseUs />
        <LatestBonuses />
        <StatsSection />
        <ComparisonPreview />
        <BlogPreview />
      </Layout>
    </>
  );
};

export default HomePage;