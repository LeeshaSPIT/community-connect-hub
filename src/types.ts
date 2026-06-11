export type CategoryType = 'repair' | 'daily' | 'personal' | 'nearby' | 'emergency';

export interface Review {
  id: string;
  author: string;
  rating: number;
  comment: string;
  date: string;
  flat?: string;
}

export interface Contact {
  id: string;
  name: string;
  phone: string;
  whatsapp?: string;
  category: CategoryType;
  subcategory: string; // Display subcategory e.g., 'Plumber', 'Grocery'
  rating: number;
  ratingsCount: number;
  endorsements: number; // number of neighbor recommendations
  reviews: Review[];
  address?: string;
  distance?: string; // (e.g. "0.4 km")
  isVerified: boolean;
  isUserSuggested?: boolean;
  isPendingApproval?: boolean;
  hours?: string;
  isClosed?: boolean;
  whatsappEnabled?: boolean;
  details?: string;
  image?: string; // Optional image URL or base64 string for the shop/person photo
}

export interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  icon: string; // Lucide icon name
  description: string;
  category: 'medical' | 'safety' | 'utility' | 'society';
  distance?: string;
}

export interface NeighborhoodSetting {
  societyName: string;
  pincode: string;
}
