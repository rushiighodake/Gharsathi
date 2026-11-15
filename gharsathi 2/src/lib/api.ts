import type {
  BookingStatus,
  ChatMessage,
  GharsathiData,
  ProviderReview,
  ServiceBooking,
  ServiceProvider,
  UserProfile,
} from '../types/community';

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(typeof data?.error === 'string' ? data.error : `Request failed (${res.status})`);
  }
  return data as T;
}

export const api = {
  getData: () => request<GharsathiData>('/api/gharsathi'),

  updateUser: (payload: {
    toggleFavoriteProviderId?: string;
    name?: string;
    address?: string;
    phone?: string;
  }) =>
    request<UserProfile>('/api/user', {
      method: 'PATCH',
      body: JSON.stringify(payload),
    }),

  createBooking: (payload: {
    serviceId: string;
    providerId: string;
    dateLabel: string;
    dateIso: string;
    timeSlot: string;
    address: string;
    paymentMethod: string;
    promoApplied: boolean;
  }) =>
    request<ServiceBooking>('/api/bookings', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  updateBooking: (
    id: string,
    payload: { trackingStep?: 1 | 2 | 3 | 4; status?: BookingStatus }
  ) =>
    request<ServiceBooking>(`/api/bookings/${encodeURIComponent(id)}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    }),

  submitReview: (payload: {
    bookingId?: string;
    providerId: string;
    rating: number;
    comment: string;
  }) =>
    request<{ provider: ServiceProvider; review: ProviderReview }>('/api/reviews', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  sendMessage: (payload: { providerId: string; text: string }) =>
    request<ChatMessage>('/api/messages', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  markRead: (providerId: string) =>
    request<{ ok: boolean }>('/api/messages/read', {
      method: 'PATCH',
      body: JSON.stringify({ providerId }),
    }),

  resetDemo: () =>
    request<GharsathiData>('/api/reset', {
      method: 'POST',
    }),
};
