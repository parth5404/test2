'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-orange-500 to-yellow-500 text-white py-32 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/chai-pattern.png')] opacity-10"></div>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="container mx-auto px-4 text-center relative z-10"
        >
          <h1 className="text-6xl md:text-7xl font-bold mb-6">
            Get Me A <span className="text-yellow-200 inline-block hover:scale-105 transition-transform">Chai</span>
          </h1>
          <p className="text-xl md:text-2xl mb-12 text-orange-100">
            Support your favorite creators with a virtual cup of chai!
            <br />Make their day a little warmer ☕
          </p>
          <div className="space-x-6">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-block"
            >
              <Link href="/explore" 
                className="bg-white text-orange-600 px-8 py-4 rounded-full font-semibold hover:bg-orange-100 transition-colors inline-block shadow-lg hover:shadow-xl">
                Explore Creators
              </Link>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-block"
            >
              <Link href="/register" 
                className="bg-orange-600 text-white px-8 py-4 rounded-full font-semibold hover:bg-orange-700 transition-colors inline-block shadow-lg hover:shadow-xl border-2 border-orange-200/20">
                Become a Creator
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-gradient-to-b from-orange-50 to-white">
        <div className="container mx-auto px-4">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl font-bold text-center mb-16 text-gray-800"
          >
            Why Choose Get Me A Chai?
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                icon: "🎯",
                title: "Direct Support",
                description: "Support your favorite creators directly, ensuring they get the appreciation they deserve."
              },
              {
                icon: "💫",
                title: "Easy to Use",
                description: "Simple and intuitive platform to connect with creators and show your support."
              },
              {
                icon: "🌟",
                title: "Instant Rewards",
                description: "Creators receive instant notifications and can engage with supporters in real-time."
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                whileHover={{ y: -5 }}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all"
              >
                <div className="text-5xl mb-6">{feature.icon}</div>
                <h3 className="text-2xl font-semibold mb-4 text-gray-800">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Social Proof Section */}
      <div className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-6 text-gray-800">Trusted by Creators</h2>
            <p className="text-xl text-gray-600">Join thousands of creators who are receiving support through virtual chai</p>
          </motion.div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[...Array(4)].map((_, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-orange-50 rounded-2xl p-6 text-center"
              >
                <div className="text-4xl font-bold text-orange-600 mb-2">
                  {[
                    "1000+",
                    "₹50L+",
                    "4.9/5",
                    "24/7"
                  ][index]}
                </div>
                <div className="text-gray-600">
                  {[
                    "Active Creators",
                    "Support Given",
                    "Creator Rating",
                    "Support"
                  ][index]}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
