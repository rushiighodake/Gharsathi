import { useState } from 'react';
import { ArrowLeft, Star } from 'lucide-react';
import { ServiceImage } from './ServiceImage';
import type {
  HomeServiceItem,
  ServiceCategoryId,
  ServiceProvider,
  ServiceSubType,
} from '../types/community';

interface CategoryViewProps {
  category: ServiceCategoryId | 'All';
  services: HomeServiceItem[];
  providers: ServiceProvider[];
  onBack: () => void;
  onSelectService: (service: HomeServiceItem) => void;
  onSelectProvider: (provider: ServiceProvider) => void;
}

const SUB_TABS: ('All' | ServiceSubType)[] = ['All', 'Repair', 'Installation', 'Maintenance'];

export function CategoryView({
  category,
  services,
  providers,
  onBack,
  onSelectService,
  onSelectProvider,
}: CategoryViewProps) {
  const [subFilter, setSubFilter] = useState<'All' | ServiceSubType>('All');

  const categoryLabel =
    category === 'Plumber'
      ? 'Plumbing'
      : category === 'All'
      ? 'All Home Services'
      : category;

  const filtered = services
    .filter((s) => (category === 'All' ? true : s.category === category))
    .filter((s) => (subFilter === 'All' ? true : s.subType === subFilter));

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onBack}
          aria-label="Back to home"
          className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 shrink-0"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        </button>
        <div>
          <h1 className="font-display text-xl font-bold text-slate-900">{categoryLabel}</h1>
          <p className="text-xs text-slate-500">
            Select a service to book or tap a technician to inspect reviews
          </p>
        </div>
      </div>

      {/* Sub-filter Segmented Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        {SUB_TABS.map((tab) => {
          const active = subFilter === tab;
          return (
            <button
              key={tab}
              type="button"
              onClick={() => setSubFilter(tab)}
              className={`min-h-[40px] rounded-full px-4 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                active
                  ? 'bg-[#1677FF] text-white'
                  : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
              }`}
            >
              {tab}
            </button>
          );
        })}
      </div>

      {/* Services List */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center space-y-2">
          <p className="text-sm font-medium text-slate-900">
            No {subFilter.toLowerCase()} items in {categoryLabel}
          </p>
          <button
            type="button"
            onClick={() => setSubFilter('All')}
            className="text-xs font-medium text-blue-600 hover:underline"
          >
            Show all {categoryLabel}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {filtered.map((svc) => {
            const provider = providers.find((p) => p.id === svc.providerId) ?? providers[0];
            return (
              <div
                key={svc.id}
                className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-4 transition-colors hover:border-blue-300"
              >
                <button
                  type="button"
                  onClick={() => onSelectProvider(provider)}
                  className="flex min-w-0 flex-1 items-center gap-3.5 text-left"
                >
                  <ServiceImage
                    imageKey={svc.imageKey}
                    alt={svc.name}
                    className="h-20 w-20 rounded-xl object-cover shrink-0"
                  />
                  <div className="min-w-0 space-y-1">
                    <h2 className="text-sm font-semibold text-slate-900 truncate">{svc.name}</h2>
                    <p className="font-mono text-xs text-slate-700 tabular-nums">
                      ₹{svc.price} · {svc.durationLabel}
                    </p>
                    <p className="inline-flex items-center gap-1 text-xs text-slate-600 tabular-nums">
                      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" aria-hidden="true" />
                      <span className="font-semibold text-slate-800">{svc.rating}</span>
                      <span>({svc.reviewCount} reviews)</span>
                    </p>
                    <p className="text-xs text-blue-600 truncate">By {provider.name}</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => onSelectService(svc)}
                  className="min-h-[40px] rounded-xl bg-[#1677FF] px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-blue-700 whitespace-nowrap shrink-0"
                >
                  Book Now
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
