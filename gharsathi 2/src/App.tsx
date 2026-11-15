import { useCallback, useEffect, useState } from 'react';
import { Calendar, Home, MessageCircle, User } from 'lucide-react';
import { api } from './lib/api';
import { HomeView } from './components/HomeView';
import { CategoryView } from './components/CategoryView';
import { ProviderProfileView } from './components/ProviderProfileView';
import { BookServiceView } from './components/BookServiceView';
import { LiveTrackingView } from './components/LiveTrackingView';
import { ServiceCompletedView } from './components/ServiceCompletedView';
import { BookingsView } from './components/BookingsView';
import { MessagesView } from './components/MessagesView';
import { ProfileView } from './components/ProfileView';
import { OnboardingModal } from './components/OnboardingModal';
import type {
  GharsathiData,
  HomeServiceItem,
  ServiceBooking,
  ServiceCategoryId,
  ServiceProvider,
} from './types/community';

type TabId = 'home' | 'bookings' | 'messages' | 'profile';

type ActiveRoute =
  | { view: 'home' }
  | { view: 'category'; category: ServiceCategoryId | 'All' }
  | { view: 'provider'; providerId: string }
  | { view: 'book'; serviceId: string; providerId: string }
  | { view: 'tracking'; bookingId: string }
  | { view: 'completed'; bookingId: string }
  | { view: 'bookings' }
  | { view: 'messages'; providerId?: string }
  | { view: 'profile' };

