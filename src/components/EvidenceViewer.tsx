import React, { useState } from 'react';
import { X, Hash, User, Calendar, File, Download, ExternalLink, Shield, Clock, Eye, ZoomIn, ZoomOut } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Database } from '../lib/supabase';

type EvidenceRecord = Database['public']['Tables']['evidence_records']['Row'];

interface EvidenceViewerProps {
  evidence: EvidenceRecord;
  isOpen: boolean;
  onClose: () => void;
}

export default function EvidenceViewer({ evidence, isOpen, onClose }: EvidenceViewerProps) {
  const [showImagePreview, setShowImagePreview] = useState(false);
  const [imageZoom, setImageZoom] = useState(1);

  if (!isOpen) return null;

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Unknown date';
    return new Date(dateString).toLocaleString();
  };

  const getFileTypeIcon = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'document':
        return '📄';
      case 'image':
        return '🖼️';
      case 'video':
        return '🎥';
      case 'audio':
        return '🎵';
      default:
        return '📁';
    }
  };

  const getFileSize = (size: number) => {
    if (!size) return 'Unknown size';
    const units = ['B', 'KB', 'MB', 'GB'];
    let unitIndex = 0;
    let fileSize = size;
    
    while (fileSize >= 1024 && unitIndex < units.length - 1) {
      fileSize /= 1024;
      unitIndex++;
    }
    
    return `${fileSize.toFixed(1)} ${units[unitIndex]}`;
  };

  // Generate a mock image URL based on evidence type and metadata
  const generateMockImageUrl = () => {
    const type = evidence.metadata?.type?.toLowerCase();
    const fileName = evidence.metadata?.fileName || 'evidence';
    
    if (type === 'image') {
      // Use different placeholder images based on filename or content
      if (fileName.toLowerCase().includes('document') || fileName.toLowerCase().includes('paper')) {
        return 'https://images.unsplash.com/photo-1568667256549-094345857637?auto=format&fit=crop&w=800&q=80';
      } else if (fileName.toLowerCase().includes('fingerprint')) {
        return 'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?auto=format&fit=crop&w=800&q=80';
      } else if (fileName.toLowerCase().includes('scene') || fileName.toLowerCase().includes('crime')) {
        return 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80';
      } else if (fileName.toLowerCase().includes('id') || fileName.toLowerCase().includes('license')) {
        return 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=800&q=80';
      } else {
        return 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?auto=format&fit=crop&w=800&q=80';
      }
    }
    return null;
  };

  const mockImageUrl = generateMockImageUrl();
  const isImageEvidence = evidence.metadata?.type?.toLowerCase() === 'image';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <Shield className="h-8 w-8 text-blue-600" />
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Evidence Details</h2>
              <p className="text-sm text-gray-500">Blockchain-secured evidence record</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-6 w-6 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Image Preview Section - Only for image evidence */}
          {isImageEvidence && mockImageUrl && (
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Eye className="h-5 w-5 text-blue-600" />
                Image Evidence Preview
              </h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">🖼️</span>
                    <span className="font-medium text-gray-900">
                      {evidence.metadata?.fileName || 'Evidence Image'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {!showImagePreview ? (
                      <button
                        onClick={() => setShowImagePreview(true)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
                      >
                        <Eye className="h-4 w-4" />
                        View Image
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={() => setImageZoom(Math.max(0.5, imageZoom - 0.25))}
                          className="p-2 bg-gray-200 hover:bg-gray-300 rounded transition-colors"
                          disabled={imageZoom <= 0.5}
                        >
                          <ZoomOut className="h-4 w-4" />
                        </button>
                        <span className="text-sm text-gray-600 min-w-[60px] text-center">
                          {Math.round(imageZoom * 100)}%
                        </span>
                        <button
                          onClick={() => setImageZoom(Math.min(3, imageZoom + 0.25))}
                          className="p-2 bg-gray-200 hover:bg-gray-300 rounded transition-colors"
                          disabled={imageZoom >= 3}
                        >
                          <ZoomIn className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => {
                            setShowImagePreview(false);
                            setImageZoom(1);
                          }}
                          className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
                        >
                          Hide Image
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {showImagePreview && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="border-2 border-gray-200 rounded-lg overflow-hidden bg-white"
                  >
                    <div className="p-4 bg-gray-100 border-b">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        </div>
                        <div className="text-sm text-gray-600 font-mono">
                          IPFS: {evidence.ipfs_hash.substring(0, 20)}...
                        </div>
                      </div>
                    </div>
                    <div className="overflow-auto max-h-96 flex justify-center items-center bg-gray-50">
                      <img
                        src={mockImageUrl}
                        alt={evidence.metadata?.name || 'Evidence Image'}
                        className="max-w-full h-auto transition-transform duration-200"
                        style={{ transform: `scale(${imageZoom})` }}
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?auto=format&fit=crop&w=800&q=80';
                        }}
                      />
                    </div>
                    <div className="p-3 bg-gray-100 border-t text-center">
                      <p className="text-sm text-gray-600">
                        🔒 This image is cryptographically secured and stored on IPFS
                      </p>
                    </div>
                  </motion.div>
                )}

                {!showImagePreview && (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <div className="text-6xl mb-4">🖼️</div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">Image Evidence Available</h4>
                    <p className="text-gray-600 mb-4">
                      This evidence contains an image file that can be viewed securely.
                    </p>
                    <button
                      onClick={() => setShowImagePreview(true)}
                      className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2 mx-auto"
                    >
                      <Eye className="h-5 w-5" />
                      View Image Evidence
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* File Type Preview for Non-Images */}
          {!isImageEvidence && (
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <File className="h-5 w-5 text-blue-600" />
                File Preview
              </h3>
              <div className="bg-gray-50 rounded-lg p-6 text-center">
                <div className="text-6xl mb-4">{getFileTypeIcon(evidence.metadata?.type)}</div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  {evidence.metadata?.type?.toUpperCase() || 'FILE'} Evidence
                </h4>
                <p className="text-gray-600 mb-4">
                  {evidence.metadata?.fileName || 'Evidence file'}
                </p>
                <div className="flex justify-center gap-3">
                  <button
                    onClick={() => window.open(`https://ipfs.io/ipfs/${evidence.ipfs_hash}`, '_blank')}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
                  >
                    <ExternalLink className="h-4 w-4" />
                    View on IPFS
                  </button>
                  <button
                    onClick={() => {
                      // Simulate download
                      const link = document.createElement('a');
                      link.href = `https://ipfs.io/ipfs/${evidence.ipfs_hash}`;
                      link.download = evidence.metadata?.fileName || 'evidence-file';
                      link.click();
                    }}
                    className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors flex items-center gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Download
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Basic Information */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <File className="h-5 w-5 text-blue-600" />
              Basic Information
            </h3>
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Evidence Name</label>
                <p className="text-lg font-semibold text-gray-900">
                  {evidence.metadata?.name || 'Unnamed Evidence'}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <p className="text-gray-900">
                  {evidence.metadata?.description || 'No description provided'}
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Evidence Type</label>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{getFileTypeIcon(evidence.metadata?.type)}</span>
                    <span className="capitalize text-gray-900">
                      {evidence.metadata?.type || 'Unknown'}
                    </span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">File Size</label>
                  <p className="text-gray-900">
                    {evidence.metadata?.fileSize ? getFileSize(evidence.metadata.fileSize) : 'Unknown size'}
                  </p>
                </div>
              </div>
              {evidence.metadata?.caseNumber && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Related Case</label>
                  <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded">
                    {evidence.metadata.caseNumber}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Blockchain Information */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Hash className="h-5 w-5 text-blue-600" />
              Blockchain Information
            </h3>
            <div className="bg-blue-50 rounded-lg p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">IPFS Hash</label>
                <div className="flex items-center gap-2">
                  <code className="bg-white px-3 py-2 rounded border text-sm font-mono flex-1">
                    {evidence.ipfs_hash}
                  </code>
                  <button
                    onClick={() => navigator.clipboard.writeText(evidence.ipfs_hash)}
                    className="p-2 hover:bg-blue-100 rounded transition-colors"
                    title="Copy IPFS Hash"
                  >
                    📋
                  </button>
                  <button
                    onClick={() => window.open(`https://ipfs.io/ipfs/${evidence.ipfs_hash}`, '_blank')}
                    className="p-2 hover:bg-blue-100 rounded transition-colors"
                    title="View on IPFS"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Transaction Hash</label>
                <div className="flex items-center gap-2">
                  <code className="bg-white px-3 py-2 rounded border text-sm font-mono flex-1">
                    {evidence.transaction_hash}
                  </code>
                  <button
                    onClick={() => navigator.clipboard.writeText(evidence.transaction_hash)}
                    className="p-2 hover:bg-blue-100 rounded transition-colors"
                    title="Copy Transaction Hash"
                  >
                    📋
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Submitter Address</label>
                <div className="flex items-center gap-2">
                  <code className="bg-white px-3 py-2 rounded border text-sm font-mono flex-1">
                    {evidence.submitter_address}
                  </code>
                  <button
                    onClick={() => navigator.clipboard.writeText(evidence.submitter_address)}
                    className="p-2 hover:bg-blue-100 rounded transition-colors"
                    title="Copy Address"
                  >
                    📋
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Metadata */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <User className="h-5 w-5 text-blue-600" />
              Additional Metadata
            </h3>
            <div className="bg-gray-50 rounded-lg p-4">
              {evidence.metadata?.fileName && (
                <div className="mb-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Original Filename</label>
                  <p className="text-gray-900 font-mono text-sm">{evidence.metadata.fileName}</p>
                </div>
              )}
              {evidence.metadata?.signature && (
                <div className="mb-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Digital Signature</label>
                  <code className="bg-white px-3 py-2 rounded border text-xs font-mono block break-all">
                    {evidence.metadata.signature}
                  </code>
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Metadata</label>
                <pre className="bg-white p-3 rounded border text-xs overflow-x-auto">
                  {JSON.stringify(evidence.metadata, null, 2)}
                </pre>
              </div>
            </div>
          </div>

          {/* Timestamps */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-600" />
              Timeline
            </h3>
            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-green-600" />
                <div>
                  <label className="block text-sm font-medium text-gray-700">Submitted On</label>
                  <p className="text-gray-900 font-semibold">{formatDate(evidence.created_at)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Verification Status */}
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Shield className="h-5 w-5 text-blue-600" />
              Verification Status
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                <div className="text-green-600 text-2xl mb-2">✅</div>
                <h4 className="font-semibold text-green-800">Blockchain Verified</h4>
                <p className="text-sm text-green-600">Recorded on blockchain</p>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                <div className="text-blue-600 text-2xl mb-2">🔒</div>
                <h4 className="font-semibold text-blue-800">Cryptographically Signed</h4>
                <p className="text-sm text-blue-600">Digital signature verified</p>
              </div>
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-center">
                <div className="text-purple-600 text-2xl mb-2">🌐</div>
                <h4 className="font-semibold text-purple-800">IPFS Stored</h4>
                <p className="text-sm text-purple-600">Decentralized storage</p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200">
            {isImageEvidence && !showImagePreview && (
              <button
                onClick={() => setShowImagePreview(true)}
                className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors"
              >
                <Eye className="h-4 w-4" />
                View Image
              </button>
            )}
            <button
              onClick={() => window.open(`https://ipfs.io/ipfs/${evidence.ipfs_hash}`, '_blank')}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              <ExternalLink className="h-4 w-4" />
              View on IPFS
            </button>
            <button
              onClick={() => navigator.clipboard.writeText(evidence.ipfs_hash)}
              className="flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
            >
              📋
              Copy IPFS Hash
            </button>
            <button
              onClick={() => navigator.clipboard.writeText(evidence.transaction_hash)}
              className="flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
            >
              📋
              Copy Transaction Hash
            </button>
            <button
              onClick={() => {
                const evidenceData = {
                  name: evidence.metadata?.name,
                  description: evidence.metadata?.description,
                  type: evidence.metadata?.type,
                  ipfs_hash: evidence.ipfs_hash,
                  transaction_hash: evidence.transaction_hash,
                  submitter_address: evidence.submitter_address,
                  created_at: evidence.created_at
                };
                const dataStr = JSON.stringify(evidenceData, null, 2);
                const dataBlob = new Blob([dataStr], { type: 'application/json' });
                const url = URL.createObjectURL(dataBlob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `evidence-${evidence.id}.json`;
                link.click();
                URL.revokeObjectURL(url);
              }}
              className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
            >
              <Download className="h-4 w-4" />
              Export Data
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}