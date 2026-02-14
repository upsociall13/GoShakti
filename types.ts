
export enum UserRole {
  PUBLIC = 'PUBLIC',
  FARMER = 'FARMER',
  GOVT_OFFICER = 'GOVT_OFFICER',
  BUYER = 'BUYER',
  AUDITOR = 'AUDITOR'
}

export interface FarmerProfile {
  kyfId: string;
  name: string;
  location: string;
  state: string;
  photoUrl: string;
  verificationStatus: 'VERIFIED' | 'PENDING' | 'REJECTED';
  primaryCrops: string[];
  landSize: string;
  joinedDate: string;
  lastUpdated: string;
}

export interface ProductTrace {
  productId: string;
  productName: string;
  farmerId: string;
  harvestDate: string;
  batchNumber: string;
  qualityCert: string;
  originLocation: string;
  currentStatus: string;
  imageUrl: string;
}

export interface AuditLog {
  id: string;
  action: string;
  performedBy: string;
  timestamp: string;
  notes: string;
}
