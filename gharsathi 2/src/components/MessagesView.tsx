import { useEffect, useState } from 'react';
import { Phone, Send } from 'lucide-react';
import { ServiceImage } from './ServiceImage';
import type { ChatMessage, ServiceProvider } from '../types/community';

interface MessagesViewProps {
  providers: ServiceProvider[];
  messages: ChatMessage[];
  activeProviderId: string;
  onSelectProvider: (providerId: string) => void;
  onSendMessage: (providerId: string, text: string) => Promise<void>;
  onMarkRead: (providerId: string) => Promise<void>;
}

export function MessagesView({
  providers,
  messages,
  activeProviderId,
  onSelectProvider,
  onSendMessage,
  onMarkRead,
}: MessagesViewProps) {
  const [draft, setDraft] = useState('');
  const [sending, setSending] = useState(false);

  const activeProvider =
    providers.find((p) => p.id === activeProviderId) ?? providers[0];

  const threadMessages = messages.filter((m) => m.providerId === activeProvider.id);

  useEffect(() => {
    const hasUnread = messages.some(
      (m) => m.providerId === activeProvider.id && m.sender === 'provider' && !m.read
    );
    if (hasUnread) {
      void onMarkRead(activeProvider.id);
    }
  }, [activeProvider.id, messages, onMarkRead]);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!draft.trim()) return;
    setSending(true);
    try {
      await onSendMessage(activeProvider.id, draft.trim());
      setDraft('');
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="space-y-4">
      <h1 className="font-display text-2xl font-bold text-slate-900">Messages</h1>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        {/* Provider Conversations List */}
        <aside className="lg:col-span-4 rounded-2xl border border-slate-200 bg-white overflow-hidden divide-y divide-slate-100">
          {providers.map((prov) => {
            const provMsgs = messages.filter((m) => m.providerId === prov.id);
            const last = provMsgs[provMsgs.length - 1];
            const unreadCount = provMsgs.filter((m) => m.sender === 'provider' && !m.read).length;
            const selected = prov.id === activeProvider.id;

            return (
              <button
                key={prov.id}
                type="button"
                onClick={() => onSelectProvider(prov.id)}
                className={`flex w-full items-center gap-3 p-4 text-left transition-colors ${
                  selected ? 'bg-blue-50/70' : 'hover:bg-slate-50'
                }`}
              >
                <ServiceImage
                  imageKey={prov.avatarKey}
                  alt={prov.name}
                  className="h-11 w-11 rounded-full object-cover object-top shrink-0 border border-slate-200"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-slate-900 truncate">{prov.name}</p>
                    <span className="font-mono text-[11px] text-slate-400 tabular-nums shrink-0">
                      {last?.timeLabel ?? ''}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-2 mt-0.5">
                    <p className="text-xs text-slate-500 truncate">
                      {last ? last.text : `${prov.specialty} · Available`}
                    </p>
                    {unreadCount > 0 && (
                      <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-500 px-1.5 font-mono text-[10px] font-bold text-white tabular-nums">
                        {unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </aside>

        {/* Active Chat Thread */}
        <section className="lg:col-span-8 flex h-[480px] flex-col rounded-2xl border border-slate-200 bg-white overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3.5">
            <div className="flex items-center gap-3">
              <ServiceImage
                imageKey={activeProvider.avatarKey}
                alt={activeProvider.name}
                className="h-10 w-10 rounded-full object-cover object-top border border-slate-200"
              />
              <div>
                <h2 className="text-sm font-semibold text-slate-900">{activeProvider.name}</h2>
                <p className="text-xs text-slate-500">{activeProvider.specialty}</p>
              </div>
            </div>
            <a
              href={`tel:${activeProvider.phone.replace(/\s+/g, '')}`}
              aria-label={`Call ${activeProvider.name}`}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-700 hover:bg-slate-50"
            >
              <Phone className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>

          <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-[#FAFCFF]">
            {threadMessages.length === 0 ? (
              <p className="text-center text-xs text-slate-400 pt-12">
                Start a conversation with {activeProvider.name} about your home service.
              </p>
            ) : (
              threadMessages.map((msg) => {
                const isUser = msg.sender === 'user';
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-[78%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                        isUser
                          ? 'bg-[#1677FF] text-white rounded-br-xs'
                          : 'bg-slate-100 text-slate-800 rounded-bl-xs'
                      }`}
                    >
                      {msg.text}
                    </div>
                    <span className="mt-1 font-mono text-[10px] text-slate-400 tabular-nums">
                      {msg.timeLabel}
                    </span>
                  </div>
                );
              })
            )}
          </div>

          <form
            onSubmit={handleSend}
            className="flex items-center gap-2.5 border-t border-slate-100 bg-white p-3.5"
          >
            <input
              type="text"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Type a message..."
              aria-label="Type a message"
              className="h-11 flex-1 rounded-full border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:bg-white focus:outline-none"
            />
            <button
              type="submit"
              disabled={sending || !draft.trim()}
              aria-label="Send message"
              className="flex h-11 w-11 items-center justify-center rounded-full bg-[#1677FF] text-white transition-colors hover:bg-blue-700 disabled:opacity-40 shrink-0"
            >
              <Send className="h-4 w-4" aria-hidden="true" />
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}