export default function App() {
  const [data, setData] = useState<GharsathiData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [route, setRoute] = useState<ActiveRoute>({ view: 'home' });
  const [activeChatProviderId, setActiveChatProviderId] = useState('pro-rohit');
  const [showOnboarding, setShowOnboarding] = useState(false);

  const loadData = useCallback(async () => {
    setError('');
    try {
      const snapshot = await api.getData();
      setData(snapshot);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load Gharsathi.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const unreadMessagesCount =
    data?.messages.filter((m) => m.sender === 'provider' && !m.read).length ?? 0;

  const activeTab: TabId =
    route.view === 'bookings' || route.view === 'tracking' || route.view === 'completed'
      ? 'bookings'
      : route.view === 'messages'
      ? 'messages'
      : route.view === 'profile'
      ? 'profile'
      : 'home';

  function goToTab(tab: TabId) {
    if (tab === 'home') setRoute({ view: 'home' });
    if (tab === 'bookings') setRoute({ view: 'bookings' });
    if (tab === 'messages') setRoute({ view: 'messages', providerId: activeChatProviderId });
    if (tab === 'profile') setRoute({ view: 'profile' });
  }

  async function handleToggleFavorite(providerId: string) {
    const updatedUser = await api.updateUser({ toggleFavoriteProviderId: providerId });
    setData((prev) => (prev ? { ...prev, user: updatedUser } : prev));
  }

  async function handleSaveProfile(payload: { name: string; address: string; phone: string }) {
    const updatedUser = await api.updateUser(payload);
    setData((prev) => (prev ? { ...prev, user: updatedUser } : prev));
  }

  async function handleConfirmBooking(payload: {
    serviceId: string;
    providerId: string;
    dateLabel: string;
    dateIso: string;
    timeSlot: string;
    address: string;
    paymentMethod: string;
    promoApplied: boolean;
  }) {
    const created = await api.createBooking(payload);
    setData((prev) => (prev ? { ...prev, bookings: [created, ...prev.bookings] } : prev));
    setRoute({ view: 'tracking', bookingId: created.id });
  }

  async function handleAdvanceTracking(bookingId: string, step: 1 | 2 | 3 | 4) {
    const updated = await api.updateBooking(bookingId, { trackingStep: step });
    setData((prev) =>
      prev
        ? {
            ...prev,
            bookings: prev.bookings.map((b) => (b.id === updated.id ? updated : b)),
          }
        : prev
    );
    if (step === 4) {
      setRoute({ view: 'completed', bookingId: updated.id });
    }
  }

  async function handleCancelBooking(bookingId: string) {
    const updated = await api.updateBooking(bookingId, { status: 'Cancelled' });
    setData((prev) =>
      prev
        ? {
            ...prev,
            bookings: prev.bookings.map((b) => (b.id === updated.id ? updated : b)),
          }
        : prev
    );
  }

  async function handleSubmitReview(payload: {
    bookingId: string;
    providerId: string;
    rating: number;
    comment: string;
  }) {
    const result = await api.submitReview(payload);
    setData((prev) =>
      prev
        ? {
            ...prev,
            providers: prev.providers.map((p) =>
              p.id === result.provider.id ? result.provider : p
            ),
            bookings: prev.bookings.map((b) =>
              b.id === payload.bookingId
                ? { ...b, reviewed: true, status: 'Completed', trackingStep: 4 }
                : b
            ),
          }
        : prev
    );
    setRoute({ view: 'bookings' });
  }

  async function handleSendMessage(providerId: string, text: string) {
    const msg = await api.sendMessage({ providerId, text });
    setData((prev) => (prev ? { ...prev, messages: [...prev.messages, msg] } : prev));
  }

  async function handleMarkRead(providerId: string) {
    await api.markRead(providerId);
    setData((prev) =>
      prev
        ? {
            ...prev,
            messages: prev.messages.map((m) =>
              m.providerId === providerId ? { ...m, read: true } : m
            ),
          }
        : prev
    );
  }

  async function handleResetDemo() {
    const fresh = await api.resetDemo();
    setData(fresh);
    setRoute({ view: 'home' });
  }

  const navTabs: { id: TabId; label: string; icon: typeof Home; badge?: number }[] = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'bookings', label: 'Bookings', icon: Calendar },
    {
      id: 'messages',
      label: 'Messages',
      icon: MessageCircle,
      badge: unreadMessagesCount > 0 ? unreadMessagesCount : undefined,
    },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <div className="min-h-screen bg-[#F2F6FC] text-slate-900 pb-20 lg:pb-0">
      {/* Desktop & Mobile Top Navigation Header (3-Zone Contract) */}
      <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-8 px-4 sm:px-6 lg:px-8">
          <button
            type="button"
            onClick={() => setRoute({ view: 'home' })}
            className="flex items-center gap-2 font-display text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#1677FF] text-white">
              <Home className="h-4 w-4" aria-hidden="true" />
            </span>
            <span>Gharsathi</span>
          </button>

          <nav aria-label="Primary navigation" className="hidden lg:flex items-center gap-6">
            {navTabs.map((tab) => {
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => goToTab(tab.id)}
                  className={`relative inline-flex items-center gap-1.5 py-1 text-sm font-medium transition-colors whitespace-nowrap shrink-0 ${
                    active
                      ? 'text-[#1677FF] underline underline-offset-8 decoration-2'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <span>{tab.label}</span>
                  {tab.badge && (
                    <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-500 px-1.5 font-mono text-[10px] font-bold text-white tabular-nums">
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => setRoute({ view: 'category', category: 'Plumber' })}
              className="min-h-[40px] rounded-xl bg-[#1677FF] px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-blue-700 whitespace-nowrap shrink-0"
            >
              Book Service
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        {loading ? (
          <div className="space-y-5" aria-label="Loading Gharsathi">
            <div className="h-36 w-full animate-pulse rounded-2xl bg-slate-200/70" />
            <div className="grid grid-cols-4 gap-3">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="h-20 animate-pulse rounded-xl bg-slate-200/70" />
              ))}
            </div>
            <div className="h-48 w-full animate-pulse rounded-2xl bg-slate-200/70" />
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-red-200 bg-white p-8 text-center space-y-3">
            <p className="text-sm font-semibold text-red-700">Failed to connect to Gharsathi</p>
            <p className="text-xs text-slate-600">{error}</p>
            <button
              type="button"
              onClick={() => void loadData()}
              className="rounded-xl bg-[#1677FF] px-4 py-2 text-xs font-semibold text-white"
            >
              Retry
            </button>
          </div>
        ) : data ? (
          <>
            {route.view === 'home' && (
              <HomeView
                user={data.user}
                services={data.services}
                providers={data.providers}
                onSelectCategory={(category) => setRoute({ view: 'category', category })}
                onSelectService={(svc: HomeServiceItem) =>
                  setRoute({ view: 'book', serviceId: svc.id, providerId: svc.providerId })
                }
                onSelectProvider={(prov: ServiceProvider) =>
                  setRoute({ view: 'provider', providerId: prov.id })
                }
                onOpenProfile={() => setRoute({ view: 'profile' })}
              />
            )}

            {route.view === 'category' && (
              <CategoryView
                category={route.category}
                services={data.services}
                providers={data.providers}
                onBack={() => setRoute({ view: 'home' })}
                onSelectService={(svc) =>
                  setRoute({ view: 'book', serviceId: svc.id, providerId: svc.providerId })
                }
                onSelectProvider={(prov) =>
                  setRoute({ view: 'provider', providerId: prov.id })
                }
              />
            )}

            {route.view === 'provider' && (
              <ProviderProfileView
                provider={
                  data.providers.find((p) => p.id === route.providerId) ?? data.providers[0]
                }
                isFavorite={data.user.favoriteProviderIds.includes(route.providerId)}
                services={data.services}
                onBack={() => setRoute({ view: 'home' })}
                onToggleFavorite={handleToggleFavorite}
                onMessageProvider={(prov) => {
                  setActiveChatProviderId(prov.id);
                  setRoute({ view: 'messages', providerId: prov.id });
                }}
                onBookProvider={(svc) =>
                  setRoute({
                    view: 'book',
                    serviceId: svc.id,
                    providerId: route.providerId,
                  })
                }
              />
            )}

            {route.view === 'book' && (
              <BookServiceView
                service={
                  data.services.find((s) => s.id === route.serviceId) ?? data.services[0]
                }
                provider={
                  data.providers.find((p) => p.id === route.providerId) ?? data.providers[0]
                }
                user={data.user}
                onBack={() => setRoute({ view: 'home' })}
                onConfirmBooking={handleConfirmBooking}
              />
            )}

            {route.view === 'tracking' && (() => {
              const booking =
                data.bookings.find((b) => b.id === route.bookingId) ?? data.bookings[0];
              if (!booking) return null;
              const provider =
                data.providers.find((p) => p.id === booking.providerId) ?? data.providers[0];
              return (
                <LiveTrackingView
                  booking={booking}
                  provider={provider}
                  onBack={() => setRoute({ view: 'bookings' })}
                  onAdvanceStep={handleAdvanceTracking}
                  onOpenChat={(prov) => {
                    setActiveChatProviderId(prov.id);
                    setRoute({ view: 'messages', providerId: prov.id });
                  }}
                />
              );
            })()}

            {route.view === 'completed' && (() => {
              const booking =
                data.bookings.find((b) => b.id === route.bookingId) ?? data.bookings[0];
              if (!booking) return null;
              return (
                <ServiceCompletedView
                  booking={booking}
                  onSubmitReview={handleSubmitReview}
                  onSkip={() => setRoute({ view: 'bookings' })}
                />
              );
            })()}

            {route.view === 'bookings' && (
              <BookingsView
                bookings={data.bookings}
                providers={data.providers}
                onTrackBooking={(b: ServiceBooking) =>
                  setRoute({ view: 'tracking', bookingId: b.id })
                }
                onRateBooking={(b: ServiceBooking) =>
                  setRoute({ view: 'completed', bookingId: b.id })
                }
                onMessageProvider={(prov: ServiceProvider) => {
                  setActiveChatProviderId(prov.id);
                  setRoute({ view: 'messages', providerId: prov.id });
                }}
                onCancelBooking={handleCancelBooking}
                onExploreServices={() => setRoute({ view: 'home' })}
              />
            )}

            {route.view === 'messages' && (
              <MessagesView
                providers={data.providers}
                messages={data.messages}
                activeProviderId={route.providerId ?? activeChatProviderId}
                onSelectProvider={(pid) => {
                  setActiveChatProviderId(pid);
                  setRoute({ view: 'messages', providerId: pid });
                }}
                onSendMessage={handleSendMessage}
                onMarkRead={handleMarkRead}
              />
            )}

            {route.view === 'profile' && (
              <ProfileView
                user={data.user}
                providers={data.providers}
                onSaveProfile={handleSaveProfile}
                onSelectProvider={(prov) =>
                  setRoute({ view: 'provider', providerId: prov.id })
                }
                onOpenOnboarding={() => setShowOnboarding(true)}
                onResetDemo={handleResetDemo}
              />
            )}
          </>
        ) : null}
      </main>

      {/* Mobile Fixed Bottom Navigation Bar (4 Tabs: Home, Bookings, Messages, Profile) */}
      <nav
        aria-label="Mobile bottom navigation"
        className="fixed bottom-0 left-0 right-0 z-30 border-t border-slate-200 bg-white/95 backdrop-blur-md lg:hidden"
      >
        <div className="grid h-16 grid-cols-4 items-center">
          {navTabs.map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => goToTab(tab.id)}
                className={`relative flex h-full flex-col items-center justify-center gap-1 transition-colors ${
                  active ? 'text-[#1677FF]' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <div className="relative">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                  {tab.badge && (
                    <span className="absolute -right-2 -top-1.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-red-500 px-1 font-mono text-[9px] font-bold text-white tabular-nums">
                      {tab.badge}
                    </span>
                  )}
                </div>
                <span className="text-[11px] font-medium leading-none">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Welcome & Onboarding Prototype Screens Modal */}
      {showOnboarding && <OnboardingModal onClose={() => setShowOnboarding(false)} />}
    </div>
  );
}
