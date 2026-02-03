
import React, { useState, useEffect, Suspense, useCallback } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import FeaturedTrips from './components/FeaturedTrips';
import FeaturedCruises from './components/FeaturedCruises';
import ValueProps from './components/ValueProps';
import BlogSection from './components/BlogSection';
import Footer from './components/Footer';
import FloatingWidget from './components/FloatingWidget';
import LoadingScreen from './components/LoadingScreen';
import WaveTransition from './components/WaveTransition'; 
import { AnimatePresence, motion } from 'framer-motion';
import { SearchCriteria } from './types';
import Booking from './components/Booking';
import MakeBooking from './components/MakeBooking';

// Lazy load heavy components
const Destinations = React.lazy(() => import('./components/Destinations'));
const Blogs = React.lazy(() => import('./components/Blogs'));
const BlogDetails = React.lazy(() => import('./components/BlogDetails'));
const PackageDetails = React.lazy(() => import('./components/PackageDetails'));
const ContactUs = React.lazy(() => import('./components/ContactUs'));
const AboutUs = React.lazy(() => import('./components/AboutUs'));
const MoodCloud = React.lazy(() => import('./components/MoodCloud'));
const Cruise = React.lazy(() => import('./components/Cruise'));
const CruisePackageDetails = React.lazy(() => import('./components/CruisePackageDetails'));
const NewsletterPopup = React.lazy(() => import('./components/NewsletterPopup'));

type ViewState = 'home' | 'destinations' | 'package-details' | 'blogs' | 'blog-details' | 'contact' | 'about' | 'cruises' | 'cruise-details' | 'booking' | 'makebooking';

function App() {
  const [currentView, setCurrentView] = useState<ViewState>('home');
  const [isLoading, setIsLoading] = useState(true);
  const [searchCriteria, setSearchCriteria] = useState<SearchCriteria | null>(null);
  const [selectedBlogId, setSelectedBlogId] = useState<string | null>(null);

  // Simulate initial loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2200); 
    return () => clearTimeout(timer);
  }, []);

  const navigateTo = useCallback((view: ViewState) => {
    if (view === 'destinations') {
        setSearchCriteria(null); // Clear search when manually clicking link to show all
    }
    window.scrollTo(0, 0);
    setCurrentView(view);
  }, []);

  const handleSearch = useCallback((criteria: SearchCriteria) => {
    setSearchCriteria(criteria);
    window.scrollTo(0, 0);
    setCurrentView('destinations');
  }, []);

  const handleBlogClick = useCallback((id: string) => {
    setSelectedBlogId(id);
    window.scrollTo(0, 0);
    setCurrentView('blog-details');
  }, []);

  const handleCruiseClick = useCallback((id: string) => {
    // In a real app we would pass ID, for prototype we just show the details page
    window.scrollTo(0, 0);
    setCurrentView('cruise-details');
  }, []);

  // Map internal views to Navbar's supported active states
  const getNavbarView = () => {
    if (currentView === 'package-details') return 'destinations';
    if (currentView === 'blog-details') return 'blogs';
    if (currentView === 'cruise-details') return 'cruises';
    return currentView;
  };

  return (
    <>
      <AnimatePresence>
        {isLoading && (
          <motion.div
            key="loading"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-[100]"
          >
            <LoadingScreen />
          </motion.div>
        )}
      </AnimatePresence>

      <div className={`antialiased min-h-screen flex flex-col font-sans text-brand-navy ${isLoading ? 'h-screen overflow-hidden' : ''}`}>
        <Navbar 
          currentView={getNavbarView()} 
          onNavigate={navigateTo} 
        />
        
        <main className="flex-grow">
          {currentView === 'home' ? (
            <>
              <Hero 
                onSearch={handleSearch} 
                onBannerClick={() => navigateTo('package-details')}
              />
              
              <Suspense fallback={<div className="h-[320px] bg-transparent" />}>
                <MoodCloud /> 
              </Suspense>

              <FeaturedTrips 
                onViewMore={() => navigateTo('destinations')} 
                onTripClick={() => navigateTo('package-details')}
              />

              <FeaturedCruises 
                onCruiseClick={handleCruiseClick}
                onViewAll={() => navigateTo('cruises')}
              />
              
              {/* Dark Gradient Section Wrapper */}
              <div className="relative bg-gradient-to-b from-brand-teal to-brand-navy">
                 <WaveTransition />
                 <ValueProps />
                 <BlogSection 
                   onBlogClick={handleBlogClick}
                   onViewGuides={() => navigateTo('blogs')}
                 />
                 {/* TrustBar and Newsletter are now in Footer */}
              </div>

            </>
          ) : currentView === 'destinations' ? (
            <Suspense fallback={<LoadingScreen />}>
              <Destinations 
                  onTripClick={() => navigateTo('package-details')} 
                  searchCriteria={searchCriteria}
              />
            </Suspense>
          ) : currentView === 'blogs' ? (
            <Suspense fallback={<LoadingScreen />}>
              <Blogs 
                onNavigate={navigateTo} 
                onBlogClick={handleBlogClick}
              />
            </Suspense>
          ) : currentView === 'blog-details' ? (
            <Suspense fallback={<LoadingScreen />}>
              <BlogDetails 
                blogId={selectedBlogId}
                onNavigateBack={() => navigateTo('blogs')}
                onBlogClick={handleBlogClick}
              />
            </Suspense>
          ) : currentView === 'contact' ? (
            <Suspense fallback={<LoadingScreen />}>
              <ContactUs />
            </Suspense>
          ) : currentView === 'about' ? (
            <Suspense fallback={<LoadingScreen />}>
              <AboutUs />
            </Suspense>
          ) : currentView === 'cruises' ? (
            <Suspense fallback={<LoadingScreen />}>
              <Cruise onCruiseClick={handleCruiseClick} />
            </Suspense>
          ) : currentView === 'cruise-details' ? (
            <Suspense fallback={<LoadingScreen />}>
              <CruisePackageDetails onNavigateBack={() => navigateTo('cruises')} />
            </Suspense>
          ) : currentView === 'booking' ? (
            <Booking onNavigateMakeBooking={() => navigateTo('makebooking')} />
          ) : currentView === 'makebooking' ? (
            <MakeBooking />
          ) : (
            <Suspense fallback={<LoadingScreen />}>
              <PackageDetails 
                onNavigateBack={() => navigateTo('destinations')} 
                onNavigateBooking={() => navigateTo('booking')} 
              />
            </Suspense>
          )}
        </main>

        <Footer onNavigate={navigateTo} />
        <FloatingWidget />
        
        <Suspense fallback={null}>
            <NewsletterPopup />
        </Suspense>
      </div>
    </>
  );
}

export default App;
