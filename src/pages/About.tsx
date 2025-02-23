import React from 'react';
import { Shield, Database, Lock } from 'lucide-react';
import { motion } from 'framer-motion';

export default function About() {
  return (
    <div className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">About Evidence Chain</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Revolutionizing evidence management through blockchain technology and secure
            distributed storage.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white p-6 rounded-lg shadow-lg"
          >
            <Shield className="h-12 w-12 text-blue-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Blockchain Technology</h3>
            <p className="text-gray-600">
              Our platform utilizes blockchain technology to create an immutable record of
              evidence submissions and chain of custody.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white p-6 rounded-lg shadow-lg"
          >
            <Database className="h-12 w-12 text-blue-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">IPFS Storage</h3>
            <p className="text-gray-600">
              Evidence files are stored securely using IPFS, ensuring decentralized and
              permanent storage of critical data.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white p-6 rounded-lg shadow-lg"
          >
            <Lock className="h-12 w-12 text-blue-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Secure Transactions</h3>
            <p className="text-gray-600">
              All transactions are cryptographically signed and verified, maintaining the
              highest level of security and trust.
            </p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-lg shadow-lg p-8 mb-16"
        >
          <h2 className="text-2xl font-bold mb-4">How It Works</h2>
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-600 text-white flex items-center justify-center">
                1
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold">Evidence Submission</h3>
                <p className="text-gray-600">
                  Users submit evidence through our secure platform, providing necessary
                  metadata and documentation.
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-600 text-white flex items-center justify-center">
                2
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold">IPFS Storage</h3>
                <p className="text-gray-600">
                  Evidence files are uploaded to IPFS, generating a unique hash that serves
                  as a permanent reference.
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-600 text-white flex items-center justify-center">
                3
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold">Blockchain Recording</h3>
                <p className="text-gray-600">
                  The IPFS hash and metadata are recorded on the blockchain, creating an
                  immutable record of the evidence.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-center"
        >
          <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
          <p className="text-gray-600 max-w-3xl mx-auto">
            Evidence Chain is committed to revolutionizing the way judicial systems handle
            evidence by providing a secure, transparent, and efficient platform that ensures
            the integrity of every piece of evidence throughout its lifecycle.
          </p>
        </motion.div>
      </div>
    </div>
  );
}