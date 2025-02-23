import React from 'react';
import { Shield, Lock, Database, FileCheck, Users, Clock, Search, Activity } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Feature } from '../types';

export default function Features() {
  const features: Feature[] = [
    {
      title: 'Blockchain Security',
      description: 'Leverage the power of blockchain technology to create immutable records of evidence chain of custody.',
      icon: Shield,
    },
    {
      title: 'IPFS Storage',
      description: 'Secure file storage using the InterPlanetary File System (IPFS) for decentralized content addressing.',
      icon: Database,
    },
    {
      title: 'Tamper-Proof Records',
      description: 'Cryptographically secured evidence records that cannot be altered once submitted.',
      icon: Lock,
    },
    {
      title: 'Easy Submission',
      description: 'User-friendly interface for submitting and managing evidence files.',
      icon: FileCheck,
    },
    {
      title: 'Multi-User Access',
      description: 'Role-based access control for different stakeholders in the judicial system.',
      icon: Users,
    },
    {
      title: 'Real-Time Updates',
      description: 'Instant verification and updates of evidence submission status.',
      icon: Clock,
    },
    {
      title: 'Advanced Search',
      description: 'Powerful search capabilities to quickly locate specific evidence records.',
      icon: Search,
    },
    {
      title: 'Audit Trail',
      description: 'Complete history of all interactions with evidence records.',
      icon: Activity,
    },
  ];

  return (
    <div className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold text-gray-900 mb-4"
          >
            Platform Features
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-600"
          >
            Discover how Evidence Chain revolutionizes evidence management
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
            >
              <feature.icon className="h-12 w-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}