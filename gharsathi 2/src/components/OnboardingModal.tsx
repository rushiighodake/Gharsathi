import { useState } from 'react';
import { Brush, Droplets, Home, Sparkles, Wrench, Zap } from 'lucide-react';
import { APP_IMAGES } from '../lib/assets';

interface OnboardingModalProps {
  onClose: () => void;
}

export function OnboardingModal({ onClose }: OnboardingModalProps) {
  const [slide, setSlide] = useState<1 | 2>(1);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Gharsathi Welcome"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-xs"
    >
      <div className="w-full max-w-sm overflow-hidden rounded-3xl bg-white p-6 shadow-2xl border border-slate-200">
        {slide === 1 ? (
          <div className="flex flex-col items-center text-center space-y-5">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#1677FF] text-white shadow-sm">
              <Home className="h-7 w-7" aria-hidden="true" />
            </div>

            <div className="space-y-1">
              <h2 className="font-display text-2xl font-bold text-slate-900">Gharsathi</h2>
              <p className="text-xs font-medium text-slate-500">
                Trusted Home Services
                <br />
                At Your Doorstep
              </p>
            </div>

            <img
              src={APP_IMAGES.handymanHero}
              alt="Gharsathi trusted technician"
              referrerPolicy="no-referrer"
              className="h-52 w-52 rounded-2xl object-cover"
            />

            <div className="w-full space-y-3 pt-1">
              <button
                type="button"
                onClick={() => setSlide(2)}
                className="w-full min-h-[48px] rounded-full bg-[#1677FF] text-sm font-semibold text-white transition-colors hover:bg-blue-700"
              >
                Get Started
              </button>
              <p className="text-xs text-slate-500">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={onClose}
                  className="font-semibold text-[#1677FF] hover:underline"
                >
                  Login
                </button>
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center text-center space-y-6">
            <div className="flex w-full justify-end">
              <button
                type="button"
                onClick={onClose}
                className="text-xs font-semibold text-[#1677FF] hover:underline"
              >
                Skip
              </button>
            </div>

            {/* Circular Home Services Orbit Illustration */}
            <div className="relative flex h-48 w-48 items-center justify-center rounded-full border border-blue-100 bg-blue-50/40">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#1677FF] text-white shadow-sm">
                <Home className="h-8 w-8" aria-hidden="true" />
              </div>
              <span className="absolute -top-3 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm border border-slate-100 text-blue-600">
                <Wrench className="h-4 w-4" aria-hidden="true" />
              </span>
              <span className="absolute right-0 top-10 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm border border-slate-100 text-amber-500">
                <Zap className="h-4 w-4" aria-hidden="true" />
              </span>
              <span className="absolute -bottom-3 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm border border-slate-100 text-sky-600">
                <Sparkles className="h-4 w-4" aria-hidden="true" />
              </span>
              <span className="absolute left-0 top-10 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm border border-slate-100 text-indigo-600">
                <Brush className="h-4 w-4" aria-hidden="true" />
              </span>
              <span className="absolute left-3 bottom-6 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm border border-slate-100 text-teal-600">
                <Droplets className="h-4 w-4" aria-hidden="true" />
              </span>
            </div>

            <div className="space-y-2">
              <h2 className="font-display text-xl font-bold text-slate-900">
                All Your Home Services in One Place
              </h2>
              <p className="text-xs leading-relaxed text-slate-500">
                Book trusted professionals for plumbing, cleaning, electrical, painting and more.
              </p>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-slate-300" />
              <span className="h-1.5 w-4 rounded-full bg-[#1677FF]" />
              <span className="h-1.5 w-1.5 rounded-full bg-slate-300" />
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-full min-h-[48px] rounded-full bg-[#1677FF] text-sm font-semibold text-white transition-colors hover:bg-blue-700"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
