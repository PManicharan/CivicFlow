import { Suspense, lazy } from 'react';
import { RouterProvider, createBrowserRouter, Navigate } from 'react-router-dom';
import { RootLayout } from './components/layout/RootLayout';
import { PageSkeleton } from './components/ui/PageSkeleton';
import { ErrorBoundary } from './components/ErrorBoundary';

// Lazy load all pages for better performance
const Home = lazy(() => import('./pages/Home').then(m => ({ default: m.Home })));
const CommunitySignal = lazy(() => import('./pages/CommunitySignal').then(m => ({ default: m.CommunitySignal })));
const Investigation = lazy(() => import('./pages/Investigation').then(m => ({ default: m.Investigation })));
const OperationsWorkspace = lazy(() => import('./pages/OperationsWorkspace').then(m => ({ default: m.OperationsWorkspace })));
const About = lazy(() => import('./pages/About').then(m => ({ default: m.About })));
const Security = lazy(() => import('./pages/Security').then(m => ({ default: m.Security })));
const Support = lazy(() => import('./pages/Support').then(m => ({ default: m.Support })));
const Settings = lazy(() => import('./pages/Settings').then(m => ({ default: m.Settings })));
const HowItWorksPage = lazy(() => import('./pages/HowItWorksPage').then(m => ({ default: m.HowItWorksPage })));
const Documentation = lazy(() => import('./pages/Documentation').then(m => ({ default: m.Documentation })));
const Privacy = lazy(() => import('./pages/Privacy').then(m => ({ default: m.Privacy })));
const NotFound = lazy(() => import('./pages/NotFound').then(m => ({ default: m.NotFound })));
const SuccessExperience = lazy(() => import('./pages/SuccessExperience').then(m => ({ default: m.SuccessExperience })));

// New Version 2.0 Pages
const CommunityDashboard = lazy(() => import('./pages/CommunityDashboard').then(m => ({ default: m.CommunityDashboard })));
const PublicTracking = lazy(() => import('./pages/PublicTracking').then(m => ({ default: m.PublicTracking })));
const WorkspaceLogin = lazy(() => import('./pages/WorkspaceLogin').then(m => ({ default: m.WorkspaceLogin })));

import { WorkspaceLayout } from './components/layout/WorkspaceLayout';
import { AuthProvider } from './contexts/AuthContext';

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <ErrorBoundary>
        <RootLayout />
      </ErrorBoundary>
    ),
    children: [
      { 
        index: true, 
        element: (
          <Suspense fallback={<PageSkeleton />}>
            <Home />
          </Suspense>
        ) 
      },
      { 
        path: 'dashboard', 
        element: (
          <Suspense fallback={<PageSkeleton />}>
            <CommunityDashboard />
          </Suspense>
        ) 
      },
      { 
        path: 'signal', 
        element: (
          <Suspense fallback={<PageSkeleton />}>
            <CommunitySignal />
          </Suspense>
        ) 
      },
      { 
        path: 'success', 
        element: (
          <Suspense fallback={<PageSkeleton />}>
            <SuccessExperience />
          </Suspense>
        ) 
      },
      { 
        path: 'track/:id', 
        element: (
          <Suspense fallback={<PageSkeleton />}>
            <PublicTracking />
          </Suspense>
        ) 
      },
      { 
        path: 'about', 
        element: (
          <Suspense fallback={<PageSkeleton />}>
            <About />
          </Suspense>
        ) 
      },
      { 
        path: 'support', 
        element: (
          <Suspense fallback={<PageSkeleton />}>
            <Support />
          </Suspense>
        ) 
      },
      { 
        path: 'security', 
        element: (
          <Suspense fallback={<PageSkeleton />}>
            <Security />
          </Suspense>
        ) 
      },
      { 
        path: 'how-it-works', 
        element: (
          <Suspense fallback={<PageSkeleton />}>
            <HowItWorksPage />
          </Suspense>
        ) 
      },
      { 
        path: 'documentation', 
        element: (
          <Suspense fallback={<PageSkeleton />}>
            <Documentation />
          </Suspense>
        ) 
      },
      { 
        path: 'privacy', 
        element: (
          <Suspense fallback={<PageSkeleton />}>
            <Privacy />
          </Suspense>
        ) 
      },
      { 
        path: 'settings', 
        element: (
          <Suspense fallback={<PageSkeleton />}>
            <Settings />
          </Suspense>
        ) 
      },
      { 
        path: '*', 
        element: (
          <Suspense fallback={<PageSkeleton />}>
            <NotFound />
          </Suspense>
        ) 
      },
    ],
  },
  {
    path: '/workspace/login',
    element: (
      <ErrorBoundary>
        <Suspense fallback={<PageSkeleton />}>
          <WorkspaceLogin />
        </Suspense>
      </ErrorBoundary>
    )
  },
  {
    path: '/workspace',
    element: (
      <ErrorBoundary>
        <WorkspaceLayout />
      </ErrorBoundary>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/workspace/operations" replace />
      },
      {
        path: 'operations',
        element: (
          <Suspense fallback={<PageSkeleton />}>
            <OperationsWorkspace />
          </Suspense>
        )
      },
      {
        path: 'investigation/:id',
        element: (
          <Suspense fallback={<PageSkeleton />}>
            <Investigation />
          </Suspense>
        )
      },

      { 
        path: '*', 
        element: (
          <Suspense fallback={<PageSkeleton />}>
            <NotFound />
          </Suspense>
        ) 
      },
    ]
  }
]);

import { Toaster } from 'sonner';

function App() {
  return (
    <AuthProvider>
      <Toaster position="top-right" richColors />
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;
