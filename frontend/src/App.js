import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <nav className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-nexa-primary">NexaDesk</h1>
          <div className="space-x-4">
            <Link to="/login" className="btn-outline">Login</Link>
            <Link to="/register" className="btn-primary">Register</Link>
          </div>
        </div>
      </nav>
      
      <main className="container mx-auto px-4 py-12">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-5xl font-bold text-gray-800 mb-6">
            IT Help Desk Made Simple
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Streamline your IT support with our modern ticket management system. 
            Track, prioritize, and resolve issues efficiently.
          </p>
          <div className="flex justify-center gap-4">
            <button className="btn-primary text-lg px-8 py-3">Get Started</button>
            <button className="btn-outline text-lg px-8 py-3">Learn More</button>
          </div>
          
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="card">
              <div className="text-4xl mb-3">🎫</div>
              <h3 className="font-semibold text-lg mb-2">Create Tickets</h3>
              <p className="text-gray-600">Submit and track support requests instantly</p>
            </div>
            <div className="card">
              <div className="text-4xl mb-3">⚡</div>
              <h3 className="font-semibold text-lg mb-2">Real-time Updates</h3>
              <p className="text-gray-600">Stay informed with status changes and comments</p>
            </div>
            <div className="card">
              <div className="text-4xl mb-3">📊</div>
              <h3 className="font-semibold text-lg mb-2">Analytics Dashboard</h3>
              <p className="text-gray-600">Gain insights into your support operations</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<div className="container mx-auto px-4 py-12"><h1 className="text-3xl font-bold">Login Page</h1><p>Coming soon...</p></div>} />
        <Route path="/register" element={<div className="container mx-auto px-4 py-12"><h1 className="text-3xl font-bold">Register Page</h1><p>Coming soon...</p></div>} />
      </Routes>
    </Router>
  );
}

export default App;
