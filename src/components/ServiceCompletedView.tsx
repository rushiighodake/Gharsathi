import { useState } from 'react';
import { Check, Star } from 'lucide-react';
import { ServiceImage } from './ServiceImage';
import type { ServiceBooking } from '../types/community';

interface ServiceCompletedViewProps {
  booking: ServiceBooking;
  onSubmitReview: (payload: {
    bookingId: string;
    providerId: string;
    rating: number;
    comment: string;
  }) => Promise<void>;
  onSkip: () => void;
}

export function ServiceCompletedView({
  booking,
  onSubmitReview,
  onSkip,
}: ServiceCompletedViewProps) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onSubmitReview({
        bookingId: booking.id,
        providerId: booking.providerId,
        rating,
        comment: comment.trim(),
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-md rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 text-center space-y-6">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500 text-white">
        <Check className="h-7 w-7 stroke-[2.5]" aria-hidden="true" />
      </div>

      <div className="space-y-1.5">
        <h1 className="font-display text-2xl font-bold text-slate-900">Service Completed!</h1>
        <p className="text-sm text-slate-500">
          Your service has been successfully completed by {booking.providerName}.
        </p>
      </div>

      <div className="flex items-center gap-3.5 rounded-xl border border-slate-100 bg-slate-50/70 p-3.5 text-left">
        <ServiceImage
          imageKey={booking.imageKey}
          alt={booking.serviceName}
          className="h-12 w-12 rounded-xl object-cover shrink-0"
        />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-slate-900 truncate">{booking.serviceName}</p>
          <p className="font-mono text-xs text-slate-600 tabular-nums">
            ${booking.totalAmount} · {booking.timeSlot}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <p className="text-sm font-semibold text-slate-900">How was your experience?</p>
          <div className="flex items-center justify-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                aria-label={`Rate ${star} stars`}
                className="flex h-11 w-11 items-center justify-center rounded-xl transition-transform hover:scale-105"
              >
                <Star
                  className={`h-7 w-7 ${
                    star <= rating
                      ? 'fill-amber-400 text-amber-400'
                      : 'text-slate-300'
                  }`}
                  aria-hidden="true"
                />
              </button>
            ))}
          </div>
        </div>

        <textarea
          rows={3}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Write a review (optional)"
          aria-label="Write a review"
          className="w-full rounded-xl border border-slate-200 p-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:outline-none"
        />

        <button
          type="submit"
          disabled={submitting}
          className="w-full min-h-[48px] rounded-xl bg-[#1677FF] text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
        >
          {submitting ? 'Submitting...' : 'Submit'}
        </button>

        <button
          type="button"
          onClick={onSkip}
          className="text-xs font-medium text-slate-500 hover:text-slate-800"
        >
          Skip for now
        </button>
      </form>
    </div>
  );
}
