export type ServiceCategoryId =
  | 'Plumber'
  | 'Electrician'
  | 'Cleaner'
  | 'Painter'
  | 'Mason'
  | 'Welder'
  | 'Roofer'
  | 'More';

export type ServiceSubType = 'Repair' | 'Installation' | 'Maintenance';

export interface HomeServiceItem {
  id: string;
  name: string;
  category: ServiceCategoryId;
  subType: ServiceSubType;
  price: number;
  durationLabel: string;
  rating: number;
  reviewCount: number;
  description: string;
  providerId: string;
  imageKey: 'plumbing' | 'electrical' | 'clubhouse' | 'terrace' | 'guest_suite';
}

export interface ProviderReview {
  id: string;
  authorName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface ServiceProvider {
  id: string;
  name: string;
  specialty: ServiceCategoryId;
  topRated: boolean;
  rating: number;
  reviewCount: number;
  experienceYears: number;
  hourlyRate: number;
  about: string;
  skills: string[];
  phone: string;
  vehicleNumber: string;
  etaMinutes: number;
  distanceKm: number;
  avatarKey: 'rohit' | 'handyman';
  reviews: ProviderReview[];
}

export type BookingStatus = 'Confirmed' | 'Pending' | 'On the way' | 'Arrived' | 'Completed' | 'Cancelled';

export interface ServiceBooking {
  id: string;
  serviceId: string;
  serviceName: string;
  category: ServiceCategoryId;
  providerId: string;
  providerName: string;
  dateLabel: string;
  dateIso: string;
  timeSlot: string;
  address: string;
  paymentMethod: string;
  promoApplied: boolean;
  totalAmount: number;
  status: BookingStatus;
  trackingStep: 1 | 2 | 3 | 4; // 1: Accepted, 2: On the way, 3: Arrived, 4: Completed
  reviewed: boolean;
  imageKey: HomeServiceItem['imageKey'];
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  providerId: string;
  sender: 'user' | 'provider';
  text: string;
  timeLabel: string;
  read: boolean;
  createdAt: string;
}

export interface UserProfile {
  name: string;
  greetingName: string;
  phone: string;
  address: string;
  neighborhood: string;
  favoriteProviderIds: string[];
}

export interface GharsathiData {
  user: UserProfile;
  services: HomeServiceItem[];
  providers: ServiceProvider[];
  bookings: ServiceBooking[];
  messages: ChatMessage[];
}
