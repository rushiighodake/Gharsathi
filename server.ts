import express from 'express';
import path from 'node:path';
import crypto from 'node:crypto';
import { createSeedData, readDb, writeDb } from './server/db.ts';
import type { BookingStatus, ChatMessage, ServiceBooking } from './src/types/community.ts';

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '1mb' }));

function makeId(prefix: string): string {
  return `${prefix}-${crypto.randomUUID().slice(0, 8)}`;
}

// Get full Gharsathi state
app.get('/api/gharsathi', (_req, res) => {
  res.json(readDb());
});

// Toggle favorite provider or update user profile
app.patch('/api/user', (req, res) => {
  const { toggleFavoriteProviderId, name, address, phone } = req.body ?? {};
  const db = readDb();

  if (typeof toggleFavoriteProviderId === 'string') {
    const exists = db.user.favoriteProviderIds.includes(toggleFavoriteProviderId);
    db.user.favoriteProviderIds = exists
      ? db.user.favoriteProviderIds.filter((id) => id !== toggleFavoriteProviderId)
      : [...db.user.favoriteProviderIds, toggleFavoriteProviderId];
  }

  if (typeof name === 'string' && name.trim()) {
    db.user.name = name.trim().slice(0, 80);
    db.user.greetingName = db.user.name.split(' ')[0];
  }
  if (typeof address === 'string' && address.trim()) {
    db.user.address = address.trim().slice(0, 180);
  }
  if (typeof phone === 'string' && phone.trim()) {
    db.user.phone = phone.trim().slice(0, 24);
  }

  writeDb(db);
  res.json(db.user);
});

// Create a service booking
app.post('/api/bookings', (req, res) => {
  const { serviceId, providerId, dateLabel, dateIso, timeSlot, address, paymentMethod, promoApplied } =
    req.body ?? {};

  const db = readDb();
  const service = db.services.find((s) => s.id === serviceId);
  if (!service) {
    res.status(404).json({ error: 'Selected service not found.' });
    return;
  }

  const provider =
    db.providers.find((p) => p.id === (providerId || service.providerId)) ?? db.providers[0];

  const basePrice = service.price;
  const applyPromo = Boolean(promoApplied);
  const finalAmount = applyPromo ? Math.round(basePrice * 0.8) : basePrice;

  const booking: ServiceBooking = {
    id: makeId('bkg'),
    serviceId: service.id,
    serviceName: service.name,
    category: service.category,
    providerId: provider.id,
    providerName: provider.name,
    dateLabel: typeof dateLabel === 'string' && dateLabel.trim() ? dateLabel.trim() : 'Tue, 19 Aug',
    dateIso: typeof dateIso === 'string' && dateIso.trim() ? dateIso.trim() : new Date().toISOString().slice(0, 10),
    timeSlot: typeof timeSlot === 'string' && timeSlot.trim() ? timeSlot.trim() : '10:00 AM',
    address:
      typeof address === 'string' && address.trim() ? address.trim().slice(0, 180) : db.user.address,
    paymentMethod:
      typeof paymentMethod === 'string' && paymentMethod.trim() ? paymentMethod.trim() : 'UPI',
    promoApplied: applyPromo,
    totalAmount: finalAmount,
    status: 'Confirmed',
    trackingStep: 2,
    reviewed: false,
    imageKey: service.imageKey,
    createdAt: new Date().toISOString(),
  };

  db.bookings.unshift(booking);
  writeDb(db);
  res.status(201).json(booking);
});

// Update booking tracking step or status
app.patch('/api/bookings/:id', (req, res) => {
  const { id } = req.params;
  const { trackingStep, status } = req.body ?? {};
  const db = readDb();
  const booking = db.bookings.find((b) => b.id === id);

  if (!booking) {
    res.status(404).json({ error: 'Booking not found.' });
    return;
  }

  if (trackingStep === 1 || trackingStep === 2 || trackingStep === 3 || trackingStep === 4) {
    booking.trackingStep = trackingStep;
    if (trackingStep === 1) booking.status = 'Confirmed';
    if (trackingStep === 2) booking.status = 'On the way';
    if (trackingStep === 3) booking.status = 'Arrived';
    if (trackingStep === 4) booking.status = 'Completed';
  }

  const validStatuses: BookingStatus[] = [
    'Confirmed',
    'Pending',
    'On the way',
    'Arrived',
    'Completed',
    'Cancelled',
  ];
  if (validStatuses.includes(status)) {
    booking.status = status;
    if (status === 'Completed') booking.trackingStep = 4;
  }

  writeDb(db);
  res.json(booking);
});

// Submit a rating & review for a completed booking
app.post('/api/reviews', (req, res) => {
  const { bookingId, providerId, rating, comment } = req.body ?? {};
  const numericRating = Number(rating);
  if (!Number.isFinite(numericRating) || numericRating < 1 || numericRating > 5) {
    res.status(400).json({ error: 'Please select a star rating between 1 and 5.' });
    return;
  }

  const db = readDb();
  const provider = db.providers.find((p) => p.id === providerId);
  if (!provider) {
    res.status(404).json({ error: 'Provider not found.' });
    return;
  }

  const review = {
    id: makeId('rev'),
    authorName: db.user.name,
    rating: Math.round(numericRating),
    comment:
      typeof comment === 'string' && comment.trim()
        ? comment.trim().slice(0, 400)
        : 'Great and timely service.',
    createdAt: new Date().toISOString(),
  };

  provider.reviews.unshift(review);
  const totalWeight = provider.rating * provider.reviewCount + review.rating;
  provider.reviewCount += 1;
  provider.rating = Number((totalWeight / provider.reviewCount).toFixed(1));

  if (typeof bookingId === 'string') {
    const booking = db.bookings.find((b) => b.id === bookingId);
    if (booking) {
      booking.reviewed = true;
      booking.status = 'Completed';
      booking.trackingStep = 4;
    }
  }

  writeDb(db);
  res.status(201).json({ provider, review });
});

// Send a chat message to a provider
app.post('/api/messages', (req, res) => {
  const { providerId, text } = req.body ?? {};
  if (typeof providerId !== 'string' || typeof text !== 'string' || !text.trim()) {
    res.status(400).json({ error: 'Message text and provider are required.' });
    return;
  }

  const db = readDb();
  const now = new Date();
  const timeLabel = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

  const msg: ChatMessage = {
    id: makeId('msg'),
    providerId,
    sender: 'user',
    text: text.trim().slice(0, 500),
    timeLabel,
    read: true,
    createdAt: now.toISOString(),
  };

  db.messages.push(msg);

  // Mark provider's messages in this thread as read
  for (const m of db.messages) {
    if (m.providerId === providerId && m.sender === 'provider') {
      m.read = true;
    }
  }

  writeDb(db);
  res.status(201).json(msg);
});

// Mark messages from a provider as read
app.patch('/api/messages/read', (req, res) => {
  const { providerId } = req.body ?? {};
  if (typeof providerId !== 'string') {
    res.status(400).json({ error: 'providerId is required.' });
    return;
  }
  const db = readDb();
  for (const m of db.messages) {
    if (m.providerId === providerId) {
      m.read = true;
    }
  }
  writeDb(db);
  res.json({ ok: true });
});

// Reset demo data if requested from profile
app.post('/api/reset', (_req, res) => {
  const seed = createSeedData();
  writeDb(seed);
  res.json(seed);
});

async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distDir));
    app.get('*splat', (_req, res) => {
      res.sendFile(path.join(distDir, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Gharsathi server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start Gharsathi server:', err);
  process.exit(1);
});
