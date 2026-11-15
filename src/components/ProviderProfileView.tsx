import { ArrowLeft, Heart, MessageCircle, Star } from 'lucide-react';
import { ServiceImage } from './ServiceImage';
import type { HomeServiceItem, ServiceProvider } from '../types/community';

interface ProviderProfileViewProps {
  provider: ServiceProvider;
  isFavorite: boolean;
  services: HomeServiceItem[];
  onBack: () => void;
  onToggleFavorite: (providerId: string) => Promise<void>;
  onMessageProvider: (provider: ServiceProvider) => void;
  onBookProvider: (service: HomeServiceItem) => void;
}

export function ProviderProfileView({
  provider,
  isFavorite,
  services,
  onBack,
  onToggleFavorite,
  onMessageProvider,
  onBookProvider,
}: ProviderProfileViewProps) {
  const defaultService =
    services.find((s) => s.providerId === provider.id) ?? services[0];

  return (
    <div className="space-y-6">
      {/* Top Hero Portrait Card */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <div className="relative bg-gradient-to-b from-slate-100 to-blue-50">
          <div className="absolute left-4 right-4 top-4 z-10 flex items-center justify-between">
            <button
              type="button"
              onClick={onBack}
              aria-label="Go back"
              className="flex h-11 w-11 items-center justify-center rounded-full bg-white/95 text-slate-800 shadow-xs hover:bg-white"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => void onToggleFavorite(provider.id)}
              aria-label={isFavorite ? 'Remove from favorites' : 'Save technician'}
              className="flex h-11 w-11 items-center justify-center rounded-full bg-white/95 text-slate-700 shadow-xs hover:bg-white"
            >
              <Heart
                className={`h-4 w-4 ${isFavorite ? 'fill-rose-500 text-rose-500' : ''}`}
                aria-hidden="true"
              />
            </button>
          </div>

          <div className="mx-auto max-w-md pt-6">
            <ServiceImage
              imageKey={provider.avatarKey}
              alt={provider.name}
              className="h-64 w-full object-cover object-top sm:h-72"
            />
          </div>
        </div>

        <div className="p-6 space-y-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h1 className="font-display text-2xl font-bold text-slate-900">{provider.name}</h1>
              <p className="text-sm text-slate-500">{provider.specialty}</p>
            </div>
            {provider.topRated && (
              <span className="inline-flex items-center gap-1 rounded-lg bg-amber-50 border border-amber-200 px-3 py-1 text-xs font-semibold text-amber-800">
                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" aria-hidden="true" />
                <span>Top Rated</span>
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 tabular-nums">
            <span className="inline-flex items-center gap-1 font-semibold text-slate-900">
              <Star className="h-4 w-4 fill-amber-400 text-amber-400" aria-hidden="true" />
              {provider.rating} ({provider.reviewCount} reviews)
            </span>
            <span aria-hidden="true">·</span>
            <span>{provider.experienceYears}+ yrs exp.</span>
          </div>

          <p className="font-mono text-xl font-bold text-slate-900 tabular-nums">
            ${provider.hourlyRate}{' '}
            <span className="font-sans text-xs font-normal text-slate-500">(per visit)</span>
          </p>

          <div className="space-y-1.5 border-t border-slate-100 pt-4">
            <h2 className="text-sm font-semibold text-slate-900">About</h2>
            <p className="text-sm leading-relaxed text-slate-600">{provider.about}</p>
          </div>

          <div className="space-y-2 border-t border-slate-100 pt-4">
            <h2 className="text-sm font-semibold text-slate-900">Skills</h2>
            <div className="flex flex-wrap gap-2">
              {provider.skills.map((skill) => (
                <span
                  key={skill}
                  className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-700"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-3 border-t border-slate-100 pt-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-slate-900 tabular-nums">
                Reviews ({provider.reviewCount})
              </h2>
            </div>

            {provider.reviews.length === 0 ? (
              <p className="text-xs text-slate-500">No written reviews yet.</p>
            ) : (
              <div className="space-y-3">
                {provider.reviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="rounded-xl border border-slate-100 bg-slate-50/70 p-3.5 space-y-1"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-900">{rev.authorName}</span>
                      <span className="inline-flex items-center gap-1 font-mono text-amber-700 tabular-nums">
                        <Star className="h-3 w-3 fill-amber-400 text-amber-400" aria-hidden="true" />
                        {rev.rating}.0
                      </span>
                    </div>
                    <p className="text-xs text-slate-600">{rev.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sticky / Bottom Action Pair */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              type="button"
              onClick={() => onMessageProvider(provider)}
              className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-800 transition-colors hover:bg-slate-50"
            >
              <MessageCircle className="h-4 w-4 text-blue-600" aria-hidden="true" />
              <span>Message</span>
            </button>
            <button
              type="button"
              onClick={() => onBookProvider(defaultService)}
              className="inline-flex min-h-[48px] items-center justify-center rounded-xl bg-[#1677FF] px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
            >
              Book Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
