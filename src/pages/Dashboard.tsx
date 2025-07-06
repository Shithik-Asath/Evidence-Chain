import React, { useState } from 'react';
import { Upload, File, Plus, Search, Calendar, Hash, User, Eye, CheckCircle, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useEvidence } from '../hooks/useEvidence';
import { useCases } from '../hooks/useCases';
import { connectWallet, signMessage } from '../utils/web3';
import EvidenceViewer from '../components/EvidenceViewer';
import type { Database } from '../lib/supabase';

type EvidenceRecord = Database['public']['Tables']['evidence_records']['Row'];
type CaseRecord = Database['public']['Tables']['case_records']['Row'];

export default function Dashboard() {
  const { evidence, loading: evidenceLoading, submitEvidence, fetchEvidence } = useEvidence();
  const { cases, loading: casesLoading, createCase, fetchCases } = useCases();
  const [activeTab, setActiveTab] = useState<'evidence' | 'cases' | 'verification'>('evidence');
  const [showEvidenceForm, setShowEvidenceForm] = useState(false);
  const [showCaseForm, setShowCaseForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedEvidence, setSelectedEvidence] = useState<EvidenceRecord | null>(null);
  const [showEvidenceViewer, setShowEvidenceViewer] = useState(false);
  const [selectedCase, setSelectedCase] = useState<CaseRecord | null>(null);
  const [caseEvidence, setCaseEvidence] = useState<EvidenceRecord[]>([]);

  const [newEvidence, setNewEvidence] = useState({
    name: '',
    description: '',
    type: 'document',
    file: null as File | null,
    caseNumber: '',
  });

  const [newCase, setNewCase] = useState({
    case_number: '',
    title: '',
    description: '',
  });

  const handleViewEvidence = (evidenceItem: EvidenceRecord) => {
    setSelectedEvidence(evidenceItem);
    setShowEvidenceViewer(true);
  };

  const handleVerifyCase = (caseItem: CaseRecord) => {
    setSelectedCase(caseItem);
    // Filter evidence related to this case
    const relatedEvidence = evidence.filter(ev => 
      ev.metadata?.caseNumber === caseItem.case_number ||
      ev.metadata?.name?.toLowerCase().includes(caseItem.case_number.toLowerCase()) ||
      ev.metadata?.description?.toLowerCase().includes(caseItem.case_number.toLowerCase())
    );
    setCaseEvidence(relatedEvidence);
    setActiveTab('verification');
  };

  const handleEvidenceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Connect wallet
      const walletAddress = await connectWallet();
      
      // Create mock IPFS hash (in production, upload to IPFS first)
      const mockIpfsHash = `Qm${Math.random().toString(36).substr(2, 44)}`;
      
      // Sign message for verification
      const message = `Submit evidence: ${mockIpfsHash}`;
      const signature = await signMessage(message);
      
      // Create mock transaction hash (in production, submit to blockchain)
      const mockTxHash = `0x${Math.random().toString(16).substr(2, 64)}`;

      // Submit to database
      await submitEvidence({
        ipfs_hash: mockIpfsHash,
        metadata: {
          name: newEvidence.name,
          description: newEvidence.description,
          type: newEvidence.type,
          fileName: newEvidence.file?.name,
          fileSize: newEvidence.file?.size,
          caseNumber: newEvidence.caseNumber,
          signature
        },
        submitter_address: walletAddress,
        transaction_hash: mockTxHash
      });

      // Reset form and refresh data
      setNewEvidence({ name: '', description: '', type: 'document', file: null, caseNumber: '' });
      setShowEvidenceForm(false);
      await fetchEvidence(); // Manual refresh
      
      alert('Evidence submitted successfully!');
    } catch (error) {
      console.error('Error submitting evidence:', error);
      alert('Failed to submit evidence. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCaseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await createCase(newCase);
      setNewCase({ case_number: '', title: '', description: '' });
      setShowCaseForm(false);
      await fetchCases(); // Manual refresh
      alert('Case created successfully!');
    } catch (error) {
      console.error('Error creating case:', error);
      alert('Failed to create case. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-10 min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-lg p-6 mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Evidence Chain Dashboard</h1>
              <p className="text-gray-600">Manage evidence records and verify cases securely on the blockchain</p>
            </div>
            <div className="flex items-center gap-2 text-blue-600">
              <CheckCircle className="h-5 w-5" />
              <span className="text-sm font-medium">Verification System</span>
            </div>
          </div>
        </motion.div>

        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('evidence')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'evidence'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Evidence Records ({evidence.length})
              </button>
              <button
                onClick={() => setActiveTab('cases')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'cases'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Case Records ({cases.length})
              </button>
              <button
                onClick={() => setActiveTab('verification')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'verification'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Case Verification {selectedCase && `(${selectedCase.case_number})`}
              </button>
            </nav>
          </div>
        </div>

        {/* Evidence Tab */}
        {activeTab === 'evidence' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-lg shadow-lg p-6"
              >
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-semibold">Evidence Records</h3>
                  <button
                    onClick={() => setShowEvidenceForm(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Add Evidence
                  </button>
                </div>

                {evidenceLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-2 text-gray-600">Loading evidence...</p>
                  </div>
                ) : evidence.length === 0 ? (
                  <div className="text-center py-8">
                    <File className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No evidence records found</p>
                    <p className="text-sm text-gray-500 mt-2">Submit your first evidence to get started</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {evidence.map((item) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="border border-gray-200 p-4 rounded-lg hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="font-semibold text-lg text-gray-900">
                                {item.metadata?.name || 'Unnamed Evidence'}
                              </h4>
                              {item.metadata?.caseNumber && (
                                <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                                  Case: {item.metadata.caseNumber}
                                </span>
                              )}
                            </div>
                            <p className="text-gray-600 mt-1">
                              {item.metadata?.description || 'No description provided'}
                            </p>
                            <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-500">
                              <div className="flex items-center gap-1">
                                <Hash className="h-4 w-4" />
                                <span>IPFS: {item.ipfs_hash.substring(0, 20)}...</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <User className="h-4 w-4" />
                                <span>Submitter: {item.submitter_address.substring(0, 10)}...</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                <span>
                                  {item.created_at ? new Date(item.created_at).toLocaleDateString() : 'Unknown date'}
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                <File className="h-4 w-4" />
                                <span>Type: {item.metadata?.type || 'Unknown'}</span>
                              </div>
                            </div>
                          </div>
                          <button
                            onClick={() => handleViewEvidence(item)}
                            className="ml-4 bg-blue-100 text-blue-700 px-3 py-2 rounded-md hover:bg-blue-200 transition-colors flex items-center gap-2"
                          >
                            <Eye className="h-4 w-4" />
                            View Details
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            </div>

            {/* Evidence Form */}
            {showEvidenceForm && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="lg:col-span-1"
              >
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <h3 className="text-xl font-semibold mb-6">Add New Evidence</h3>
                  <form onSubmit={handleEvidenceSubmit}>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                        <input
                          type="text"
                          value={newEvidence.name}
                          onChange={(e) => setNewEvidence({ ...newEvidence, name: e.target.value })}
                          className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                        <textarea
                          value={newEvidence.description}
                          onChange={(e) => setNewEvidence({ ...newEvidence, description: e.target.value })}
                          className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          rows={3}
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Case Number (Optional)</label>
                        <input
                          type="text"
                          value={newEvidence.caseNumber}
                          onChange={(e) => setNewEvidence({ ...newEvidence, caseNumber: e.target.value })}
                          className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="e.g., CASE-2024-001"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                        <select
                          value={newEvidence.type}
                          onChange={(e) => setNewEvidence({ ...newEvidence, type: e.target.value })}
                          className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          required
                        >
                          <option value="document">Document</option>
                          <option value="audio">Audio</option>
                          <option value="video">Video</option>
                          <option value="image">Image</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">File Upload</label>
                        <input
                          type="file"
                          className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          onChange={(e) => setNewEvidence({ ...newEvidence, file: e.target.files?.[0] || null })}
                          required
                        />
                      </div>
                      <div className="flex justify-end space-x-4 pt-4">
                        <button
                          type="button"
                          onClick={() => setShowEvidenceForm(false)}
                          className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                          disabled={isSubmitting}
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? 'Submitting...' : 'Submit Evidence'}
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </motion.div>
            )}
          </div>
        )}

        {/* Cases Tab */}
        {activeTab === 'cases' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-lg shadow-lg p-6"
              >
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-semibold">Case Records</h3>
                  <button
                    onClick={() => setShowCaseForm(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Create Case
                  </button>
                </div>

                {casesLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-2 text-gray-600">Loading cases...</p>
                  </div>
                ) : cases.length === 0 ? (
                  <div className="text-center py-8">
                    <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No case records found</p>
                    <p className="text-sm text-gray-500 mt-2">Create your first case to get started</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {cases.map((caseItem) => {
                      const relatedEvidenceCount = evidence.filter(ev => 
                        ev.metadata?.caseNumber === caseItem.case_number ||
                        ev.metadata?.name?.toLowerCase().includes(caseItem.case_number.toLowerCase()) ||
                        ev.metadata?.description?.toLowerCase().includes(caseItem.case_number.toLowerCase())
                      ).length;

                      return (
                        <motion.div
                          key={caseItem.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="border border-gray-200 p-4 rounded-lg hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                                  {caseItem.case_number}
                                </span>
                                <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
                                  {relatedEvidenceCount} Evidence{relatedEvidenceCount !== 1 ? 's' : ''}
                                </span>
                              </div>
                              <h4 className="font-semibold text-lg text-gray-900 mb-1">
                                {caseItem.title}
                              </h4>
                              {caseItem.description && (
                                <p className="text-gray-600 mb-3">
                                  {caseItem.description}
                                </p>
                              )}
                              <div className="flex items-center gap-1 text-sm text-gray-500">
                                <Calendar className="h-4 w-4" />
                                <span>
                                  Created: {caseItem.created_at ? new Date(caseItem.created_at).toLocaleDateString() : 'Unknown date'}
                                </span>
                              </div>
                            </div>
                            <button
                              onClick={() => handleVerifyCase(caseItem)}
                              className="ml-4 bg-green-100 text-green-700 px-3 py-2 rounded-md hover:bg-green-200 transition-colors flex items-center gap-2"
                            >
                              <CheckCircle className="h-4 w-4" />
                              Verify Case
                            </button>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </motion.div>
            </div>

            {/* Case Form */}
            {showCaseForm && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="lg:col-span-1"
              >
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <h3 className="text-xl font-semibold mb-6">Create New Case</h3>
                  <form onSubmit={handleCaseSubmit}>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Case Number</label>
                        <input
                          type="text"
                          value={newCase.case_number}
                          onChange={(e) => setNewCase({ ...newCase, case_number: e.target.value })}
                          className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="e.g., CASE-2024-001"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                        <input
                          type="text"
                          value={newCase.title}
                          onChange={(e) => setNewCase({ ...newCase, title: e.target.value })}
                          className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                        <textarea
                          value={newCase.description}
                          onChange={(e) => setNewCase({ ...newCase, description: e.target.value })}
                          className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          rows={4}
                          placeholder="Describe the case details..."
                        />
                      </div>
                      <div className="flex justify-end space-x-4 pt-4">
                        <button
                          type="button"
                          onClick={() => setShowCaseForm(false)}
                          className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                          disabled={isSubmitting}
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? 'Creating...' : 'Create Case'}
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </motion.div>
            )}
          </div>
        )}

        {/* Case Verification Tab */}
        {activeTab === 'verification' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-lg p-6"
          >
            {selectedCase ? (
              <>
                <div className="mb-6">
                  <div className="flex items-center gap-3 mb-4">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">Case Verification</h2>
                      <p className="text-gray-600">Verify evidence for case: {selectedCase.case_number}</p>
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="font-semibold text-blue-900 mb-2">{selectedCase.title}</h3>
                    {selectedCase.description && (
                      <p className="text-blue-800 mb-2">{selectedCase.description}</p>
                    )}
                    <p className="text-sm text-blue-600">
                      Created: {selectedCase.created_at ? new Date(selectedCase.created_at).toLocaleDateString() : 'Unknown date'}
                    </p>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-xl font-semibold mb-4">Related Evidence ({caseEvidence.length})</h3>
                  
                  {caseEvidence.length === 0 ? (
                    <div className="text-center py-8 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <AlertCircle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
                      <p className="text-yellow-800 font-medium">No evidence found for this case</p>
                      <p className="text-yellow-600 text-sm mt-2">
                        Evidence can be linked by including the case number in the evidence name or description
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {caseEvidence.map((item) => (
                        <div key={item.id} className="border border-gray-200 p-4 rounded-lg bg-green-50">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <CheckCircle className="h-5 w-5 text-green-600" />
                                <h4 className="font-semibold text-lg text-gray-900">
                                  {item.metadata?.name || 'Unnamed Evidence'}
                                </h4>
                                <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
                                  Verified
                                </span>
                              </div>
                              <p className="text-gray-600 mb-3">
                                {item.metadata?.description || 'No description provided'}
                              </p>
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-gray-500">
                                <div className="flex items-center gap-1">
                                  <Hash className="h-4 w-4" />
                                  <span>IPFS: {item.ipfs_hash.substring(0, 20)}...</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <User className="h-4 w-4" />
                                  <span>Submitter: {item.submitter_address.substring(0, 10)}...</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Calendar className="h-4 w-4" />
                                  <span>
                                    {item.created_at ? new Date(item.created_at).toLocaleDateString() : 'Unknown date'}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <button
                              onClick={() => handleViewEvidence(item)}
                              className="ml-4 bg-blue-100 text-blue-700 px-3 py-2 rounded-md hover:bg-blue-200 transition-colors flex items-center gap-2"
                            >
                              <Eye className="h-4 w-4" />
                              View Details
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Verification Summary</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{caseEvidence.length}</div>
                      <div className="text-sm text-gray-600">Evidence Items</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{caseEvidence.length}</div>
                      <div className="text-sm text-gray-600">Verified</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">
                        {caseEvidence.filter(ev => ev.metadata?.signature).length}
                      </div>
                      <div className="text-sm text-gray-600">Digitally Signed</div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <Search className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Case Selected</h3>
                <p className="text-gray-600 mb-4">
                  Select a case from the "Case Records" tab to verify its evidence
                </p>
                <button
                  onClick={() => setActiveTab('cases')}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Go to Cases
                </button>
              </div>
            )}
          </motion.div>
        )}

        {/* Evidence Viewer Modal */}
        {selectedEvidence && (
          <EvidenceViewer
            evidence={selectedEvidence}
            isOpen={showEvidenceViewer}
            onClose={() => {
              setShowEvidenceViewer(false);
              setSelectedEvidence(null);
            }}
          />
        )}
      </div>
    </div>
  );
}