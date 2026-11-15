import { useState } from 'react';
import { Calendar, MessageCircle, Navigation, Phone, Star, XCircle } from 'lucide-react';
import { ServiceImage } from './ServiceImage';
import type { ServiceBooking, ServiceProvider } from '../types/community';

interface BookingsViewProps {
  bookings: ServiceBooking[];
  providers: ServiceProvider[];
  onTrackBooking: (booking: ServiceBooking) => void;
  onRateBooking: (booking: ServiceBooking) => void;
  onMessageProvider: (provider: ServiceProvider) => void;
  onCancelBooking: (bookingId: string) => Promise<void>;
  onExploreServices: () => void;
}

export function BookingsView({
  bookings,
  providers,
  onTrackBooking,
  onRateBooking,
  onMessageProvider,
  onCancelBooking,
  onExploreServices,
}: BookingsViewProps) {
  const [tab, setTab] = useState<'upcoming' | 'past'>('upcoming');

  const upcoming = bookings.filter(
    (b) => b.status !== 'Completed' && b.status !== 'Cancelled'
  );
  const past = bookings.filter(
    (b) => b.status === 'Completed' || b.status === 'Cancelled'
  );
  const visible = tab === 'upcoming' ? upcoming : past;

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="font-display text-2xl font-bold text-slate-900">My Bookings</h1>

        <div className="grid grid-cols-2 rounded-xl bg-slate-100 p-1 sm:w-64">
          <button
            type="button"
            onClick={() => setTab('upcoming')}
            className={`min-h-[40px] rounded-lg px-4 py-1.5 text-xs font-semibold transition-colors whitespace-nowrap ${
              tab === 'upcoming'
                ? 'bg-[#1677FF] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Upcoming ({upcoming.length})
          </button>
          <button
            type="button"
            onClick={() => setTab('past')}
            className={`min-h-[40px] rounded-lg px-4 py-1.5 text-xs font-semibold transition-colors whitespace-nowrap ${
              tab === 'past'
                ? 'bg-[#1677FF] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Past ({past.length})
          </button>
        </div>
      </div>

      {visible.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center space-y-3">
          <Calendar className="mx-auto h-7 w-7 text-slate-400" aria-hidden="true" />
          <p className="text-sm font-semibold text-slate-900">
            No {tab} bookings right now
          </p>
          <button
            type="button"
            onClick={onExploreServices}
            className="min-h-[40px] rounded-xl bg-[#1677FF] px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700"
          >
            Browse Home Services
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {visible.map((booking) => {
            const provider =
              providers.find((p) => p.id === booking.providerId) ?? providers[0];

            const statusBadgeClass =
              booking.status === 'Confirmed' || booking.status === 'On the way' || booking.status === 'Arrived'
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : booking.status === 'Pending'
                ? 'bg-amber-50 text-amber-700 border-amber-200'
                : booking.status === 'Completed'
                ? 'bg-slate-100 text-slate-700 border-slate-200'
                : 'bg-red-50 text-red-700 border-red-200';

            return (
              <div
                key={booking.id}
                className="rounded-2xl border border-slate-200 bg-white p-4 space-y-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3.5 min-w-0">
                    <ServiceImage
                      imageKey={booking.imageKey}
                      alt={booking.serviceName}
                      className="h-16 w-16 rounded-xl object-cover shrink-0"
                    />
                    <div className="min-w-0 space-y-1">
                      <h2 className="text-sm font-semibold text-slate-900 truncate">
                        {booking.serviceName}
                      </h2>
                      <p className="font-mono text-xs text-slate-600 tabular-nums">
                        {booking.dateLabel} · {booking.timeSlot}
                      </p>
                      <p className="text-xs text-slate-500 truncate">
                        {booking.providerName} · ${booking.totalAmount}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`rounded-lg border px-2.5 py-1 text-[11px] font-semibold whitespace-nowrap shrink-0 ${statusBadgeClass}`}
                  >
                    {booking.status}
                  </span>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-3">
                  <div className="flex items-center gap-2">
                    <a
                      href={`tel:${provider.phone.replace(/\s+/g, '')}`}
                      aria-label={`Call ${provider.name}`}
                      className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50"
                    >
                      <Phone className="h-3.5 w-3.5" aria-hidden="true" />
                    </a>
                    <button
                      type="button"
                      onClick={() => onMessageProvider(provider)}
                      aria-label={`Message ${provider.name}`}
                      className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50"
                    >
                      <MessageCircle className="h-3.5 w-3.5" aria-hidden="true" />
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    {tab === 'upcoming' ? (
                      <>
                        <button
                          type="button"
                          onClick={() => void onCancelBooking(booking.id)}
                          className="inline-flex min-h-[36px] items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:border-red-200 hover:text-red-600 whitespace-nowrap"
                        >
                          <XCircle className="h-3.5 w-3.5" aria-hidden="true" />
                          <span>Cancel</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => onTrackBooking(booking)}
                          className="inline-flex min-h-[36px] items-center gap-1.5 rounded-lg bg-[#1677FF] px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 whitespace-nowrap"
                        >
                          <Navigation className="h-3.5 w-3.5" aria-hidden="true" />
                          <span>Track Live</span>
                        </button>
                      </>
                    ) : !booking.reviewed && booking.status === 'Completed' ? (
                      <button
                        type="button"
                        onClick={() => onRateBooking(booking)}
                        className="inline-flex min-h-[36px] items-center gap-1.5 rounded-lg bg-[#1677FF] px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 whitespace-nowrap"
                      >
                        <Star className="h-3.5 w-3.5" aria-hidden="true" />
                        <span>Rate Service</span>
                      </button>
                    ) : (
                      <span className="text-xs text-slate-400">
                        {booking.reviewed ? 'Reviewed' : 'Closed'}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
