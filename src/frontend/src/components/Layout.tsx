import { Outlet, Link, useRouterState } from '@tanstack/react-router';
import { BookOpen, Calendar, ClipboardList, FileText, Archive } from 'lucide-react';
import { ExamCountdown } from './ExamCountdown';

export function Layout() {
  const router = useRouterState();
  const currentPath = router.location.pathname;

  const navItems = [
    { path: '/', label: 'Dashboard', icon: BookOpen },
    { path: '/sessions', label: 'Study', icon: ClipboardList },
    { path: '/revisions', label: 'Revisions', icon: Calendar },
    { path: '/tests', label: 'Tests', icon: FileText },
    { path: '/archived-chapters', label: 'Archive', icon: Archive },
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b-2 border-primary/20 bg-card shadow-web sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="text-center flex-1">
              <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
                AGAM RITUL PATWA'S STUDY TRACKER
              </h1>
              <p className="text-sm text-muted-foreground mt-1">CA Final Preparation Dashboard 🕷️</p>
            </div>
            <ExamCountdown />
          </div>
          <nav className="flex justify-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPath === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-primary to-secondary text-primary-foreground shadow-lg'
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">
        <Outlet />
      </main>
      <footer className="border-t-2 border-primary/20 bg-card py-6 mt-16">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>
            © {new Date().getFullYear()} CA Final Tracker. Built with ❤️ using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
                typeof window !== 'undefined' ? window.location.hostname : 'ca-final-tracker'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-primary hover:underline"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
