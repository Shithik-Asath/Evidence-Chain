export interface Evidence {
  id: string;
  name: string;
  description: string;
  type: 'document' | 'audio' | 'video';
  ipfsHash: string;
  timestamp: string;
  transactionHash: string;
}

export interface Feature {
  title: string;
  description: string;
  icon: React.ComponentType;
}