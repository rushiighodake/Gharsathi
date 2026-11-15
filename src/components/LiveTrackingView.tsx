import { useState } from 'react';
import { ArrowLeft, Check, MapPin, Navigation, Phone, Truck, UserCheck } from 'lucide-react';
import { ServiceImage } from './ServiceImage';
import type { ServiceBooking, ServiceProvider } from '../types/community';

interface LiveTrackingViewProps {
  booking: ServiceBooking;
  provider: ServiceProvider;
  onBack: () => void;
  onAdvanceStep: (bookingId: string, step: 1 | 2 | 3 | 4) => Promise<void>;
  onOpenChat: (provider: ServiceProvider) => void;
}

const STEPS: { step: 1 | 2 | 3 | 4; label: string }[] = [
  { step: 1, label: 'Accepted' },
  { step: 2, label: 'On the way' },
  { step: 3, label: 'Arrived' },
  { step: 4, label: 'Completed' },
];

export function LiveTrackingView({
  booking,
  provider,
  onBack,
  onAdvanceStep,
  onOpenChat,
}: LiveTrackingViewProps) {
  const [updating, setUpdating] = useState(false);

  const etaText =
    booking.trackingStep === 1
      ? 'Preparing tools · ~18 min'
      : booking.trackingStep === 2
      ? `Arriving in ${provider.etaMinutes} min`
      : booking.trackingStep === 3
      ? 'Technician at your doorstep'
      : 'Service finished';

  async function handleNextStep() {
    const next = Math.min(4, booking.trackingStep + 1) as 1 | 2 | 3 | 4;
    setUpdating(true);
    try {
      await onAdvanceStep(booking.id, next);
    } finally {
      setUpdating(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            aria-label="Back to bookings"
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          </button>
          <div>
            <h1 className="font-display text-xl font-bold text-slate-900">Live Tracking</h1>
            <p className="text-xs text-slate-500">
              {booking.serviceName} · {booking.dateLabel} · {booking.timeSlot}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => onOpenChat(provider)}
          className="min-h-[40px] rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-blue-600 hover:bg-blue-50 whitespace-nowrap shrink-0"
        >
          Message {provider.name.split(' ')[0]}
        </button>
      </div>

      {/* Neighborhood Route Map Card */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-[#EAF1FA] h-64 sm:h-72">
        {/* Clean Map Grid & Roads SVG */}
        <svg
          viewBox="0 0 600 280"
          className="h-full w-full"
          aria-label="Live neighborhood route map from Pimple Gurav to Pune residence"
        >
          <rect width="600" height="280" fill="#E9EFF7" />
          {/* Parks & river */}
          <path d="M 0 110 Q 140 90 240 140 T 480 120 L 600 100 L 600 135 L 0 145 Z" fill="#CFE2F7" opacity="0.65" />
          <rect x="60" y="30" width="90" height="55" rx="12" fill="#DCEBD9" />
          <rect x="420" y="175" width="110" height="65" rx="12" fill="#DCEBD9" />
          {/* Secondary streets */}
          <path d="M 40 0 L 40 280 M 180 0 L 180 280 M 330 0 L 330 280 M 490 0 L 490 280" stroke="#FFFFFF" strokeWidth="6" />
          <path d="M 0 65 L 600 65 M 0 185 L 600 185 M 0 240 L 600 240" stroke="#FFFFFF" strokeWidth="6" />
          {/* Active route polyline */}
          <path
            d="M 155 155 L 220 95 L 365 135 L 430 190"
            fill="none"
            stroke="#1677FF"
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Technician point */}
          <circle
            cx={booking.trackingStep === 1 ? 155 : booking.trackingStep === 2 ? 290 : 430}
            cy={booking.trackingStep === 1 ? 155 : booking.trackingStep === 2 ? 115 : 190}
            r="10"
            fill="#1677FF"
            stroke="#FFFFFF"
            strokeWidth="3"
          />
          {/* Destination Home Pin */}
          <circle cx="430" cy="190" r="9" fill="#0F172A" stroke="#FFFFFF" strokeWidth="3" />
          {/* Locality Labels */}
          <text x="235" y="165" fill="#475569" fontSize="13" fontWeight="600">
            Pimple Gurav
          </text>
          <text x="485" y="218" fill="#475569" fontSize="13" fontWeight="600">
            Pune
          </text>
        </svg>

        {/* Top Floating ETA Bubble */}
        <div className="absolute left-1/2 top-4 -translate-x-1/2 rounded-xl bg-white/95 px-4 py-2.5 shadow-md border border-slate-200 flex items-center gap-2.5">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-50 text-blue-600">
            <Navigation className="h-3.5 w-3.5" aria-hidden="true" />
          </span>
          <div>
            <p className="text-xs font-semibold text-slate-900 whitespace-nowrap">
              {provider.name.split(' ')[0]} is {booking.trackingStep === 3 ? 'here' : 'on the way'}
            </p>
            <p className="text-[11px] font-medium text-blue-600 tabular-nums">{etaText}</p>
          </div>
        </div>
      </div>

      {/* Technician & Stepper Card */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <ServiceImage
              imageKey={provider.avatarKey}
              alt={provider.name}
              className="h-14 w-14 rounded-full object-cover object-top border border-slate-200 shrink-0"
            />
            <div>
              <h2 className="font-display text-base font-bold text-slate-900">{provider.name}</h2>
              <p className="text-xs text-slate-500">{provider.specialty}</p>
            </div>
          </div>

          <a
            href={`tel:${provider.phone.replace(/\s+/g, '')}`}
            className="inline-flex min-h-[40px] items-center gap-1.5 rounded-xl border border-blue-200 bg-blue-50/70 px-4 py-2 text-xs font-semibold text-blue-700 hover:bg-blue-100 whitespace-nowrap shrink-0"
          >
            <Phone className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Call</span>
          </a>
        </div>

        <div className="flex flex-wrap items-center gap-3 rounded-xl bg-slate-50 px-4 py-3 text-xs text-slate-700 border border-slate-100">
          <Truck className="h-4 w-4 text-slate-500 shrink-0" aria-hidden="true" />
          <span className="font-mono font-semibold text-slate-900 tabular-nums">
            {provider.vehicleNumber}
          </span>
          <span aria-hidden="true">·</span>
          <span className="tabular-nums">{etaText}</span>
          <span aria-hidden="true">·</span>
          <span className="font-mono tabular-nums">{provider.distanceKm} km</span>
        </div>

        {/* 4-Stage Progress Bar */}
        <div className="grid grid-cols-4 gap-2 pt-1">
          {STEPS.map((s) => {
            const reached = booking.trackingStep >= s.step;
            return (
              <div key={s.step} className="flex flex-col items-center text-center gap-1.5">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full border text-xs font-semibold ${
                    reached
                      ? 'border-[#1677FF] bg-[#1677FF] text-white'
                      : 'border-slate-200 bg-white text-slate-400'
                  }`}
                >
                  {s.step === 1 && <Check className="h-3.5 w-3.5" aria-hidden="true" />}
                  {s.step === 2 && <Truck className="h-3.5 w-3.5" aria-hidden="true" />}
                  {s.step === 3 && <MapPin className="h-3.5 w-3.5" aria-hidden="true" />}
                  {s.step === 4 && <UserCheck className="h-3.5 w-3.5" aria-hidden="true" />}
                </div>
                <span
                  className={`text-[11px] font-medium whitespace-nowrap ${
                    reached ? 'text-slate-900' : 'text-slate-400'
                  }`}
                >
                  {s.label}
                </span>
              </div>
            );
          })}
        </div>

        {booking.trackingStep < 4 && (
          <div className="flex justify-end border-t border-slate-100 pt-4">
            <button
              type="button"
              disabled={updating}
              onClick={() => void handleNextStep()}
              className="min-h-[44px] rounded-xl bg-[#1677FF] px-5 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
            >
              {booking.trackingStep === 3
                ? 'Complete Service & Rate'
                : booking.trackingStep === 2
                ? 'Mark Arrived at Doorstep'
                : 'Start Trip to Location'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
