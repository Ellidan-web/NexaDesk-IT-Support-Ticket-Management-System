import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import logo from './assets/logo.png';

// SVG Icon Components
const TicketIcon = () => (
  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
  </svg>
);

const CollaborationIcon = () => (
  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>
);

const AnalyticsIcon = () => (
  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

const SecurityIcon = () => (
  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
);

const UpdatesIcon = () => (
  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
);

const ResponsiveIcon = () => (
  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L15 12.75 9.75 8.5M9 3.75L8.25 3m8.25 0L16.5 3m-13.5 0a2.25 2.25 0 00-2.25 2.25v13.5a2.25 2.25 0 002.25 2.25h13.5a2.25 2.25 0 002.25-2.25V5.25a2.25 2.25 0 00-2.25-2.25H3z" />
  </svg>
);

function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white/95 backdrop-blur-sm shadow-lg' : 'bg-transparent'
    }`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link to="/" className="flex items-center space-x-3 group">
            <img src={logo} alt="NexaDesk" className="h-10 w-auto" />
            <span className="text-2xl font-bold text-nexa-primary">Nexa<span className="text-nexa-accent">Desk</span></span>
          </Link>
          
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-nexa-gray hover:text-nexa-primary font-medium transition-colors">Features</a>
            <a href="#pricing" className="text-nexa-gray hover:text-nexa-primary font-medium transition-colors">Pricing</a>
            <a href="#about" className="text-nexa-gray hover:text-nexa-primary font-medium transition-colors">About</a>
          </div>

          <div className="flex items-center space-x-4">
            <Link to="/login" className="hidden md:inline-block text-nexa-primary hover:text-nexa-accent font-medium transition-colors">
              Sign In
            </Link>
            <Link to="/register" className="btn-primary text-sm px-5 py-2.5">
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-nexa-light via-white to-blue-50">
      <div className="absolute inset-0 bg-hero-pattern opacity-50"></div>
      
      <div className="absolute top-20 left-10 w-72 h-72 bg-nexa-accent/20 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-32">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center space-x-2 bg-nexa-accent/10 text-nexa-accent px-4 py-2 rounded-full text-sm font-medium animate-fade-in">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-nexa-accent opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-nexa-accent"></span>
              </span>
              <span>IT Help Desk Platform</span>
            </div>
            
            <h1 className="section-title animate-fade-in">
              Streamline IT Support<br />
              <span className="gradient-text">For Modern Teams</span>
            </h1>
            
            <p className="section-subtitle animate-fade-in animate-delay-1">
              A complete ticket management system designed to help your team
              track, prioritize, and resolve issues efficiently.
            </p>
            
            <div className="flex flex-wrap gap-4 animate-fade-in animate-delay-2">
              <Link to="/register" className="btn-primary text-lg px-8 py-4 flex items-center space-x-2 group">
                <span>Get Started</span>
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <button className="btn-secondary text-lg px-8 py-4 flex items-center space-x-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Watch Demo</span>
              </button>
            </div>
          </div>
          
          <div className="relative animate-fade-in animate-delay-2">
            <div className="glass-effect rounded-2xl shadow-2xl p-6 border border-white/30">
              <div className="bg-white rounded-xl p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-bold text-nexa-primary">Recent Tickets</h3>
                  <span className="text-sm text-nexa-accent hover:underline cursor-pointer">View all →</span>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-nexa-light rounded-xl hover:shadow-md transition-shadow">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <span className="font-medium text-nexa-primary">Ticket #001</span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="text-xs px-2 py-1 rounded-full font-medium bg-red-100 text-red-600">Open</span>
                      <span className="text-sm text-nexa-gray">High</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-nexa-light rounded-xl hover:shadow-md transition-shadow">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      <span className="font-medium text-nexa-primary">Ticket #002</span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="text-xs px-2 py-1 rounded-full font-medium bg-yellow-100 text-yellow-600">In Progress</span>
                      <span className="text-sm text-nexa-gray">Medium</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-nexa-light rounded-xl hover:shadow-md transition-shadow">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="font-medium text-nexa-primary">Ticket #003</span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="text-xs px-2 py-1 rounded-full font-medium bg-green-100 text-green-600">Resolved</span>
                      <span className="text-sm text-nexa-gray">Low</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl p-4 animate-float">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-bold text-nexa-primary">98%</p>
                  <p className="text-xs text-nexa-gray">Resolution Rate</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FeaturesSection() {
  const features = [
    {
      icon: <TicketIcon />,
      title: 'Ticket Management',
      description: 'Create, assign, and track support tickets with custom priority levels and status tracking.',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: <CollaborationIcon />,
      title: 'Team Collaboration',
      description: 'Assign tickets to team members, add comments, and keep everyone in the loop.',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: <AnalyticsIcon />,
      title: 'Analytics & Reports',
      description: 'Track response times, resolution rates, and team performance metrics.',
      color: 'from-orange-500 to-red-500'
    },
    {
      icon: <SecurityIcon />,
      title: 'Secure Access',
      description: 'Role-based access control with secure authentication and data protection.',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: <UpdatesIcon />,
      title: 'Real-time Updates',
      description: 'Instant notifications and live status updates for all ticket activities.',
      color: 'from-indigo-500 to-purple-500'
    },
    {
      icon: <ResponsiveIcon />,
      title: 'Responsive Design',
      description: 'Access and manage tickets from any device with a fully responsive interface.',
      color: 'from-teal-500 to-cyan-500'
    },
  ];

  return (
    <section id="features" className="py-32 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-nexa-accent font-semibold text-sm uppercase tracking-wider">Features</span>
          <h2 className="text-4xl md:text-5xl font-bold text-nexa-primary mt-4 mb-6">
            Everything You Need to <span className="gradient-text">Succeed</span>
          </h2>
          <p className="text-xl text-nexa-gray">
            A complete set of tools to manage your IT support operations efficiently.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="card group animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
              <div className={`w-14 h-14 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-nexa-primary mb-3">{feature.title}</h3>
              <p className="text-nexa-gray leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className="py-32 bg-gradient-to-br from-nexa-primary to-slate-800 relative overflow-hidden">
      <div className="absolute inset-0 bg-hero-pattern opacity-10"></div>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
          Ready to Get Started?
        </h2>
        <p className="text-xl text-white/80 max-w-2xl mx-auto mb-10">
          Create your account today and start managing support tickets efficiently.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link to="/register" className="bg-white text-nexa-primary px-8 py-4 rounded-lg font-bold hover:scale-105 transition-all duration-300 shadow-2xl">
            Create Account
          </Link>
          <Link to="/login" className="border-2 border-white/30 text-white px-8 py-4 rounded-lg font-bold hover:bg-white/10 transition-all duration-300">
            Sign In
          </Link>
        </div>
        <p className="text-white/60 text-sm mt-6">Free forever plan available • No credit card required</p>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-nexa-light border-t border-gray-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <img src={logo} alt="NexaDesk" className="h-8 w-auto" />
              <span className="text-xl font-bold text-nexa-primary">Nexa<span className="text-nexa-accent">Desk</span></span>
            </div>
            <p className="text-nexa-gray text-sm">IT Support Ticket Management</p>
          </div>
          <div>
            <h4 className="font-bold text-nexa-primary mb-4">Product</h4>
            <ul className="space-y-2 text-nexa-gray">
              <li><a href="#features" className="hover:text-nexa-accent transition-colors">Features</a></li>
              <li><a href="#pricing" className="hover:text-nexa-accent transition-colors">Pricing</a></li>
              <li><a href="#" className="hover:text-nexa-accent transition-colors">Documentation</a></li>
              <li><a href="#" className="hover:text-nexa-accent transition-colors">Changelog</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-nexa-primary mb-4">Company</h4>
            <ul className="space-y-2 text-nexa-gray">
              <li><a href="#" className="hover:text-nexa-accent transition-colors">About</a></li>
              <li><a href="#" className="hover:text-nexa-accent transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-nexa-accent transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-nexa-accent transition-colors">Contact</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-nexa-primary mb-4">Legal</h4>
            <ul className="space-y-2 text-nexa-gray">
              <li><a href="#" className="hover:text-nexa-accent transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-nexa-accent transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-nexa-accent transition-colors">Security</a></li>
              <li><a href="#" className="hover:text-nexa-accent transition-colors">Cookie Policy</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-200 mt-8 pt-8 text-center text-nexa-gray text-sm">
          <p>© 2026 NexaDesk. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

