import { useState } from 'react';
import {
  Brush,
  Droplets,
  Flame,
  Hammer,
  Home as HomeIcon,
  LayoutGrid,
  Search,
  SlidersHorizontal,
  Sparkles,
  Star,
  User,
  Zap,
} from 'lucide-react';
import { APP_IMAGES } from '../lib/assets';
import { ServiceImage } from './ServiceImage';
import type {
  HomeServiceItem,
  ServiceCategoryId,
  ServiceProvider,
  UserProfile,
} from '../types/community';

interface HomeViewProps {
  user: UserProfile;
  services: HomeServiceItem[];
  providers: ServiceProvider[];
  onSelectCategory: (cat: ServiceCategoryId | 'All') => void;
  onSelectService: (service: HomeServiceItem) => void;
  onSelectProvider: (provider: ServiceProvider) => void;
  onOpenProfile: () => void;
}

const QUICK_CATEGORIES: {
  id: ServiceCategoryId;
  label: string;
  icon: typeof Droplets;
  colorClass: string;
}[] = [
  { id: 'Plumber', label: 'Plumber', icon: Droplets, colorClass: 'text-blue-600' },
  { id: 'Electrician', label: 'Electrician', icon: Zap, colorClass: 'text-amber-600' },
  { id: 'Cleaner', label: 'Cleaner', icon: Sparkles, colorClass: 'text-sky-600' },
  { id: 'Painter', label: 'Painter', icon: Brush, colorClass: 'text-indigo-600' },
  { id: 'Mason', label: 'Mason', icon: Hammer, colorClass: 'text-orange-600' },
  { id: 'Welder', label: 'Welder', icon: Flame, colorClass: 'text-rose-600' },
  { id: 'Roofer', label: 'Roofer', icon: HomeIcon, colorClass: 'text-teal-600' },
  { id: 'More', label: 'More', icon: LayoutGrid, colorClass: 'text-blue-700' },
];

export function HomeView({
  user,
  services,
  providers,
  onSelectCategory,
  onSelectService,
  onSelectProvider,
  onOpenProfile,
}: HomeViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortByRating, setSortByRating] = useState(false);

  const filteredServices = services
    .filter((s) => {
      const q = searchQuery.trim().toLowerCase();
      if (!q) return true;
      return (
        s.name.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q)
      );
    })
    .sort((a, b) => (sortByRating ? b.rating - a.rating : 0));

  const displayServices = searchQuery.trim() ? filteredServices : filteredServices.slice(0, 4);

  return (
    <div className="space-y-6">
      {/* Greeting Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">Good Morning,</p>
          <h1 className="font-display text-2xl font-bold tracking-tight text-slate-900">
            {user.greetingName}
          </h1>
        </div>
        <button
          type="button"
          onClick={onOpenProfile}
          aria-label="Open profile"
          className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-blue-700 shadow-xs transition-colors hover:bg-blue-50 shrink-0"
        >
          <User className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>

      {/* Search Bar */}
      <div className="flex items-center gap-2.5">
        <div className="relative flex-1">
          <Search
            className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
            aria-hidden="true"
          />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for any service..."
            aria-label="Search for any service"
            className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:outline-none"
          />
        </div>
        <button
          type="button"
          onClick={() => setSortByRating((v) => !v)}
          aria-label="Sort by top rated"
          title={sortByRating ? 'Sorted by top rated' : 'Sort by top rated'}
          className={`flex h-11 w-11 items-center justify-center rounded-xl border transition-colors shrink-0 ${
            sortByRating
              ? 'border-blue-600 bg-blue-600 text-white'
              : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
          }`}
        >
          <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>

      {/* Promo Banner + Quick Book Grid (2-col on desktop, stacked on mobile) */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-stretch">
        {/* Promo Banner */}
        <section className="lg:col-span-5 relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#DCEBFF] via-[#D4E6FF] to-[#C2DCFF] p-5 flex items-center justify-between gap-4 border border-blue-200/70">
          <div className="space-y-3 z-10 max-w-[62%]">
            <h2 className="font-display text-lg font-bold leading-snug text-slate-900 sm:text-xl">
              Get 20% OFF on your first booking
            </h2>
            <p className="text-xs text-slate-700">
              Verified doorstep experts across {user.neighborhood}.
            </p>
            <button
              type="button"
              onClick={() => onSelectCategory('Plumber')}
              className="inline-flex min-h-[40px] items-center justify-center rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-blue-700 whitespace-nowrap shrink-0"
            >
              Book Now
            </button>
          </div>
          <div className="w-28 sm:w-32 shrink-0 self-end">
            <img
              src={APP_IMAGES.handymanHero}
              alt="Gharsathi home service technician"
              referrerPolicy="no-referrer"
              className="h-28 w-28 sm:h-32 sm:w-32 rounded-2xl object-cover shadow-xs"
            />
          </div>
        </section>

        {/* Quick Book 8-Category Grid */}
        <section className="lg:col-span-7 rounded-2xl border border-slate-200 bg-white p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-base font-semibold text-slate-900">Quick Book</h2>
            <button
              type="button"
              onClick={() => onSelectCategory('All')}
              className="text-xs font-medium text-blue-600 hover:text-blue-700 whitespace-nowrap shrink-0"
            >
              All services
            </button>
          </div>
          <div className="grid grid-cols-4 gap-3 sm:gap-4">
            {QUICK_CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => onSelectCategory(cat.id === 'More' ? 'All' : cat.id)}
                  className="group flex min-h-[76px] flex-col items-center justify-center gap-2 rounded-xl bg-[#F4F8FF] p-2.5 transition-colors hover:bg-blue-50 focus-visible:outline-2 focus-visible:outline-blue-600"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-xs transition-transform group-hover:scale-105">
                    <Icon className={`h-5 w-5 ${cat.colorClass}`} aria-hidden="true" />
                  </span>
                  <span className="text-xs font-medium text-slate-800 whitespace-nowrap">
                    {cat.label}
                  </span>
                </button>
              );
            })}
          </div>
        </section>
      </div>

      {/* Popular Services */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-base font-semibold text-slate-900">
            {searchQuery.trim() ? `Search Results (${displayServices.length})` : 'Popular Services'}
          </h2>
          <button
            type="button"
            onClick={() => onSelectCategory('All')}
            className="text-xs font-medium text-blue-600 hover:text-blue-700 whitespace-nowrap shrink-0"
          >
            View all
          </button>
        </div>

        {displayServices.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center space-y-2">
            <p className="text-sm font-medium text-slate-900">No services found for "{searchQuery}"</p>
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="text-xs font-medium text-blue-600 hover:underline"
            >
              Clear search
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {displayServices.map((svc) => {
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
                      className="h-16 w-16 rounded-xl object-cover shrink-0"
                    />
                    <div className="min-w-0 space-y-1">
                      <h3 className="text-sm font-semibold text-slate-900 truncate">{svc.name}</h3>
                      <p className="text-xs text-slate-600 font-mono tabular-nums">
                        from ₹{svc.price} · {svc.durationLabel}
                      </p>
                      <p className="inline-flex items-center gap-1 text-xs text-slate-600 tabular-nums">
                        <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" aria-hidden="true" />
                        <span className="font-semibold text-slate-800">{svc.rating}</span>
                        <span className="text-slate-500">({svc.reviewCount}+ reviews)</span>
                      </p>
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
      </section>
    </div>
  );
}
