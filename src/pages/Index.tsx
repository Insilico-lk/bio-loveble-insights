import React, { useState, useEffect, memo } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, FlaskConical, ExternalLink, Dna, Atom, Brain, Network, Computer, Menu, X } from "lucide-react";
import { AuthModal } from "@/components/auth/AuthModal";
import { ContactModal } from "@/components/contact/ContactModal";
import { SearchBar } from "@/components/search/SearchBar";
import { UserDashboard } from "@/components/dashboard/UserDashboard";
import CoursePipeline from "@/components/courses/CoursePipeline";
import { supabase } from "@/integrations/supabase/client";
import { User } from '@supabase/supabase-js';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

// Memoize the mobile menu component
const MobileMenu = memo(({ 
  isOpen, 
  onClose, 
  onSectionClick,
  onContactClick
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  onSectionClick: (sectionId: string) => void;
  onContactClick: () => void;
}) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-50 bg-gradient-to-br from-[#170056]/95 via-[#410056]/95 to-[#54366B]/95 backdrop-blur-md md:hidden"
      >
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-end mb-6">
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-white hover:bg-white/10 w-12 h-12"
            >
              <X className="h-8 w-8" />
            </Button>
          </div>
          <nav className="flex flex-col space-y-4">
            <Button
              variant="ghost"
              onClick={() => {
                onSectionClick('team');
                onClose();
              }}
              className="text-white hover:bg-white/10 text-lg justify-start"
            >
              Our Team
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                onSectionClick('research');
                onClose();
              }}
              className="text-white hover:bg-white/10 text-lg justify-start"
            >
              Research Areas
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                onSectionClick('courses');
                onClose();
              }}
              className="text-white hover:bg-white/10 text-lg justify-start"
            >
              Our Academy
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                onSectionClick('slbail');
                onClose();
              }}
              className="text-white hover:bg-white/10 text-lg justify-start"
            >
              SLBAIL
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                onSectionClick('news');
                onClose();
              }}
              className="text-white hover:bg-white/10 text-lg justify-start"
            >
              Latest News & Updates
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                onSectionClick('services');
                onClose();
              }}
              className="text-white hover:bg-white/10 text-lg justify-start"
            >
              Our Services
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                onContactClick();
                onClose();
              }}
              className="text-white hover:bg-white/10 text-lg justify-start"
            >
              Contact Us
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                onSectionClick('advisors');
                onClose();
              }}
              className="text-white hover:bg-white/10 text-lg justify-start"
            >
              Our Advisors
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                onSectionClick('success-stories');
                onClose();
              }}
              className="text-white hover:bg-white/10 text-lg justify-start"
            >
              Success Stories
            </Button>
          </nav>
        </div>
      </motion.div>
    )}
  </AnimatePresence>
));