function Home() {
  return (
    <div>
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <CTASection />
      <Footer />
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={
          <div className="min-h-screen flex items-center justify-center bg-nexa-light">
            <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full">
              <h1 className="text-3xl font-bold text-nexa-primary mb-4">Sign In</h1>
              <p className="text-nexa-gray mb-8">Login to your NexaDesk account</p>
              <div className="space-y-4">
                <input type="email" placeholder="Email" className="w-full px-4 py-3 border rounded-lg" />
                <input type="password" placeholder="Password" className="w-full px-4 py-3 border rounded-lg" />
                <button className="w-full btn-primary py-3">Sign In</button>
              </div>
            </div>
          </div>
        } />
        <Route path="/register" element={
          <div className="min-h-screen flex items-center justify-center bg-nexa-light">
            <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full">
              <h1 className="text-3xl font-bold text-nexa-primary mb-4">Create Account</h1>
              <p className="text-nexa-gray mb-8">Start managing tickets today</p>
              <div className="space-y-4">
                <input type="text" placeholder="Full Name" className="w-full px-4 py-3 border rounded-lg" />
                <input type="email" placeholder="Email" className="w-full px-4 py-3 border rounded-lg" />
                <input type="password" placeholder="Password" className="w-full px-4 py-3 border rounded-lg" />
                <button className="w-full btn-primary py-3">Create Account</button>
              </div>
            </div>
          </div>
        } />
      </Routes>
    </Router>
  );
}

export default App;