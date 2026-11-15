import { useState } from 'react';
import { Heart, MapPin, Phone, RotateCcw, Sparkles, User } from 'lucide-react';
import { ServiceImage } from './ServiceImage';
import type { ServiceProvider, UserProfile } from '../types/community';

interface ProfileViewProps {
  user: UserProfile;
  providers: ServiceProvider[];
  onSaveProfile: (payload: { name: string; address: string; phone: string }) => Promise<void>;
  onSelectProvider: (provider: ServiceProvider) => void;
  onOpenOnboarding: () => void;
  onResetDemo: () => Promise<void>;
}

export function ProfileView({
  user,
  providers,
  onSaveProfile,
  onSelectProvider,
  onOpenOnboarding,
  onResetDemo,
}: ProfileViewProps) {
  const [name, setName] = useState(user.name);
  const [address, setAddress] = useState(user.address);
  const [phone, setPhone] = useState(user.phone);
  const [saving, setSaving] = useState(false);
  const [savedNotice, setSavedNotice] = useState(false);

  const favorites = providers.filter((p) => user.favoriteProviderIds.includes(p.id));

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSavedNotice(false);
    try {
      await onSaveProfile({ name, address, phone });
      setSavedNotice(true);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-2xl font-bold text-slate-900">Profile & Household</h1>
        <button
          type="button"
          onClick={onOpenOnboarding}
          className="inline-flex min-h-[40px] items-center gap-1.5 rounded-xl border border-blue-200 bg-blue-50 px-3.5 py-2 text-xs font-semibold text-blue-700 hover:bg-blue-100 whitespace-nowrap"
        >
          <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
          <span>View Welcome Screens</span>
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <form
          onSubmit={handleSave}
          className="lg:col-span-7 rounded-2xl border border-slate-200 bg-white p-6 space-y-4"
        >
          <div className="flex items-center gap-3.5 border-b border-slate-100 pb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-600">
              <User className="h-6 w-6" aria-hidden="true" />
            </div>
            <div>
              <h2 className="font-display text-lg font-bold text-slate-900">{user.name}</h2>
              <p className="text-xs text-slate-500">{user.neighborhood}</p>
            </div>
          </div>

          <div>
            <label htmlFor="pf-name" className="block text-xs font-medium text-slate-700 mb-1.5">
              Full Name
            </label>
            <input
              id="pf-name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-11 w-full rounded-xl border border-slate-200 px-3.5 text-sm text-slate-900 focus:border-blue-600 focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="pf-phone" className="block text-xs font-medium text-slate-700 mb-1.5">
              <span className="inline-flex items-center gap-1">
                <Phone className="h-3 w-3" aria-hidden="true" />
                Phone Number
              </span>
            </label>
            <input
              id="pf-phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="h-11 w-full rounded-xl border border-slate-200 px-3.5 font-mono text-sm text-slate-900 focus:border-blue-600 focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="pf-address" className="block text-xs font-medium text-slate-700 mb-1.5">
              <span className="inline-flex items-center gap-1">
                <MapPin className="h-3 w-3" aria-hidden="true" />
                Default Service Address
              </span>
            </label>
            <textarea
              id="pf-address"
              rows={2}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full rounded-xl border border-slate-200 p-3 text-sm text-slate-900 focus:border-blue-600 focus:outline-none"
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            {savedNotice ? (
              <span className="text-xs font-medium text-emerald-700">Profile saved.</span>
            ) : (
              <span className="text-xs text-slate-400">Used automatically for new bookings</span>
            )}
            <button
              type="submit"
              disabled={saving}
              className="min-h-[44px] rounded-xl bg-[#1677FF] px-5 py-2 text-xs font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>

        <div className="lg:col-span-5 space-y-6">
          <section className="rounded-2xl border border-slate-200 bg-white p-6 space-y-4">
            <div className="flex items-center gap-2">
              <Heart className="h-4 w-4 text-rose-500" aria-hidden="true" />
              <h2 className="font-display text-base font-semibold text-slate-900">
                Saved Professionals ({favorites.length})
              </h2>
            </div>
            {favorites.length === 0 ? (
              <p className="text-xs text-slate-500">
                Tap the heart icon on any technician profile to save them here.
              </p>
            ) : (
              <div className="space-y-3">
                {favorites.map((fav) => (
                  <button
                    key={fav.id}
                    type="button"
                    onClick={() => onSelectProvider(fav)}
                    className="flex w-full items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/70 p-3 text-left hover:bg-blue-50/50"
                  >
                    <ServiceImage
                      imageKey={fav.avatarKey}
                      alt={fav.name}
                      className="h-11 w-11 rounded-full object-cover object-top"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-slate-900 truncate">{fav.name}</p>
                      <p className="text-xs text-slate-500">
                        {fav.specialty} · ₹{fav.hourlyRate}/visit
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 space-y-3">
            <h2 className="font-display text-base font-semibold text-slate-900">Demo Controls</h2>
            <p className="text-xs text-slate-500">
              Restore the initial bookings, reviews, and messages from the prototype.
            </p>
            <button
              type="button"
              onClick={() => void onResetDemo()}
              className="inline-flex min-h-[40px] items-center gap-1.5 rounded-xl border border-slate-200 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
            >
              <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Reset Demo Data</span>
            </button>
          </section>
        </div>
      </div>
    </div>
  );
}