const Index = () => {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  // Counter animation state
  const [counters, setCounters] = useState({
    courses: 0,
    students: 0,
    projects: 0,
    partnerships: 0
  });

  // Add animation observer
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    };

    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersection, observerOptions);
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    
    animatedElements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);

    // Get initial session
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        navigate('/dashboard');
      }
    });

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_, session) => {
        setUser(session?.user ?? null);
        if (session?.user) {
          navigate('/dashboard');
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [navigate]);

  // Optimize scroll handling
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    const handleScroll = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        const scrollPosition = window.scrollY;
        setIsScrolled(scrollPosition > 100);
      }, 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timeoutId);
    };
  }, []);

  // Counter animation
  useEffect(() => {
    const targets = { courses: 6, students: 10, projects: 5, partnerships: 5 };
    const increment = 225;

    const timer = setInterval(() => {
      setCounters(prev => {
        const newCounters = { ...prev };
        let allComplete = true;

        Object.keys(targets).forEach(key => {
          if (newCounters[key as keyof typeof newCounters] < targets[key as keyof typeof targets]) {
            newCounters[key as keyof typeof newCounters] = Math.min(
              newCounters[key as keyof typeof newCounters] + 1,
              targets[key as keyof typeof targets]
            );
            allComplete = false;
          }
        });

        if (allComplete) {
          clearInterval(timer);
        }

        return newCounters;
      });
    }, increment);

    return () => clearInterval(timer);
  }, []);

  // Slideshow functionality
  useEffect(() => {
    const slides = document.getElementsByClassName("slide");
    for (let i = 0; i < slides.length; i++) {
      slides[i].classList.remove("active");
    }
    slides[currentSlideIndex].classList.add("active");

    const timer = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [currentSlideIndex]);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleTeamMemberClick = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  // If user is logged in, show dashboard
  if (user) {
    return <UserDashboard user={user} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#170056] via-[#410056] to-[#54366B] relative">
      <style>{`
        .animate-on-scroll {
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.6s ease-out, transform 0.6s ease-out;
        }
        
        .animate-in {
          opacity: 1;
          transform: translateY(0);
        }
        
        .delay-200 { transition-delay: 200ms; }
        .delay-400 { transition-delay: 400ms; }
        .delay-600 { transition-delay: 600ms; }
        
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        
        .animate-scroll {
          animation: scroll 30s linear infinite;
          will-change: transform;
        }
        
        .animate-scroll:hover {
          animation-play-state: paused;
        }
        
        @media (max-width: 768px) {
          .animate-scroll {
            animation: scroll 1.5s linear infinite;
          }
        }

        .rainbow-dot {
          animation: rainbow 3s linear infinite;
          display: inline-block;
        }

        /* Research Area Hover Animations */
        .research-card {
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
        }

        .research-card:hover {
          transform: none;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
          border-color: rgba(160, 0, 152, 0.3);
        }

        .research-description {
          transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .research-card:hover .research-description {
          opacity: 1 !important;
          transform: translateY(0) !important;
        }

        .research-card:hover .research-card svg {
          filter: drop-shadow(0 4px 8px rgba(160, 0, 152, 0.3));
        }

        @media (max-width: 768px) {
          .research-card:hover {
            transform: none;
          }
        }

        /* Service Area Hover Animations */
        .service-card {
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
        }

        .service-card:hover {
          transform: none;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
          border-color: rgba(170, 81, 0, 0.3);
        }

        .service-description {
          transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .service-card:hover .service-description {
          opacity: 1 !important;
          transform: translateY(0) !important;
        }

        .service-card:hover .service-card svg {
          filter: drop-shadow(0 4px 8px rgba(170, 81, 0, 0.3));
        }

        @media (max-width: 768px) {
          .service-card:hover {
            transform: none;
          }
        }

        /* Slideshow Hover Effect for Our Academy */
        .slideshow-hover-group:hover .slideshow-overlay {
          background: linear-gradient(to bottom, rgba(10, 6, 18, 0.15) 0%, rgba(26, 11, 46, 0.10) 60%, rgba(45, 27, 105, 0.05) 100%) !important;
          opacity: 0.5;
        }
        .slideshow-hover-group:hover .slideshow-img {
          filter: brightness(1.15) contrast(1.08) saturate(1.1) drop-shadow(0 4px 16px rgba(80,80,160,0.10));
          transition: filter 0.5s cubic-bezier(0.4,0,0.2,1);
        }
        .slideshow-img {
          filter: brightness(0.92) contrast(1) saturate(1);
          transition: filter 0.5s cubic-bezier(0.4,0,0.2,1);
        }
        .slideshow-overlay {
          transition: background 0.5s cubic-bezier(0.4,0,0.2,1), opacity 0.5s cubic-bezier(0.4,0,0.2,1);
        }
      `}</style>

      {/* Navigation Header */}
      <header className={`sticky top-0 z-50 backdrop-blur-md border-b transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 border-gray-300/30' 
          : 'bg-gradient-to-r from-[#000A33]/80 to-[#363B6B]/80 border-[#EAE3F5]/20'
      }`}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Brand Name - Left Side */}
            <motion.div 
              className="flex items-center"
              layout
            >
              <div className="w-8 h-8 flex items-center justify-center">
                <img 
                  src="/lovable-uploads/new_logo_insilico.png" 
                  alt="Insilico.lk" 
                  className={`w-8 h-8 object-contain transition-all duration-300 ${
                    isScrolled 
                      ? 'scale-90 filter brightness-0 saturate-100 invert-20 sepia-100 saturate-2000 hue-rotate-260 brightness-90 contrast-120' 
                      : 'scale-100 filter brightness-0 saturate-100 invert-100 sepia-50 saturate-200 hue-rotate-280 brightness-110 contrast-90'
                  }`}
                />
              </div>
              <span className={`ml-2 text-lg font-semibold transition-all duration-300 ${
                isScrolled ? 'text-gray-900' : 'text-white'
              }`}>
                Insilico.lk
              </span>
            </motion.div>

            {/* Mobile Menu Button */}
            <motion.div layout className="flex items-center md:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className={`transition-all w-12 h-12 ${
                  isScrolled 
                    ? 'text-purple-600 hover:text-purple-700 hover:bg-purple-100' 
                    : 'text-white hover:text-white hover:bg-white/10'
                }`}
              >
                {mobileMenuOpen ? <X className="h-8 w-8" /> : <Menu className="h-8 w-8" />}
              </Button>
            </motion.div>

            {/* Navigation Links - Center */}
            <motion.nav layout className="hidden lg:flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={() => scrollToSection('team')}
                className={`transition-all transform hover:scale-105 text-sm ${
                  isScrolled 
                    ? 'text-gray-700 hover:text-gray-900 hover:bg-gray-100' 
                    : 'text-purple-100 hover:text-white hover:bg-white/10'
                }`}
              >
                Our Team
              </Button>
              <Button
                variant="ghost"
                onClick={() => scrollToSection('research')}
                className={`transition-all transform hover:scale-105 text-sm ${
                  isScrolled 
                    ? 'text-gray-700 hover:text-gray-900 hover:bg-gray-100' 
                    : 'text-purple-100 hover:text-white hover:bg-white/10'
                }`}
              >
                Research
              </Button>
              <Button
                variant="ghost"
                onClick={() => scrollToSection('courses')}
                className={`transition-all transform hover:scale-105 text-sm ${
                  isScrolled 
                    ? 'text-gray-700 hover:text-gray-900 hover:bg-gray-100' 
                    : 'text-purple-100 hover:text-white hover:bg-white/10'
                }`}
              >
                Our Academy
              </Button>
              <Button
                variant="ghost"
                onClick={() => scrollToSection('slbail')}
                className={`transition-all transform hover:scale-105 text-sm ${
                  isScrolled 
                    ? 'text-gray-700 hover:text-gray-900 hover:bg-gray-100' 
                    : 'text-purple-100 hover:text-white hover:bg-white/10'
                }`}
              >
                SLBAIL
              </Button>
              <Button
                variant="ghost"
                onClick={() => scrollToSection('news')}
                className={`transition-all transform hover:scale-105 text-sm ${
                  isScrolled 
                    ? 'text-gray-700 hover:text-gray-900 hover:bg-gray-100' 
                    : 'text-purple-100 hover:text-white hover:bg-white/10'
                }`}
              >
                News
              </Button>
              <Button
                variant="ghost"
                onClick={() => scrollToSection('services')}
                className={`transition-all transform hover:scale-105 text-sm ${
                  isScrolled 
                    ? 'text-gray-700 hover:text-gray-900 hover:bg-gray-100' 
                    : 'text-purple-100 hover:text-white hover:bg-white/10'
                }`}
              >
                Our Services
              </Button>
              <Button
                variant="ghost"
                onClick={() => setContactModalOpen(true)}
                className={`transition-all transform hover:scale-105 text-sm ${
                  isScrolled 
                    ? 'text-gray-700 hover:text-gray-900 hover:bg-gray-100' 
                    : 'text-purple-100 hover:text-white hover:bg-white/10'
                }`}
              >
                Contact Us
              </Button>
              <Button
                variant="ghost"
                onClick={() => scrollToSection('advisors')}
                className={`transition-all transform hover:scale-105 text-sm ${
                  isScrolled 
                    ? 'text-gray-700 hover:text-gray-900 hover:bg-gray-100' 
                    : 'text-purple-100 hover:text-white hover:bg-white/10'
                }`}
              >
                Our Advisors
              </Button>
              <Button
                variant="ghost"
                onClick={() => scrollToSection('success-stories')}
                className={`transition-all transform hover:scale-105 text-sm ${
                  isScrolled 
                    ? 'text-gray-700 hover:text-gray-900 hover:bg-gray-100' 
                    : 'text-purple-100 hover:text-white hover:bg-white/10'
                }`}
              >
                Success Stories
              </Button>
            </motion.nav>

            {/* Right Side - Search and Login */}
            <div className="flex items-center gap-4">
              {/* New Overlay Search Bar */}
              <SearchBar onClose={() => setAuthModalOpen(false)} />
              
              <Button
                onClick={() => setAuthModalOpen(true)}
                className="bg-[#54366B] hover:bg-[#410056] text-[#EAE3F5] border border-[#EAE3F5]/20 transition-all transform hover:scale-105 shadow-lg rounded-full"
              >
                Login
              </Button>
            </div>
          </div>
        </div>
      </header>

      <MobileMenu 
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        onSectionClick={scrollToSection}
        onContactClick={() => setContactModalOpen(true)}
      />

      {/* Hero Section */}
      <section className="relative overflow-hidden z-10">
        <div className="absolute inset-0">
          {/* Primary Background Gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#000A33] to-[#363B6B]"></div>
        
          {/* Geometric Shapes */}
          <div className="absolute inset-0">
            {/* Shape 1 */}
            <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-[#54366B]/20 blur-3xl"></div>
            {/* Shape 2 */}
            <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-[#000A33]/40 blur-3xl"></div>
            {/* Shape 3 */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-[#363B6B]/20 blur-3xl"></div>
              </div>
            </div>
          
        <div className="relative container mx-auto px-4 py-16 lg:py-24">
          {/* Main Hero Content - Split Layout */}
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center mb-12">
            {/* Left Side - Text Content */}
            <div className="text-white space-y-4 lg:space-y-6 relative">
              {/* Dark overlay for text content */}
              <div className="absolute inset-0 -m-8 bg-gradient-to-r from-[#000A33]/90 to-[#363B6B]/60 rounded-3xl blur-xl"></div>
              
              <div className="relative">
                <h1 className="animate-on-scroll text-3xl md:text-4xl lg:text-6xl font-bold leading-tight text-left -mt-4">
                  Accelerating <span className="text-[#EAE3F5] text-4xl md:text-5xl lg:text-7xl">Insilico</span> Innovation
              </h1>
                <p className="animate-on-scroll delay-200 text-lg md:text-xl lg:text-2xl text-[#EAE3F5]/90 leading-relaxed text-left mt-6">
                Empowering researchers and students in genomics, proteomics, and computational biology through world-class education and cutting-edge research.
              </p>
                <div className="animate-on-scroll delay-400 flex flex-col sm:flex-row gap-4 justify-start mt-6">
                <Button 
                  size="lg" 
                    className="bg-[#363B6B] hover:bg-[#000A33] text-[#EAE3F5] border border-[#EAE3F5]/20 transition-all transform hover:scale-105 shadow-lg text-base md:text-lg px-6 py-4 h-auto"
                  onClick={() => scrollToSection('courses')}
                >
                  Explore Courses
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                    className="border-[#EAE3F5]/30 text-[#EAE3F5] bg-[#000A33]/40 hover:bg-[#363B6B]/60 hover:text-[#EAE3F5] px-6 py-4 text-base md:text-lg transition-all transform hover:scale-105 font-semibold backdrop-blur-sm h-auto"
                  onClick={() => scrollToSection('research')}
                >
                  View Research
                </Button>
                </div>
              </div>
            </div>

            {/* Right Side - Video */}
            <div className="animate-on-scroll delay-600 relative hidden lg:block">
              <div className="relative w-full h-64 md:h-80 lg:h-96 bg-gradient-to-br from-[#000A33]/40 to-[#363B6B]/40 backdrop-blur-sm rounded-2xl border-2 border-[#EAE3F5]/20 overflow-hidden shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-[#000A33]/30 to-[#363B6B]/30"></div>
                <iframe 
                  src="https://player.vimeo.com/video/1089037562?badge=0&autopause=0&player_id=0&app_id=58479&autoplay=1&muted=1&loop=1&background=1"
                  frameBorder="0" 
                  allow="autoplay; fullscreen; picture-in-picture; clipboard-write"
                  className="w-full h-full relative z-10"
                  title="Bioinformatics Showcase"
                ></iframe>
              </div>
            </div>
          </div>

          {/* Counters Section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8">
            {Object.entries(counters).map(([key, value], index) => (
              <div key={key} className={`animate-on-scroll delay-${index * 200} text-center`}>
                <div className="text-3xl md:text-4xl font-bold text-[#EAE3F5] mb-2">
                  {value.toString().padStart(2, '0')}
                </div>
                <div className="text-[#EAE3F5]/80 text-sm md:text-base">
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Explore Section */}
      <section className="relative py-20 px-2 md:px-4 bg-white">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center space-y-8">
            <h2 className="text-4xl md:text-5xl font-bold text-[#170056] mb-6">
              Explore<span className="rainbow-dot">.</span> Discover<span className="rainbow-dot">.</span> Advance<span className="rainbow-dot">.</span>
            </h2>
            
            <p className="text-lg md:text-xl text-[#54366B] leading-relaxed px-4 md:px-8">
              Let's shape the future of Bioinformatics and Computational Biology together! At Insilico.lk, we are building a vibrant scientific community that empowers future innovators in genomics, molecular modeling, data science, and more. With free learning resources, collaborative discussions, and the latest breakthroughs, we're here to support your journey to grow, explore, and lead in this rapidly evolving field.
            </p>

            <div className="mt-4">
              <h3 className="text-xl font-semibold text-[#170056] mb-3">
                Powered by Researchers, Alumni & Ecosystem
              </h3>
              <div className="w-full h-[50px] md:h-[350px] rounded-lg overflow-hidden mx-0">
                <img 
                  src="/lovable-uploads/Partners.jpg" 
                  alt="Bioinformatics Partners" 
                  className="w-full h-full object-contain"
                />
            </div>
            </div>
          </div>
        </div>
      </section>

      {/* What We Offer Section */}
      <section className="py-20 md:py-32 bg-gradient-to-br from-[#54366B] via-[#363B6B] to-[#000A33] relative overflow-hidden">
        {/* Background Shapes */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-[#EAE3F5]/10 blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-[#EAE3F5]/5 blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-[#EAE3F5]/5 blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-12 md:mb-24">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 md:mb-10">
              What We Offer at Insilico.lk
            </h2>
            <p className="text-lg md:text-xl lg:text-2xl text-[#EAE3F5]/90 max-w-5xl mx-auto leading-relaxed">
              Join us at Insilico.lk – where innovation meets opportunity, and passion meets purpose. Build your future in the growing world of informatics!
            </p>
          </div>

          {/* Accordion Topics */}
          <div className="max-w-5xl mx-auto space-y-4 md:space-y-8 mb-12 md:mb-20">
            {(() => {
              const [openTopic, setOpenTopic] = useState<number | null>(null);
              const [isMobile, setIsMobile] = useState(false);

              // Detect mobile for faster animations
              useEffect(() => {
                const checkMobile = () => {
                  setIsMobile(window.innerWidth < 768);
                };
                checkMobile();
                window.addEventListener('resize', checkMobile);
                return () => window.removeEventListener('resize', checkMobile);
              }, []);

              const topics = [
                {
                  title: "Expert Education and Valid Certificates",
                  description: "Gain access to world-class education guided by domain experts. Our programs are designed to equip you with in-demand skills and award internationally recognized certifications that validate your expertise in bioinformatics and related disciplines."
                },
                {
                  title: "Research Publications",
                  description: "We open doors to the scientific world by offering opportunities to:\n\n• Publish your research in reputed international journals\n• Present at global conferences\n• Collaborate on cutting-edge research projects in bioinformatics, cheminformatics, and drug discovery."
                },
                {
                  title: "Internship Opportunities",
                  description: "Work on real-world open-source projects that matter. We connect you with:\n\n• Global research teams\n• Drug discovery collaborations\n• Hands-on projects that build both your academic and industry portfolios"
                },
                {
                  title: "Startup Support & Innovation Ecosystem",
                  description: "At Insilico.lk, we are cultivating Sri Lanka's first bioinformatics startup ecosystem. We empower students and researchers to:\n\n• Turn innovative ideas into marketable products or services\n• Receive mentorship, networking, and funding guidance\n• Launch their own bioinformatics startups from idea to impact"
                }
              ];

              // Ultra-fast animations for mobile and web
              const animationDuration = isMobile ? 0.08 : 0.12;
              const staggerDelay = isMobile ? 0.01 : 0.02;

              return (
                <>
                  {topics.map((topic, index) => (
                    <div key={index} className="relative">
                      <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.15, delay: index * staggerDelay }}
                        className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl overflow-hidden hover:border-white/40 transition-all duration-150 relative z-10"
                      >
                        <button
                          onClick={() => setOpenTopic(openTopic === index ? null : index)}
                          className="w-full px-6 py-5 md:px-10 md:py-8 flex items-center justify-between text-left hover:bg-white/5 transition-all duration-150"
                        >
                          <h3 className="text-lg md:text-2xl font-semibold text-white pr-4">
                            {topic.title}
                          </h3>
                          <motion.div
                            animate={{ rotate: openTopic === index ? 45 : 0 }}
                            transition={{ duration: isMobile ? 0.08 : 0.1 }}
                            className="flex-shrink-0 w-8 h-8 md:w-12 md:h-12 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-150"
                          >
                            <svg 
                              className="w-5 h-5 md:w-7 md:h-7 text-white" 
                              fill="none" 
                              viewBox="0 0 24 24" 
                              stroke="currentColor"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                          </motion.div>
                        </button>
                      </motion.div>
                      
                      {/* Expandable content positioned absolutely */}
                      <AnimatePresence>
                        {openTopic === index && (
                          <motion.div
                            initial={{ opacity: 0, height: 0, y: -10 }}
                            animate={{ opacity: 1, height: "auto", y: 0 }}
                            exit={{ opacity: 0, height: 0, y: -10 }}
                            transition={{ duration: animationDuration, ease: "easeOut" }}
                            className="absolute top-full left-0 right-0 z-20 bg-gradient-to-br from-[#0a0514] via-[#1a0b2e] to-[#2d1b69] backdrop-blur-md border border-white/20 rounded-b-xl overflow-hidden shadow-lg"
                            style={{ 
                              transformOrigin: 'top',
                              maxHeight: '70vh',
                              overflowY: 'auto'
                            }}
                          >
                            <div className="px-6 py-5 md:px-10 md:py-8">
                              <p className="text-[#EAE3F5] text-base md:text-xl leading-relaxed whitespace-pre-line font-medium">
                                {topic.description}
                              </p>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </>
              );
            })()}
          </div>

          {/* Join Our Community Button */}
          <div className="text-center">
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              onClick={() => window.open('https://chat.whatsapp.com/Dpa932BSJiE6cAWUTsQuI0', '_blank')}
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-3 md:px-12 md:py-6 rounded-xl text-base md:text-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center gap-3 mx-auto"
            >
              <svg className="w-5 h-5 md:w-7 md:h-7" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
              </svg>
              Join Our Community
            </motion.button>
            <p className="text-[#EAE3F5]/70 text-sm md:text-base mt-3 md:mt-4">
              Connect with fellow informatics enthusiasts and stay updated with the latest developments
            </p>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section id="team" className="relative py-20 bg-gradient-to-br from-[#000A33] to-[#363B6B] overflow-hidden">
        {/* Background Shapes */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-[#54366B]/20 blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-[#000A33]/40 blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-[#363B6B]/20 blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          {/* Topic Section */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Be a Part of the Future
            </h2>
          </div>

          {/* Photo Slideshow */}
          <div className="relative h-[500px] md:h-[600px] mb-16 overflow-hidden rounded-3xl shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-transparent z-10"></div>
            <AnimatePresence mode="wait">
              {(() => {
                const [currentSlide, setCurrentSlide] = useState(0);
                const [isMobile, setIsMobile] = useState(false);

                // Check if mobile on mount and window resize
                useEffect(() => {
                  const checkMobile = () => {
                    setIsMobile(window.innerWidth < 768);
                  };
                  checkMobile();
                  window.addEventListener('resize', checkMobile);
                  return () => window.removeEventListener('resize', checkMobile);
                }, []);

                const webPhotos = [
                  '/lovable-uploads/Photo 01.jpg',
                  '/lovable-uploads/Photo 03.jpg',
                  '/lovable-uploads/Photo 04.jpg',
                  '/lovable-uploads/Photo 06.jpg',
                  '/lovable-uploads/Photo 09.jpg',
                ];

                const mobilePhotos = [
                  '/lovable-uploads/Photo 01.jpg',
                  '/lovable-uploads/Photo 02.jpg',
                  '/lovable-uploads/Photo 03.jpg',
                  '/lovable-uploads/Photo 04.jpg',
                  '/lovable-uploads/Photo 05.jpg',
                  '/lovable-uploads/Photo 06.jpg',
                  '/lovable-uploads/Photo 07.jpg',
                  '/lovable-uploads/Photo 08.jpg',
                  '/lovable-uploads/Photo 09.jpg',
                ];

                const photos = isMobile ? mobilePhotos : webPhotos;

                useEffect(() => {
                  const timer = setInterval(() => {
                    setCurrentSlide((prev) => (prev + 1) % photos.length);
                  }, 5000);
                  return () => clearInterval(timer);
                }, [photos.length]);

                return (
                  <>
                    <motion.div
                      key={currentSlide}
                      className="absolute inset-0 flex items-center justify-center"
                      initial={{ opacity: 0, scale: 1.1 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.7, ease: "easeInOut" }}
                    >
                      <div className="relative w-full h-full">
                        <img
                          src={photos[currentSlide]}
                          alt={`Slide ${currentSlide + 1}`}
                          className="absolute inset-0 w-full h-full object-contain md:object-cover md:object-center"
                          style={{
                            objectPosition: isMobile ? 'center' : 'center 10%'
                          }}
                        />
                      </div>
                    </motion.div>

                    {/* Slide Navigation */}
                    <div className="absolute bottom-0 left-0 right-0 z-20 p-6">
                      <div className="flex items-center justify-between">
                        {/* Slide Indicators */}
                        <div className="flex space-x-3">
                          {photos.map((_, index) => (
                            <button
                              key={index}
                              onClick={() => setCurrentSlide(index)}
                              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                                currentSlide === index 
                                  ? 'bg-white scale-125' 
                                  : 'bg-white/50 hover:bg-white/75'
                              }`}
                            />
                          ))}
                        </div>

                        {/* Slide Controls */}
                        <div className="flex space-x-4">
                          <button
                            onClick={() => setCurrentSlide((prev) => (prev - 1 + photos.length) % photos.length)}
                            className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-all"
                          >
                            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                          </button>
                          <button
                            onClick={() => setCurrentSlide((prev) => (prev + 1) % photos.length)}
                            className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-all"
                          >
                            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Slide Counter */}
                    <div className="absolute top-6 right-6 z-20 bg-black/30 backdrop-blur-sm px-4 py-2 rounded-full">
                      <span className="text-white text-sm font-medium">
                        {currentSlide + 1} / {photos.length}
                      </span>
                    </div>
                  </>
                );
              })()}
            </AnimatePresence>
          </div>

          {/* Team Members Grid */}
          <div className="mt-16">
            <div className="text-center mb-12">
              <h3 className="text-2xl md:text-3xl font-semibold text-white mb-4">
              Meet our expert team of researchers and educators
              </h3>
          </div>
          
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: "Dr. Lakmal Ranathunga",
                qualification: "PhD in Veterinary Medicine",
                image: "/lovable-uploads/99dec8fe-51c3-46ea-af63-6bd557692e29.png",
                url: "https://agri.pdn.ac.lk/ansc/staff/academic_staff_detail/35"
              },
              {
                name: "Mrs. Saumya Poorni",
                qualification: "PhD in Aquaculture (Reading)",
                image: "/lovable-uploads/a0ce1ac5-e01f-4cc3-a67a-42a5bc885eda.png",
                url: "https://www.linkedin.com/in/saumya-poorni-73009a314/"
              },
              {
                name: "Mr. Anuththara Gamage",
                qualification: "B.Sc Honours, Lead Engineering Scientist at Standard Seed Corporation",
                image: "/lovable-uploads/b42b66f6-f7c5-4932-af71-ccf28ed41fbf.png",
                url: "https://www.linkedin.com/in/anu-gamage-62192b201/"
              }
            ].map((member, index) => (
                <Card key={index} className="bg-white/10 backdrop-blur-md border-2 border-white/20 hover:border-white/40 transition-all transform hover:scale-105">
                <CardHeader className="text-center">
                    <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden border-4 border-white/20">
                    <img 
                      src={member.image} 
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardTitle 
                      className="text-white cursor-pointer hover:text-[#4ECDC4] transition-all flex items-center justify-center gap-2"
                    onClick={() => handleTeamMemberClick(member.url)}
                  >
                    {member.name}
                    <ExternalLink className="h-4 w-4" />
                  </CardTitle>
                    <CardDescription className="text-purple-100">{member.qualification}</CardDescription>
                </CardHeader>
              </Card>
            ))}
            </div>
          </div>
        </div>
      </section>

      {/* Research Section */}
      <section className="py-12 md:py-20 bg-white relative z-10" id="research">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 lg:mb-12">
            <div className="inline-block bg-[#EEBBFF] px-6 py-3 rounded-lg mb-4">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800">Research Areas</h2>
            </div>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
              Pioneering research in bioinformatics, cheminformatics, computational chemistry and AI-driven drug discovery applications
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 lg:gap-10">
            <Card className="research-card group bg-white border-2 border-transparent bg-gradient-to-r from-blue-600/10 to-purple-600/10 hover:bg-gray-800 transition-all shadow-lg cursor-pointer min-h-[280px] md:min-h-[320px] relative overflow-hidden">
              <CardHeader className="text-center relative p-8 flex flex-col justify-center items-center h-full">
                {/* Default State - Centered Icon and Title */}
                <div className="research-default absolute inset-0 flex flex-col justify-center items-center p-8 transition-all duration-300 group-hover:opacity-0">
                  <div className="flex justify-center mb-6">
                    <Dna className="h-20 w-20 md:h-24 md:w-24 text-purple-600 transition-all duration-300" />
                </div>
                  <CardTitle className="text-2xl md:text-3xl font-bold text-gray-800 text-center">
                  Bioinformatics
                </CardTitle>
                </div>
                
                {/* Hover State - Description with Dark Background */}
                <div className="research-description absolute inset-0 bg-gray-800 flex items-center justify-center p-8 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <CardDescription className="text-white text-center text-base md:text-lg leading-relaxed">
                  Identification of Active Compounds in Sri Lankan Medicinal Plants as Antivirals Against African Swine Fever
                </CardDescription>
                </div>
              </CardHeader>
            </Card>

            <Card className="research-card group bg-white border-2 border-transparent bg-gradient-to-r from-blue-600/10 to-purple-600/10 hover:bg-gray-800 transition-all shadow-lg cursor-pointer min-h-[280px] md:min-h-[320px] relative overflow-hidden">
              <CardHeader className="text-center relative p-8 flex flex-col justify-center items-center h-full">
                {/* Default State - Centered Icon and Title */}
                <div className="research-default absolute inset-0 flex flex-col justify-center items-center p-8 transition-all duration-300 group-hover:opacity-0">
                  <div className="flex justify-center mb-6">
                    <Atom className="h-20 w-20 md:h-24 md:w-24 text-purple-600 transition-all duration-300" />
                </div>
                  <CardTitle className="text-2xl md:text-3xl font-bold text-gray-800 text-center">
                  Cheminformatics
                </CardTitle>
                </div>
                
                {/* Hover State - Description with Dark Background */}
                <div className="research-description absolute inset-0 bg-gray-800 flex items-center justify-center p-8 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <CardDescription className="text-white text-center text-base md:text-lg leading-relaxed">
                  Development of globally accessible comprehensive database with an AI-integrated web platform cataloging endemic medicinal plants with detailed information.
                </CardDescription>
                </div>
              </CardHeader>
            </Card>

            <Card className="research-card group bg-white border-2 border-transparent bg-gradient-to-r from-blue-600/10 to-purple-600/10 hover:bg-gray-800 transition-all shadow-lg cursor-pointer min-h-[280px] md:min-h-[320px] relative overflow-hidden">
              <CardHeader className="text-center relative p-8 flex flex-col justify-center items-center h-full">
                {/* Default State - Centered Icon and Title */}
                <div className="research-default absolute inset-0 flex flex-col justify-center items-center p-8 transition-all duration-300 group-hover:opacity-0">
                  <div className="flex justify-center mb-6">
                    <Brain className="h-20 w-20 md:h-24 md:w-24 text-purple-600 transition-all duration-300" />
                </div>
                  <CardTitle className="text-2xl md:text-3xl font-bold text-gray-800 text-center">
                  AI-driven Drug Discovery
                </CardTitle>
                </div>
                
                {/* Hover State - Description with Dark Background */}
                <div className="research-description absolute inset-0 bg-gray-800 flex items-center justify-center p-8 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <CardDescription className="text-white text-center text-base md:text-lg leading-relaxed">
                  Discovery of Antiviral Compounds from Sri Lankan Medicinal Plants and Deep Learning Based De Novo Design and Bioactivity Prediction of Natural-Product-Inspired Inhibitors Against Livestock and Aquaculture Viral Diseases.
                </CardDescription>
                </div>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Our Academy Section */}
      <section className="py-20 bg-gradient-to-br from-[#000A33] via-[#000A33] via-75% to-black" id="courses">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-block border-2 border-white/30 rounded-xl px-8 py-4 backdrop-blur-sm">
              <h2 className="text-4xl md:text-5xl font-bold text-white text-center">Our Academy</h2>
            </div>
            <p className="text-lg text-gray-300 max-w-4xl mx-auto mt-8">
              At Insilico.lk Academy, we're revolutionizing science education through our innovative journey-based learning approach! Our passionate mentors guide learners through engaging, self-paced projects aligned with the Sustainable Development Goals (SDGs) from core foundations to cutting-edge paths in Bioinformatics, Cheminformatics, Computational Biology, and AI in Life Sciences. Regular team challenges ignite curiosity, foster collaboration, and build essential skills for the future of healthcare, agriculture, and environmental science.
            </p>
          </div>
          
          {/* Two-column layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* Left Column - Slideshow */}
            <div className="lg:col-span-1">
              <div className="relative h-[400px] md:h-[500px] lg:h-[600px] rounded-2xl overflow-hidden shadow-xl slideshow-hover-group">
                <div className="absolute inset-0 bg-gradient-to-b from-[#000A33]/50 to-[#000A33]/80 z-10 slideshow-overlay transition-all duration-500" />
                <div className="slideshow-container h-full">
                  <div className="slide fade">
                    <img 
                      src="/lovable-uploads/Our academy 01.jpg" 
                      alt="Our Academy - Learning Environment" 
                      className="w-full h-full object-cover slideshow-img transition-all duration-500"
                    />
                  </div>
                  <div className="slide fade">
                    <img 
                      src="/lovable-uploads/Our academy 02.jpg" 
                      alt="Our Academy - Research Facilities" 
                      className="w-full h-full object-cover slideshow-img transition-all duration-500"
                    />
                  </div>
                  <div className="slide fade">
                    <img 
                      src="/lovable-uploads/Photo 11.jpg" 
                      alt="Bioinformatics Research" 
                      className="w-full h-full object-cover slideshow-img transition-all duration-500"
                  />
                </div>
                  <div className="slide fade">
                    <img 
                      src="/lovable-uploads/Photo 10.jpg" 
                      alt="Drug Discovery Process" 
                      className="w-full h-full object-cover slideshow-img transition-all duration-500"
                    />
        </div>
                </div>
              </div>
            </div>

            {/* Right Column - React Flow */}
            <div className="lg:col-span-1">
              <div className="h-[400px] md:h-[500px] lg:h-[600px] rounded-2xl overflow-hidden shadow-xl">
                <CoursePipeline />
            </div>
            </div>
          </div>

          {/* Join Our Academy Button */}
          <div className="text-center mt-12">
            <button 
              onClick={() => setAuthModalOpen(true)}
              className="bg-white text-[#000A33] px-8 py-4 rounded-xl text-lg font-semibold hover:bg-[#4d2884] hover:text-white transition-colors duration-300 shadow-lg"
            >
              Join Our Academy
            </button>
          </div>
        </div>
      </section>

      {/* Global styles */}
      <style>{`
        .slideshow-container {
          position: relative;
          height: 100%;
        }

        .slide {
          display: none;
          height: 100%;
        }

        .slide.active {
          display: block;
        }

        .fade {
          animation-name: fade;
          animation-duration: 1.5s;
        }

        @keyframes fade {
          from {opacity: .4} 
          to {opacity: 1}
        }

        .dot {
          height: 12px;
          width: 12px;
          margin: 0 4px;
          background-color: rgba(255, 255, 255, 0.5);
          border-radius: 50%;
          display: inline-block;
          transition: background-color 0.6s ease;
          cursor: pointer;
        }

        .dot.active {
          background-color: white;
        }

        @keyframes rainbow {
          0% { color: #ff0000; }
          17% { color: #ff8000; }
          33% { color: #ffff00; }
          50% { color: #00ff00; }
          67% { color: #0000ff; }
          83% { color: #8000ff; }
          100% { color: #ff0000; }
        }

        .rainbow-dot {
          animation: rainbow 3s linear infinite;
          display: inline-block;
        }
      `}</style>

      {/* Our Services Section */}
      <section className="py-12 md:py-20 bg-white relative z-10" id="services">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 lg:mb-12">
            <div className="inline-block bg-[#FFCB9C] px-6 py-3 rounded-lg mb-4">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800">Our Services</h2>
            </div>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
              Professional bioinformatics, cheminformatics and computational biology services
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {[
              {
                title: "Network Pharmacology",
                description: "Network Pharmacology is a cutting-edge approach integrating systems biology and pharmacology to understand drug actions and interactions at a network level. It helps identify key targets, predict drug efficacy, and uncover new therapeutic pathways.",
                icon: Network
              },
              {
                title: "Molecular Docking", 
                description: "Molecular Docking is a computational technique that predicts the preferred orientation of a small molecule (ligand) when bound to a target protein (receptor). It helps in drug discovery by estimating binding affinity and identifying potential drug candidates.",
                icon: Atom
              },
              {
                title: "Molecular Dynamics Simulation",
                description: "Molecular Dynamics (MD) Simulation is a computational method that models the physical movements of atoms and molecules over time, helping to understand biomolecular behavior, stability, and interactions at the atomic level.",
                icon: Computer
              },
              {
                title: "AI and ML in Drug Discovery",
                description: "Artificial Intelligence (AI) and Machine Learning (ML) accelerate drug discovery by analyzing vast datasets to predict drug-target interactions, optimize lead compounds, and identify novel candidates more efficiently than traditional methods.",
                icon: Brain
              },
              {
                title: "Research Article Writing",
                description: "Professional research article writing involves crafting scientifically accurate, clear, and well-structured manuscripts for publication in peer-reviewed journals. This includes literature review, data interpretation, and formatting to journal standards.",
                icon: FileText
              },
              {
                title: "Drug Formulation Development",
                description: "Drug Formulation Development involves designing and producing stable, effective, and safe pharmaceutical formulations, optimizing drug delivery, dosage form, and bioavailability to meet therapeutic needs.",
                icon: FlaskConical
              }
            ].map((service, index) => (
              <Card 
                key={index} 
                className="service-card group bg-white border-2 border-transparent bg-gradient-to-r from-blue-600/10 to-purple-600/10 hover:bg-gray-800 transition-all shadow-md cursor-pointer min-h-[200px] md:min-h-[240px] relative overflow-hidden"
              >
                <CardHeader className="text-center relative p-6 flex flex-col justify-center items-center h-full">
                  {/* Default State - Centered Icon and Title */}
                  <div className="service-default absolute inset-0 flex flex-col justify-center items-center p-6 transition-all duration-300 group-hover:opacity-0">
                    <div className="flex justify-center mb-4">
                      <service.icon className="h-12 w-12 md:h-16 md:w-16 text-orange-600 transition-all duration-300" />
                    </div>
                    <CardTitle className="text-lg md:text-xl font-bold text-black text-center">
                    {service.title}
                  </CardTitle>
                  </div>
                  
                  {/* Hover State - Description with Dark Background */}
                  <div className="service-description absolute inset-0 bg-gray-800 flex items-center justify-center p-6 opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <CardDescription className="text-white text-center text-sm md:text-base leading-relaxed">
                    {service.description}
                  </CardDescription>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* SLBAIL Section */}
      <section className="py-20 relative" id="slbail">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/lovable-uploads/Photo 12.jpg" 
            alt="SLBAIL Background" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-block border-2 border-white/30 rounded-xl px-8 py-4 backdrop-blur-sm">
              <h2 className="text-4xl md:text-5xl font-bold text-white text-center">SLBAIL</h2>
            </div>
            <h3 className="text-xl md:text-2xl font-semibold text-[#EAE3F5] mb-4 mt-8">
              Sri Lankan Bioinformatics and Artificial Intelligence Lab
            </h3>
            <p className="text-lg text-gray-300 max-w-4xl mx-auto mt-8">
              Sri Lanka's first Bioinformatics and Artificial Intelligence Lab (SLBAIL) is transforming the landscape of drug discovery by fusing advanced AI technologies with rich traditional botanical wisdom. This innovative system streamlines and enhances the drug development process, setting a new benchmark in AI-driven pharmaceutical research.
            </p>
          </div>

          {/* SLBAIL Topics Grid with Text Overlays */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-12">
            {[
              {
                id: 'ai-agents',
                title: 'AI Agents',
                description: 'Advanced artificial intelligence systems for automated research and analysis. Explore cutting-edge AI technologies for drug discovery and computational biology.',
                image: '/lovable-uploads/slbail01.png',
                color: 'from-purple-600 to-blue-600'
              },
              {
                id: 'bioinformatics',
                title: 'Bioinformatics and Cheminformatics',
                description: 'Computational analysis of biological and chemical data for drug discovery. Integrate molecular biology with computational methods.',
                image: '/lovable-uploads/slbail02.png',
                color: 'from-blue-600 to-cyan-600'
              },
              {
                id: 'computational-chemistry',
                title: 'Computational Chemistry',
                description: 'Molecular modeling and simulation for chemical research and development. Advanced computational techniques for molecular analysis.',
                image: '/lovable-uploads/slbail03.png',
                color: 'from-cyan-600 to-teal-600'
              },
              {
                id: 'cmpaat-database',
                title: 'CMPAAT Botanical Database',
                description: 'Comprehensive database of medicinal plants and their therapeutic properties. Access extensive botanical and pharmacological data.',
                image: '/lovable-uploads/slbail04.png',
                color: 'from-teal-600 to-green-600'
              }
            ].map((topic, index) => (
              <div 
                key={topic.id}
                className="slbail-card group relative cursor-pointer overflow-hidden rounded-2xl border-2 border-white/20 bg-white/10 backdrop-blur-sm h-80 md:h-96"
                style={{
                  animationDelay: `${index * 200}ms`,
                  animation: 'fadeInUp 0.8s ease-out forwards'
                }}
              >
                {/* Background Image - Always Visible */}
                <div 
                  className="slbail-image absolute inset-0 bg-cover bg-center bg-no-repeat transform scale-110"
                  style={{ backgroundImage: `url(${topic.image})` }}
                />
                
                {/* Dark Overlay for Text Readability - Fades on Hover */}
                <div className="slbail-overlay absolute inset-0 bg-gradient-to-t from-black/95 via-black/70 to-black/50" />
                
                {/* Text Overlay - Disappears on Hover */}
                <div className="slbail-text-overlay absolute inset-0 flex flex-col justify-end p-6 text-white">
                  <div className={`inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r ${topic.color} text-white text-sm font-semibold mb-4 w-fit shadow-lg`}>
                    {topic.title}
              </div>
                  
                  <p className="text-white text-lg leading-relaxed mb-4 font-medium">
                    {topic.description}
                  </p>
                  
                  <div className="flex items-center text-white/90 text-sm font-medium">
                    <div className="w-3 h-3 bg-white/90 rounded-full mr-3 animate-pulse"></div>
                    Hover to explore image
                  </div>
                </div>
                
                {/* Hover State - Image Revealed with Badge */}
                <div className="slbail-hover-content absolute inset-0 opacity-0">
                  {/* Topic Badge on Hover */}
                  <div className="absolute bottom-4 left-4 right-4 z-10">
                    <div className={`inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r ${topic.color} text-white font-bold shadow-xl backdrop-blur-sm`}>
                      {topic.title}
                    </div>
                  </div>
                  
                  {/* Decorative Element */}
                  <div className="absolute top-4 right-4 z-10">
                    <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Explore SLBAIL Button */}
          <div className="text-center">
                <button 
              onClick={() => alert("SLBAIS will be launching soon.")}
              className="bg-white text-[#000A33] px-8 py-4 rounded-xl text-lg font-semibold hover:bg-[#4d2884] hover:text-white transition-all duration-300 shadow-lg transform hover:scale-105"
                >
              Explore SLBAIL
                </button>
          </div>
        </div>
      </section>

      {/* Our Advisors Section */}
      <section className="py-12 md:py-20 bg-white relative z-10" id="advisors">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 lg:mb-12">
            <div className="inline-block bg-[#FFBBE5] px-6 py-3 rounded-lg mb-4">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800">Our Advisors</h2>
            </div>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
              Brilliant minds who guide us with their wealth of expertise and insight.
            </p>
          </div>
          
          {/* Auto-scrolling advisors container */}
          <div className="relative overflow-hidden">
            <div className="flex animate-scroll space-x-2 md:space-x-3 lg:space-x-4">
              {[
                {
                  name: "Dr. Lakmal Ranathunga",
                  title: "Lecturer/Entrepreneur/Researcher",
                  experience: "10+ years of experience in Bioinformatics and Virology",
                  education: "PhD CNU South Korea",
                  image: "/lovable-uploads/CNU.png"
                },
                {
                  name: "Dr. Sul Sharif",
                  title: "Computer Scientist/Organic Chemist/CSO and co-founder of SSC",
                  experience: "10+ years of experience in Cheminformatics and Artificial Intelligence",
                  education: "PhD UMB U.S.A",
                  image: "/lovable-uploads/UMB.png"
                },
                {
                  name: "Dr. Pabasara Kalansooriya",
                  title: "Senior Lecturer/Researcher",
                  experience: "10+ years of experience in Medicinal Chemistry",
                  education: "PhD UQ Australia",
                  image: "/lovable-uploads/UQ.png"
                },
                {
                  name: "Dr. Paween Mahinthichaichan",
                  title: "Former FDA/Researcher",
                  experience: "10+ years of experience in Biophysics",
                  education: "PhD UI U.S.A",
                  image: "/lovable-uploads/UI.png"
                },
                {
                  name: "Mr. Nishan Karassik",
                  title: "CIO and founder of Phylos Bioscience",
                  experience: "10+ years of experience in Biotech entrepreneurship",
                  education: "Bsc UO U.S.A",
                  image: "/lovable-uploads/UO.png"
                },
                {
                  name: "Dr. Sisira Amarasinghe",
                  title: "",
                  experience: "10+ years of experience in Information Systems",
                  education: "PhD UM U.S.A",
                  image: "/lovable-uploads/UM.png"
                }
              ].map((advisor, index) => (
                <Card key={index} className="min-w-[120px] sm:min-w-[160px] md:min-w-[240px] lg:min-w-[300px] bg-white border-2 border-transparent bg-gradient-to-r from-blue-600/10 to-purple-600/10 hover:shadow-lg transition-all transform hover:scale-105 shadow-md flex-shrink-0">
                  <div className="relative overflow-hidden bg-gray-50 p-1 md:p-3">
                    <img 
                      src={advisor.image} 
                      alt={advisor.name}
                      className="w-full h-16 sm:h-20 md:h-32 lg:h-40 object-contain"
                  />
                </div>
                  <CardHeader className="p-1 md:p-3">
                    <CardTitle className="text-xs sm:text-sm md:text-base lg:text-lg text-black hover:text-[#A50053] transition-colors leading-tight">
                      {advisor.name}
                  </CardTitle>
                    {advisor.title && (
                      <CardDescription className="text-xs sm:text-xs md:text-sm lg:text-sm text-gray-700 font-medium leading-tight">
                        {advisor.title}
                      </CardDescription>
                    )}
                    <CardDescription className="text-xs sm:text-xs md:text-xs lg:text-sm text-gray-600 leading-tight">
                      {advisor.experience}
                    </CardDescription>
                    <CardDescription className="text-xs sm:text-xs md:text-xs lg:text-sm text-gray-600 font-medium leading-tight">
                      {advisor.education}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
              {/* Duplicate cards for seamless scrolling */}
              {[
                {
                  name: "Dr. Lakmal Ranathunga",
                  title: "Lecturer/Entrepreneur/Researcher",
                  experience: "10+ years of experience in Bioinformatics and Virology",
                  education: "PhD CNU South Korea",
                  image: "/lovable-uploads/CNU.png"
                },
                {
                  name: "Dr. Sul Sharif",
                  title: "Computer Scientist/Organic Chemist/CSO and co-founder of SSC",
                  experience: "10+ years of experience in Cheminformatics and Artificial Intelligence",
                  education: "PhD UMB U.S.A",
                  image: "/lovable-uploads/UMB.png"
                },
                {
                  name: "Dr. Pabasara Kalansooriya",
                  title: "Senior Lecturer/Researcher",
                  experience: "10+ years of experience in Medicinal Chemistry",
                  education: "PhD UQ Australia",
                  image: "/lovable-uploads/UQ.png"
                },
                {
                  name: "Dr. Paween Mahinthichaichan",
                  title: "Former FDA/Researcher",
                  experience: "10+ years of experience in Biophysics",
                  education: "PhD UI U.S.A",
                  image: "/lovable-uploads/UI.png"
                },
                {
                  name: "Mr. Nishan Karassik",
                  title: "CIO and founder of Phylos Bioscience",
                  experience: "10+ years of experience in Biotech entrepreneurship",
                  education: "Bsc UO U.S.A",
                  image: "/lovable-uploads/UO.png"
                },
                {
                  name: "Dr. Sisira Amarasinghe",
                  title: "",
                  experience: "10+ years of experience in Information Systems",
                  education: "PhD UM U.S.A",
                  image: "/lovable-uploads/UM.png"
                }
              ].map((advisor, index) => (
                <Card key={`duplicate-${index}`} className="min-w-[120px] sm:min-w-[160px] md:min-w-[240px] lg:min-w-[300px] bg-white border-2 border-transparent bg-gradient-to-r from-blue-600/10 to-purple-600/10 hover:shadow-lg transition-all transform hover:scale-105 shadow-md flex-shrink-0">
                  <div className="relative overflow-hidden bg-gray-50 p-1 md:p-3">
                    <img 
                      src={advisor.image} 
                      alt={advisor.name}
                      className="w-full h-16 sm:h-20 md:h-32 lg:h-40 object-contain"
                    />
                  </div>
                  <CardHeader className="p-1 md:p-3">
                    <CardTitle className="text-xs sm:text-sm md:text-base lg:text-lg text-black hover:text-[#A50053] transition-colors leading-tight">
                      {advisor.name}
                    </CardTitle>
                    {advisor.title && (
                      <CardDescription className="text-xs sm:text-xs md:text-sm lg:text-sm text-gray-700 font-medium leading-tight">
                        {advisor.title}
                      </CardDescription>
                    )}
                    <CardDescription className="text-xs sm:text-xs md:text-xs lg:text-sm text-gray-600 leading-tight">
                      {advisor.experience}
                    </CardDescription>
                    <CardDescription className="text-xs sm:text-xs md:text-xs lg:text-sm text-gray-600 font-medium leading-tight">
                      {advisor.education}
                    </CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Latest News & Updates Section */}
      <section className="py-12 md:py-20 bg-white relative z-10" id="news">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 lg:mb-12">
            <div className="inline-block bg-[#C8FFA4] px-6 py-3 rounded-lg mb-4">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800">Latest News & Updates</h2>
            </div>
            <p className="text-lg md:text-xl text-gray-600">Stay informed about the latest developments in informatics</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {[
              {
                title: "Our Student's Achievement in the Graphical Abstract Competition 2024",
                description: "This course in Bioinformatics was helpful for our student in becoming the second runner-up in the graphical abstract competition at the Faculty of Agriculture Undergraduate Research Symposium 2024.",
                image: "/lovable-uploads/99cc8013-24dd-4850-bb4a-f02ad8490859.png"
              },
              {
                title: "Outstanding Poster Presentation Award at ICIET 2024", 
                description: "We are excited to share that our student secured first place for Outstanding Poster Presentation at the International Conference on Innovation and Emerging Technologies (ICIET) held at the Faculty of Technology, University of Sri Jayawardenapura, on the 21st and 22nd of November 2024.",
                image: "/lovable-uploads/dce54d2b-edfc-4cf2-ae59-e84b70adfc14.png"
              },
              {
                title: "Research Collaboration Announced",
                description: "Partnership with local and international institutions to advance bioinformatics research capabilities.",
                image: "/lovable-uploads/84227a92-d6f9-4c5c-9a93-d1233db16dfc.png"
              }
            ].map((article, index) => (
              <Card key={index} className="bg-white border-2 border-transparent bg-gradient-to-r from-blue-600/10 to-purple-600/10 hover:shadow-lg transition-all transform hover:scale-105 shadow-md">
                <div className="relative overflow-hidden">
                  <img 
                    src={article.image} 
                    alt={article.title}
                    className="w-full h-40 md:h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <CardHeader>
                  <CardTitle className="text-lg md:text-xl text-black hover:text-[#00A81C] transition-all">
                    {article.title}
                  </CardTitle>
                  <CardDescription className="text-sm md:text-base text-gray-700">{article.description}</CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <Button variant="link" className="p-0 text-green-600 hover:text-green-800">
                    Read More →
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Success Stories Section */}
      <section className="py-12 md:py-20 bg-white relative z-10" id="success-stories">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 lg:mb-12">
            <div className="inline-block bg-[#FFD97B] px-6 py-3 rounded-lg mb-4">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800">Success Stories</h2>
            </div>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
              Hear from our students and their achievements
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {[
              {
                name: "Saumya Poorni",
                role: "PhD Student",
                testimonial: "The bioinformatics course transformed my research approach. The practical skills I gained have been invaluable in my PhD work.",
                image: "/lovable-uploads/78dd8c5b-2728-4fb3-b89b-94b50424e57f.png"
              },
              {
                name: "Kasuni Karunarathne",
                role: "Demonstrator at UoP",
                testimonial: "This course in Bioinformatics was helpful in becoming the second runner-up in the graphical abstract competition at the Faculty of Agriculture Undergraduate Research Symposium 2024.",
                image: "/lovable-uploads/c68aaa61-6fe8-4e0f-90ef-ec26edcaf4c6.png"
              },
              {
                name: "Dharani Ariyasinghe",
                role: "Research Student",
                testimonial: "A beginner course in Bioinformatics changed my vision in drug discovery and opened new pathways in my career.",
                image: "/lovable-uploads/bd937a38-24e6-4ada-8518-99144be047af.png"
              }
            ].map((story, index) => (
              <Card key={index} className="bg-white border-2 border-transparent bg-gradient-to-r from-blue-600/10 to-purple-600/10 hover:shadow-lg transition-all transform hover:scale-105 shadow-md">
                <CardHeader className="text-center">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full overflow-hidden border-4 border-gradient-to-r from-blue-600 to-purple-600">
                    <img 
                      src={story.image} 
                      alt={story.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardTitle className="text-black hover:text-[#E5C400] transition-all cursor-pointer">{story.name}</CardTitle>
                  <CardDescription className="text-gray-700">{story.role}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 text-sm italic">"{story.testimonial}"</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-br from-[#000A33] to-[#363B6B] text-[#EAE3F5] py-12 md:py-16 relative z-10">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-6 lg:gap-8">
            <div className="space-y-4">
              <div className="flex items-center">
                <span className="text-xl font-bold text-white">Insilico.lk</span>
              </div>
              <p className="text-[#EAE3F5]/90 leading-relaxed text-sm md:text-base">
                Advancing informatics education and research in Sri Lanka through innovative programs and cutting-edge technology.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4 text-white">Quick Links</h3>
              <ul className="space-y-2">
                <li><button onClick={() => scrollToSection('team')} className="text-[#EAE3F5]/80 hover:text-white transition-colors text-sm md:text-base">Our Team</button></li>
                <li><button onClick={() => scrollToSection('research')} className="text-[#EAE3F5]/80 hover:text-white transition-colors text-sm md:text-base">Research</button></li>
                <li><button onClick={() => scrollToSection('courses')} className="text-[#EAE3F5]/80 hover:text-white transition-colors text-sm md:text-base">Courses</button></li>
                <li><button onClick={() => scrollToSection('services')} className="text-[#EAE3F5]/80 hover:text-white transition-colors text-sm md:text-base">Services</button></li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4 text-white">Programs</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-[#EAE3F5]/80 hover:text-white transition-colors text-sm md:text-base">Certificate Courses</a></li>
                <li><a href="#" className="text-[#EAE3F5]/80 hover:text-white transition-colors text-sm md:text-base">Workshops</a></li>
                <li><a href="#" className="text-[#EAE3F5]/80 hover:text-white transition-colors text-sm md:text-base">Research Projects</a></li>
                <li><a href="#" className="text-[#EAE3F5]/80 hover:text-white transition-colors text-sm md:text-base">Collaborations</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4 text-white">Connect With Us</h3>
              <div className="space-y-4">
                <p className="text-[#EAE3F5]/80 text-sm md:text-base">
                  Email: info@bioinformatics.lk<br />
                  Phone: 0765617680, 0775297815
                </p>
              </div>
            </div>
          </div>

          <div className="border-t border-[#EAE3F5]/20 mt-8 lg:mt-12 pt-6 lg:pt-8 text-center text-[#EAE3F5]/80">
            <p className="text-sm md:text-base">&copy; 2024 Insilico.lk. All rights reserved. | Privacy Policy | Terms of Service</p>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
      <ContactModal isOpen={contactModalOpen} onClose={() => setContactModalOpen(false)} />
    </div>
  );
};

export default memo(Index);
