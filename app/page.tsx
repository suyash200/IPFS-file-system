// pages/index.js
"use client"
import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <Head>
        <title>DecentralStore - IPFS Storage Solution</title>
        <meta name="description" content="Secure, decentralized file storage powered by IPFS" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Navigation */}
      <nav className="px-6 py-4 bg-gray-900 shadow-md">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <svg className="w-8 h-8 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
            </svg>
            <span className="text-xl font-bold">DecentralStore</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link href="#features" className="hover:text-blue-400 transition-colors">
              Features
            </Link>
            <Link href="#how-it-works" className="hover:text-blue-400 transition-colors">
              How It Works
            </Link>
            <Link href="/auth/login" className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg transition-colors">
              Sign In
            </Link>
            <Link href="/auth/login" className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-lg transition-colors">
              Get Started
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-200 hover:text-white focus:outline-none"
            >
              {isMenuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                </svg>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-gray-800 py-4">
          <div className="container mx-auto px-6 flex flex-col space-y-4">
            <Link href="#features" className="hover:text-blue-400 transition-colors py-2">
              Features
            </Link>
            <Link href="#how-it-works" className="hover:text-blue-400 transition-colors py-2">
              How It Works
            </Link>
            <Link href="/login" className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg transition-colors text-center">
              Sign In
            </Link>
            <Link href="/auth/register" className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-lg transition-colors text-center">
              Get Started
            </Link>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
                Secure, Decentralized File Storage with IPFS
              </h1>
              <p className="text-lg md:text-xl text-gray-300 mb-8">
                Store your files on the InterPlanetary File System. Distributed, encrypted, and immutable storage for the modern web.
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <Link href="/auth/register" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg text-center transition-colors">
                  Start For Free
                </Link>
                <Link href="#how-it-works" className="bg-transparent border border-white hover:bg-white hover:text-gray-900 text-white font-bold py-3 px-6 rounded-lg text-center transition-colors">
                  Learn More
                </Link>
              </div>
            </div>
            <div className="md:w-1/2">
              <img src="/api/placeholder/600/400" alt="IPFS Storage Illustration" className="rounded-xl shadow-2xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 bg-gray-800">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose DecentralStore?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-gray-700 p-6 rounded-lg hover:shadow-lg transition-shadow">
              <div className="bg-blue-500 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">End-to-End Encryption</h3>
              <p className="text-gray-300">Your files are encrypted before they leave your device, ensuring only you can access your data.</p>
            </div>

            {/* Feature 2 */}
            <div className="bg-gray-700 p-6 rounded-lg hover:shadow-lg transition-shadow">
              <div className="bg-green-500 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Decentralized Network</h3>
              <p className="text-gray-300">Files are stored across a global network of nodes, eliminating single points of failure.</p>
            </div>

            {/* Feature 3 */}
            <div className="bg-gray-700 p-6 rounded-lg hover:shadow-lg transition-shadow">
              <div className="bg-purple-500 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Content Addressing</h3>
              <p className="text-gray-300">Files are identified by their content, ensuring data integrity and preventing tampering.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-16">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid md:grid-cols-4 gap-8">
            {/* Step 1 */}
            <div className="text-center">
              <div className="bg-blue-500 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold">1</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Upload Files</h3>
              <p className="text-gray-300">Easily drag and drop files through our intuitive interface.</p>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="bg-blue-500 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold">2</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Encryption</h3>
              <p className="text-gray-300">Files are automatically encrypted using your personal keys.</p>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="bg-blue-500 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold">3</span>
              </div>
              <h3 className="text-xl font-bold mb-2">IPFS Storage</h3>
              <p className="text-gray-300">Content is distributed across the IPFS network.</p>
            </div>

            {/* Step 4 */}
            <div className="text-center">
              <div className="bg-blue-500 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold">4</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Access Anywhere</h3>
              <p className="text-gray-300">Retrieve your files from any device, anytime.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Additional Features */}
      <section className="py-16 bg-gray-800">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">Advanced Features</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {/* Feature 1 */}
            <div className="flex items-start">
              <div className="bg-yellow-500 rounded-full w-10 h-10 flex items-center justify-center mr-4 flex-shrink-0">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-bold mb-2">File Versioning</h3>
                <p className="text-gray-300">Keep track of all changes to your files with automatic versioning. Restore previous versions at any time.</p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="flex items-start">
              <div className="bg-green-500 rounded-full w-10 h-10 flex items-center justify-center mr-4 flex-shrink-0">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2"></path>
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-bold mb-2">File Sharing</h3>
                <p className="text-gray-300">Securely share files with friends and colleagues. Control access with customizable permissions.</p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="flex items-start">
              <div className="bg-blue-500 rounded-full w-10 h-10 flex items-center justify-center mr-4 flex-shrink-0">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-bold mb-2">Usage Analytics</h3>
                <p className="text-gray-300">Monitor your storage usage and file access patterns with detailed analytics and insights.</p>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="flex items-start">
              <div className="bg-purple-500 rounded-full w-10 h-10 flex items-center justify-center mr-4 flex-shrink-0">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-bold mb-2">Mobile Access</h3>
                <p className="text-gray-300">Access your files on the go with our mobile apps for iOS and Android devices.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to secure your files with IPFS?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">Join thousands of users trusting DecentralStore with their data.</p>
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link href="/auth/register" className="bg-white text-blue-600 hover:bg-gray-100 font-bold py-3 px-8 rounded-lg transition-colors w-full sm:w-auto">
              Get Started Free
            </Link>
            <Link href="/auth/login" className="bg-transparent border-2 border-white hover:bg-white hover:text-blue-600 text-white font-bold py-3 px-8 rounded-lg transition-colors w-full sm:w-auto">
              Sign In
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}


































