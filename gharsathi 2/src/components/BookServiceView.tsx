import { useState } from 'react';
import { ArrowLeft, Check } from 'lucide-react';
import { ServiceImage } from './ServiceImage';
import type { HomeServiceItem, ServiceProvider, UserProfile } from '../types/community';

interface BookServiceViewProps {
  service: HomeServiceItem;
  provider: ServiceProvider;
  user: UserProfile;
  onBack: () => void;
  onConfirmBooking: (payload: {
    serviceId: string;
    providerId: string;
    dateLabel: string;
    dateIso: string;
    timeSlot: string;
    address: string;
    paymentMethod: string;
    promoApplied: boolean;
  }) => Promise<void>;
}

const DATE_OPTIONS = [
  { day: 'Mon', num: '18', label: 'Mon, 18 Aug', iso: '2026-08-18' },
  { day: 'Tue', num: '19', label: 'Tue, 19 Aug', iso: '2026-08-19' },
  { day: 'Wed', num: '20', label: 'Wed, 20 Aug', iso: '2026-08-20' },
  { day: 'Thu', num: '21', label: 'Thu, 21 Aug', iso: '2026-08-21' },
  { day: 'Fri', num: '22', label: 'Fri, 22 Aug', iso: '2026-08-22' },
];

const TIME_SLOTS = ['09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '02:00 PM', '04:00 PM'];
const PAYMENT_METHODS = ['UPI (GPay / PhonePe)', 'Credit / Debit Card', 'Cash after service'];

export function BookServiceView({
  service,
  provider,
  user,
  onBack,
  onConfirmBooking,
}: BookServiceViewProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedDate, setSelectedDate] = useState(DATE_OPTIONS[1]);
  const [selectedSlot, setSelectedSlot] = useState('10:00 AM');
  const [address, setAddress] = useState(user.address);
  const [paymentMethod, setPaymentMethod] = useState(PAYMENT_METHODS[0]);
  const [promoApplied, setPromoApplied] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const finalAmount = promoApplied ? Math.round(service.price * 0.8) : service.price;

  async function handleConfirm() {
    setSubmitting(true);
    try {
      await onConfirmBooking({
        serviceId: service.id,
        providerId: provider.id,
        dateLabel: selectedDate.label,
        dateIso: selectedDate.iso,
        timeSlot: selectedSlot,
        address: address.trim() || user.address,
        paymentMethod,
        promoApplied,
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => (step > 1 ? setStep((s) => (s - 1) as 1 | 2) : onBack())}
          aria-label="Go back"
          className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        </button>
        <h1 className="font-display text-xl font-bold text-slate-900">Book Service</h1>
      </div>

      {/* 3-Step Horizontal Stepper */}
      <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3 text-xs">
        {[
          { num: 1, label: 'Date & Time' },
          { num: 2, label: 'Address' },
          { num: 3, label: 'Payment' },
        ].map((item, idx) => {
          const active = step === item.num;
          const done = step > item.num;
          return (
            <div key={item.num} className="flex items-center gap-2">
              <span
                className={`flex h-6 w-6 items-center justify-center rounded-full font-mono text-xs font-semibold tabular-nums ${
                  active || done
                    ? 'bg-[#1677FF] text-white'
                    : 'bg-slate-100 text-slate-500'
                }`}
              >
                {done ? <Check className="h-3.5 w-3.5" aria-hidden="true" /> : item.num}
              </span>
              <span
                className={`font-medium whitespace-nowrap ${
                  active ? 'text-slate-900' : 'text-slate-500'
                }`}
              >
                {item.label}
              </span>
              {idx < 2 && <span className="hidden sm:inline text-slate-300 ml-2">—</span>}
            </div>
          );
        })}
      </div>

      {/* Selected Service Strip */}
      <div className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-4">
        <div className="flex items-center gap-3.5">
          <ServiceImage
            imageKey={service.imageKey}
            alt={service.name}
            className="h-14 w-14 rounded-xl object-cover shrink-0"
          />
          <div>
            <p className="text-sm font-semibold text-slate-900">{service.name}</p>
            <p className="text-xs text-slate-500">
              {provider.name} · {service.durationLabel}
            </p>
          </div>
        </div>
        <p className="font-mono text-base font-bold text-slate-900 tabular-nums">₹{service.price}</p>
      </div>

      {/* Step Content */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-6">
        {step === 1 && (
          <>
            <div className="space-y-3">
              <h2 className="text-sm font-semibold text-slate-900">Select Date</h2>
              <div className="grid grid-cols-5 gap-2.5">
                {DATE_OPTIONS.map((d) => {
                  const active = selectedDate.iso === d.iso;
                  return (
                    <button
                      key={d.iso}
                      type="button"
                      onClick={() => setSelectedDate(d)}
                      className={`flex min-h-[72px] flex-col items-center justify-center rounded-xl border text-center transition-colors ${
                        active
                          ? 'border-[#1677FF] bg-[#1677FF] text-white'
                          : 'border-slate-200 bg-white text-slate-800 hover:bg-slate-50'
                      }`}
                    >
                      <span
                        className={`text-xs ${active ? 'text-blue-100' : 'text-slate-500'}`}
                      >
                        {d.day}
                      </span>
                      <span className="mt-1 font-mono text-base font-bold tabular-nums">
                        {d.num}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-3">
              <h2 className="text-sm font-semibold text-slate-900">Available Slots</h2>
              <div className="grid grid-cols-3 gap-2.5">
                {TIME_SLOTS.map((slot) => {
                  const active = selectedSlot === slot;
                  return (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setSelectedSlot(slot)}
                      className={`min-h-[44px] rounded-xl border px-3 py-2 font-mono text-xs font-medium tabular-nums transition-colors ${
                        active
                          ? 'border-[#1677FF] bg-[#1677FF] text-white'
                          : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {slot}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-slate-100 pt-4">
              <span className="text-sm font-medium text-slate-600">Total Amount</span>
              <span className="font-mono text-lg font-bold text-slate-900 tabular-nums">
                ₹{service.price}
              </span>
            </div>

            <button
              type="button"
              onClick={() => setStep(2)}
              className="w-full min-h-[48px] rounded-xl bg-[#1677FF] text-sm font-semibold text-white transition-colors hover:bg-blue-700"
            >
              Continue
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <div className="space-y-2">
              <label htmlFor="bk-address" className="block text-sm font-semibold text-slate-900">
                Service Address
              </label>
              <textarea
                id="bk-address"
                rows={3}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full rounded-xl border border-slate-200 p-3 text-sm text-slate-900 focus:border-blue-600 focus:outline-none"
              />
              <p className="text-xs text-slate-500">
                Scheduled for {selectedDate.label} at {selectedSlot}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setStep(3)}
              className="w-full min-h-[48px] rounded-xl bg-[#1677FF] text-sm font-semibold text-white transition-colors hover:bg-blue-700"
            >
              Continue to Payment
            </button>
          </>
        )}

        {step === 3 && (
          <>
            <div className="space-y-3">
              <h2 className="text-sm font-semibold text-slate-900">Payment Method</h2>
              <div className="space-y-2">
                {PAYMENT_METHODS.map((pm) => (
                  <label
                    key={pm}
                    className={`flex min-h-[48px] cursor-pointer items-center justify-between rounded-xl border px-4 py-3 text-sm ${
                      paymentMethod === pm
                        ? 'border-blue-600 bg-blue-50/50 font-medium text-slate-900'
                        : 'border-slate-200 bg-white text-slate-700'
                    }`}
                  >
                    <span>{pm}</span>
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === pm}
                      onChange={() => setPaymentMethod(pm)}
                      className="h-4 w-4 text-blue-600"
                    />
                  </label>
                ))}
              </div>
            </div>

            <label className="flex cursor-pointer items-center justify-between rounded-xl border border-blue-200 bg-blue-50/60 px-4 py-3 text-xs font-medium text-blue-900">
              <span>Apply 20% First-Booking Offer (FIRST20)</span>
              <input
                type="checkbox"
                checked={promoApplied}
                onChange={(e) => setPromoApplied(e.target.checked)}
                className="h-4 w-4 rounded text-blue-600"
              />
            </label>

            <div className="space-y-2 border-t border-slate-100 pt-4 text-sm">
              <div className="flex justify-between text-slate-600">
                <span>Service Fee</span>
                <span className="font-mono tabular-nums">₹{service.price}</span>
              </div>
              {promoApplied && (
                <div className="flex justify-between text-emerald-700">
                  <span>First Booking Discount (20%)</span>
                  <span className="font-mono tabular-nums">-₹{service.price - finalAmount}</span>
                </div>
              )}
              <div className="flex justify-between font-semibold text-slate-900 pt-1">
                <span>Payable Total</span>
                <span className="font-mono text-lg tabular-nums">₹{finalAmount}</span>
              </div>
            </div>

            <button
              type="button"
              disabled={submitting}
              onClick={() => void handleConfirm()}
              className="w-full min-h-[48px] rounded-xl bg-[#1677FF] text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
            >
              {submitting ? 'Confirming...' : 'Confirm Booking'}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
