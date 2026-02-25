import React from 'react';
import { Link, useLocation } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Toaster } from '@/components/ui/sonner';
import {
  BookOpen,
  Calendar,
  ClipboardList,
  Trophy,
  Archive,
  FileText,
  LayoutDashboard,
  LogOut,
  LogIn,
  Loader2,
  AlertCircle,
  Zap,
} from 'lucide-react';
import { useGetCallerUserProfile } from '../hooks/useGetCallerUserProfile';
import ProfileSetupModal from './ProfileSetupModal';

const navItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/study-sessions', label: 'Study Sessions', icon: BookOpen },
  { path: '/revision-schedule', label: 'Revision', icon: Calendar },
  { path: '/tests', label: 'Tests', icon: ClipboardList },
  { path: '/rewards', label: 'Rewards', icon: Trophy },
  { path: '/archived-chapters', label: 'Archive', icon: Archive },
  { path: '/question-papers', label: 'Papers', icon: FileText },
  { path: '/error-log', label: 'Error Log', icon: AlertCircle },
];

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { identity, login, clear, loginStatus, isInitializing } = useInternetIdentity();
  const queryClient = useQueryClient();
  const location = useLocation();
  const isAuthenticated = !!identity;
  const isLoggingIn = loginStatus === 'logging-in';

  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();
  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;

  const handleAuth = async () => {
    if (isAuthenticated) {
      await clear();
      queryClient.clear();
    } else {
      try {
        await login();
      } catch (error: unknown) {
        const err = error as Error;
        if (err?.message === 'User is already authenticated') {
          await clear();
          setTimeout(() => login(), 300);
        }
      }
    }
  };

  if (isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
              <Zap className="h-8 w-8 text-primary animate-pulse" />
            </div>
          </div>
          <p className="text-muted-foreground text-sm">Loading your study universe...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
        <div className="absolute inset-0 web-pattern opacity-30" />
        <div className="relative z-10 text-center space-y-8 max-w-md mx-auto px-6">
          <div className="space-y-4">
            <div className="flex justify-center">
              <div className="w-24 h-24 rounded-full bg-primary/20 border-2 border-primary/40 flex items-center justify-center shadow-web">
                <span className="text-4xl">🕷️</span>
              </div>
            </div>
            <h1 className="text-4xl font-black tracking-tight text-foreground">
              CA Study<span className="text-primary">Hub</span>
            </h1>
            <p className="text-muted-foreground text-lg">
              Your ultimate CA Final exam preparation companion
            </p>
          </div>
          <div className="space-y-3">
            <Button
              onClick={handleAuth}
              disabled={isLoggingIn}
              size="lg"
              className="w-full font-bold text-base"
            >
              {isLoggingIn ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Logging in...
                </>
              ) : (
                <>
                  <LogIn className="mr-2 h-5 w-5" />
                  Login to Continue
                </>
              )}
            </Button>
            <p className="text-xs text-muted-foreground">
              Secure login powered by Internet Identity
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">🕷️</span>
            <span className="font-black text-lg tracking-tight">
              CA Study<span className="text-primary">Hub</span>
            </span>
          </div>
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link key={item.path} to={item.path}>
                  <Button
                    variant={isActive ? 'default' : 'ghost'}
                    size="sm"
                    className="text-xs h-8"
                  >
                    <Icon className="h-3.5 w-3.5 mr-1" />
                    {item.label}
                  </Button>
                </Link>
              );
            })}
          </nav>
          <div className="flex items-center gap-2">
            {userProfile && (
              <span className="text-sm text-muted-foreground hidden sm:block">
                {userProfile.name}
              </span>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={handleAuth}
              disabled={isLoggingIn}
              className="text-xs"
            >
              {isLoggingIn ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <>
                  <LogOut className="h-3.5 w-3.5 mr-1" />
                  Logout
                </>
              )}
            </Button>
          </div>
        </div>
        {/* Mobile nav */}
        <div className="md:hidden border-t border-border/30 overflow-x-auto">
          <div className="flex items-center gap-1 px-2 py-1 min-w-max">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link key={item.path} to={item.path}>
                  <Button
                    variant={isActive ? 'default' : 'ghost'}
                    size="sm"
                    className="text-xs h-7 px-2"
                  >
                    <Icon className="h-3 w-3 mr-1" />
                    {item.label}
                  </Button>
                </Link>
              );
            })}
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 container mx-auto px-4 py-6">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-border/30 py-4 text-center text-xs text-muted-foreground">
        <p>
          © {new Date().getFullYear()} CA StudyHub · Built with{' '}
          <span className="text-primary">❤️</span> using{' '}
          <a
            href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-foreground transition-colors"
          >
            caffeine.ai
          </a>
        </p>
      </footer>

      <Toaster richColors position="top-right" />
      {showProfileSetup && <ProfileSetupModal />}
    </div>
  );
}
