import React from 'react';
import { createRouter, createRoute, createRootRoute, RouterProvider, Outlet } from '@tanstack/react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import StudySessionsPage from './pages/StudySessionsPage';
import RevisionSchedulePage from './pages/RevisionSchedulePage';
import TestsPage from './pages/TestsPage';
import SubjectDetailPage from './pages/SubjectDetailPage';
import ArchivedChaptersPage from './pages/ArchivedChaptersPage';
import RewardVaultPage from './pages/RewardVaultPage';
import QuestionPapersPage from './pages/QuestionPapersPage';
import ErrorLogPage from './pages/ErrorLogPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
    },
  },
});

const rootRoute = createRootRoute({
  component: () => (
    <Layout>
      <Outlet />
    </Layout>
  ),
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: Dashboard,
});

const studySessionsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/study-sessions',
  component: StudySessionsPage,
});

const revisionScheduleRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/revision-schedule',
  component: RevisionSchedulePage,
});

const testsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/tests',
  component: TestsPage,
});

const subjectDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/subject/$subjectName',
  component: SubjectDetailPage,
});

const archivedChaptersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/archived-chapters',
  component: ArchivedChaptersPage,
});

const rewardsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/rewards',
  component: RewardVaultPage,
});

const questionPapersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/question-papers',
  component: QuestionPapersPage,
});

const errorLogRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/error-log',
  component: ErrorLogPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  studySessionsRoute,
  revisionScheduleRoute,
  testsRoute,
  subjectDetailRoute,
  archivedChaptersRoute,
  rewardsRoute,
  questionPapersRoute,
  errorLogRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </ThemeProvider>
  );
}
