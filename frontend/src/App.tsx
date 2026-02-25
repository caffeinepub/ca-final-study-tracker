import { RouterProvider, createRouter, createRoute, createRootRoute } from '@tanstack/react-router';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { StudySessionsPage } from './pages/StudySessionsPage';
import { RevisionSchedulePage } from './pages/RevisionSchedulePage';
import { TestsPage } from './pages/TestsPage';
import { SubjectDetailPage } from './pages/SubjectDetailPage';
import { ArchivedChaptersPage } from './pages/ArchivedChaptersPage';
import { RewardVaultPage } from './pages/RewardVaultPage';
import { QuestionPapersPage } from './pages/QuestionPapersPage';

const rootRoute = createRootRoute({
  component: Layout,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: Dashboard,
});

const sessionsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/sessions',
  component: StudySessionsPage,
});

const revisionsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/revisions',
  component: RevisionSchedulePage,
});

const testsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/tests',
  component: TestsPage,
});

const subjectDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/subjects/$subjectName',
  component: SubjectDetailPage,
});

const archivedChaptersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/archived-chapters',
  component: ArchivedChaptersPage,
});

const rewardVaultRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/reward-vault',
  component: RewardVaultPage,
});

const questionPapersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/question-papers',
  component: QuestionPapersPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  sessionsRoute,
  revisionsRoute,
  testsRoute,
  subjectDetailRoute,
  archivedChaptersRoute,
  rewardVaultRoute,
  questionPapersRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
