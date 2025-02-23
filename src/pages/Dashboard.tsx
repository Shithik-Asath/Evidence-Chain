import React, { useState } from 'react';
import { Upload, File } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Evidence } from '../types';

export default function Dashboard() {
  const [publicKey, setPublicKey] = useState('');
  const [caseId, setCaseId] = useState('');
  const [evidenceList, setEvidenceList] = useState<Evidence[]>([]);
  const [showForm, setShowForm] = useState(false);

  const [newEvidence, setNewEvidence] = useState({
    name: '',
    description: '',
    type: 'document',
    file: null as File | null,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const mockEvidence: Evidence = {
      id: Math.random().toString(36).substr(2, 9),
      name: newEvidence.name,
      description: newEvidence.description,
      type: newEvidence.type as 'document' | 'audio' | 'video',
      ipfsHash: 'QmX7b5w9Rj5k5S4v6J8n5t5Z5Y5Z5Y5Z5Y5Z5Y5Z5Y5Y5',
      timestamp: new Date().toISOString(),
      transactionHash: '0x123...abc',
    };
    setEvidenceList([...evidenceList, mockEvidence]);
    setShowForm(false);
    setNewEvidence({ name: '', description: '', type: 'document', file: null });
  };

  return (
    <div className="py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-lg p-6 mb-8"
        >
          <h2 className="text-2xl font-bold mb-6">Evidence Dashboard</h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-lg shadow-lg p-6"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold">Evidence List</h3>
                <button
                  onClick={() => setShowForm(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Add Evidence
                </button>
              </div>
              <ul className="space-y-4">
                {evidenceList.map((evidence) => (
                  <li key={evidence.id} className="border p-4 rounded-lg shadow-sm">
                    <h4 className="font-bold">{evidence.name}</h4>
                    <p>{evidence.description}</p>
                    <p className="text-sm text-gray-500">Type: {evidence.type}</p>
                    <p className="text-sm text-gray-500">IPFS Hash: {evidence.ipfsHash}</p>
                    <p className="text-sm text-gray-500">Transaction: {evidence.transactionHash}</p>
                    <p className="text-sm text-gray-500">Timestamp: {new Date(evidence.timestamp).toLocaleString()}</p>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

          {showForm && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-1"
            >
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-semibold mb-6">Add New Evidence</h3>
                <form onSubmit={handleSubmit}>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                      <input
                        type="text"
                        value={newEvidence.name}
                        onChange={(e) => setNewEvidence({ ...newEvidence, name: e.target.value })}
                        className="w-full p-2 border rounded-md"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                      <textarea
                        value={newEvidence.description}
                        onChange={(e) => setNewEvidence({ ...newEvidence, description: e.target.value })}
                        className="w-full p-2 border rounded-md"
                        rows={3}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                      <select
                        value={newEvidence.type}
                        onChange={(e) => setNewEvidence({ ...newEvidence, type: e.target.value })}
                        className="w-full p-2 border rounded-md"
                        required
                      >
                        <option value="document">Document</option>
                        <option value="audio">Audio</option>
                        <option value="video">Video</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">File Upload</label>
                      <input
                        type="file"
                        className="w-full p-2 border rounded-md"
                        onChange={(e) => setNewEvidence({ ...newEvidence, file: e.target.files?.[0] || null })}
                        required
                      />
                    </div>
                    <div className="flex justify-end space-x-4">
                      <button
                        type="button"
                        onClick={() => setShowForm(false)}
                        className="px-4 py-2 border rounded-md hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                      >
                        Submit Evidence
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
