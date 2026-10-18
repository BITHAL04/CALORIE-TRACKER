// Drop-in stand-in for @clerk/clerk-react, aliased in vite.config.ts when VITE_CLERK_PUBLISHABLE_KEY is unset.
// shortcut: name-only sign-in stored in localStorage, no passwords; set a Clerk key for real auth.
import { cloneElement, isValidElement, ReactElement, ReactNode, FormEvent, useState, useSyncExternalStore } from 'react';

type LocalUser = { id: string; username: string; firstName: string };

const KEY = 'nexafit-local-user';
const listeners = new Set<() => void>();

const load = (): LocalUser | null => {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
};

// Module-level state so every hook sees the same object (consumers use `user` as an effect dependency)
let currentUser = load();
let dialogOpen = false;

const emit = () => listeners.forEach((l) => l());
const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};

const setUser = (user: LocalUser | null) => {
  currentUser = user;
  try {
    if (user) localStorage.setItem(KEY, JSON.stringify(user));
    else localStorage.removeItem(KEY);
  } catch { /* storage blocked: session-only sign-in */ }
  emit();
};

const setDialog = (open: boolean) => {
  dialogOpen = open;
  emit();
};

const useCurrentUser = () => useSyncExternalStore(subscribe, () => currentUser);

const SignInDialog = () => {
  const open = useSyncExternalStore(subscribe, () => dialogOpen);
  const [name, setName] = useState('');
  if (!open) return null;

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const username = name.trim();
    if (!username) return;
    setUser({ id: 'local_' + username.toLowerCase().replace(/[^a-z0-9]+/g, '_'), username, firstName: username });
    setName('');
    setDialog(false);
  };

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 p-4"
      onMouseDown={(e) => e.target === e.currentTarget && setDialog(false)}
    >
      <form
        onSubmit={submit}
        role="dialog"
        aria-modal="true"
        aria-labelledby="local-signin-title"
        className="w-full max-w-sm space-y-4 rounded-2xl bg-white p-6 shadow-2xl"
      >
        <h2 id="local-signin-title" className="text-xl font-bold text-gray-900">Sign in to nexaFit</h2>
        <p className="text-sm text-gray-600">Enter a username. Use the same one next time to get your data back.</p>
        <input
          autoFocus
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Username"
          aria-label="Username"
          maxLength={40}
          className="w-full rounded-lg border px-3 py-2 text-gray-900 outline-none focus:border-nexafit-accent"
        />
        <div className="flex justify-end gap-2">
          <button type="button" onClick={() => setDialog(false)} className="rounded-full px-4 py-2 text-gray-700 hover:bg-gray-100">
            Cancel
          </button>
          <button type="submit" disabled={!name.trim()} className="rounded-full bg-nexafit-accent px-4 py-2 text-white disabled:opacity-50">
            Continue
          </button>
        </div>
      </form>
    </div>
  );
};

export const ClerkProvider = ({ children }: { children: ReactNode; [k: string]: unknown }) => (
  <>
    {children}
    <SignInDialog />
  </>
);

export const useUser = () => {
  const user = useCurrentUser();
  return { user, isLoaded: true, isSignedIn: !!user };
};

export const useAuth = () => {
  const user = useCurrentUser();
  return {
    isLoaded: true,
    isSignedIn: !!user,
    userId: user?.id ?? null,
    getToken: async () => null,
    signOut: async () => setUser(null),
  };
};

const openDialog = () => setDialog(true);

const AuthButton = ({ children }: { children?: ReactNode; mode?: string }) =>
  isValidElement(children)
    ? cloneElement(children as ReactElement<{ onClick?: () => void }>, { onClick: openDialog })
    : <button onClick={openDialog}>{children ?? 'Sign in'}</button>;

export const SignInButton = AuthButton;
export const SignUpButton = AuthButton;

export const UserButton = ({ afterSignOutUrl = '/' }: { afterSignOutUrl?: string }) => {
  const user = useCurrentUser();
  if (!user) return null;
  return (
    <button
      title={`Signed in as ${user.username} — click to sign out`}
      aria-label="Sign out"
      onClick={() => { setUser(null); window.location.assign(afterSignOutUrl); }}
      className="h-8 w-8 rounded-full bg-nexafit-accent font-bold text-white"
    >
      {user.username[0].toUpperCase()}
    </button>
  );
};
