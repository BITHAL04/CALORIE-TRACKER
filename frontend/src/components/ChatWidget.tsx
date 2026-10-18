import { useEffect, useRef, useState, FormEvent } from 'react';
import axios from 'axios';
import { MessageCircle, X, Send, ListChecks } from 'lucide-react';

type Turn = { role: 'user' | 'assistant'; content: string };

const API = import.meta.env.VITE_API_URL;

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [turns, setTurns] = useState<Turn[]>([]);
  const [questions, setQuestions] = useState<string[]>([]);
  const [showQuestions, setShowQuestions] = useState(true);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open && questions.length === 0) {
      axios.get<string[]>(`${API}/chat/questions`).then((r) => setQuestions(r.data)).catch(() => {});
    }
  }, [open, questions.length]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [turns, loading]);

  const ask = async (message: string) => {
    const text = message.trim();
    if (!text || loading) return;
    setInput('');
    setShowQuestions(false);
    setTurns((t) => [...t, { role: 'user', content: text }]);
    setLoading(true);
    try {
      const { data } = await axios.post<{ reply: string }>(`${API}/chat`, {
        message: text,
        history: turns.slice(-10),
      });
      setTurns((t) => [...t, { role: 'assistant', content: data.reply }]);
    } catch {
      setTurns((t) => [...t, { role: 'assistant', content: "Sorry, I couldn't reach the server. Please try again." }]);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    ask(input);
  };

  return (
    <>
      {open && (
        <div className="fixed bottom-24 right-4 z-[100] flex h-[70vh] max-h-[600px] w-[calc(100vw-2rem)] max-w-sm flex-col overflow-hidden rounded-2xl border bg-white shadow-2xl">
          <div className="flex items-center justify-between bg-nexafit-accent px-4 py-3 text-white">
            <div>
              <p className="font-semibold">nexaFit Diet Assistant</p>
              <p className="text-xs opacity-80">Ask anything about nutrition</p>
            </div>
            <div className="flex gap-1">
              <button
                onClick={() => setShowQuestions((s) => !s)}
                aria-label="Toggle suggested questions"
                title="Suggested questions"
                className="rounded p-1 hover:bg-white/20"
              >
                <ListChecks className="h-5 w-5" />
              </button>
              <button onClick={() => setOpen(false)} aria-label="Close chat" className="rounded p-1 hover:bg-white/20">
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto p-4 text-sm">
            <div className="max-w-[85%] rounded-2xl rounded-tl-sm bg-gray-100 px-3 py-2 text-gray-800">
              Hi! I'm your diet assistant. Pick a question below or type your own.
            </div>
            {turns.map((t, i) => (
              <div
                key={i}
                className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-3 py-2 ${
                  t.role === 'user'
                    ? 'ml-auto rounded-tr-sm bg-nexafit-accent text-white'
                    : 'rounded-tl-sm bg-gray-100 text-gray-800'
                }`}
              >
                {t.content}
              </div>
            ))}
            {loading && <div className="w-16 rounded-2xl bg-gray-100 px-3 py-2 text-gray-500">...</div>}

            {showQuestions && questions.length > 0 && (
              <div className="space-y-2 pt-2">
                <p className="text-xs font-medium text-gray-500">Suggested questions</p>
                {questions.map((q) => (
                  <button
                    key={q}
                    onClick={() => ask(q)}
                    disabled={loading}
                    className="block w-full rounded-lg border border-nexafit-accent/30 px-3 py-2 text-left text-gray-700 hover:bg-nexafit-accent/10 disabled:opacity-50"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          <form onSubmit={onSubmit} className="flex gap-2 border-t p-3">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your question..."
              aria-label="Chat message"
              maxLength={2000}
              className="flex-1 rounded-full border px-4 py-2 text-sm outline-none focus:border-nexafit-accent"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              aria-label="Send"
              className="rounded-full bg-nexafit-accent p-2 text-white disabled:opacity-50"
            >
              <Send className="h-5 w-5" />
            </button>
          </form>
        </div>
      )}

      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? 'Close diet assistant' : 'Open diet assistant'}
        className="fixed bottom-6 right-4 z-[100] flex h-14 w-14 items-center justify-center rounded-full bg-nexafit-accent text-white shadow-lg transition-transform hover:scale-110"
      >
        {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </button>
    </>
  );
}
