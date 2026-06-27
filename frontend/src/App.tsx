import { Suspense, lazy } from 'react';
import { RouterProvider, createBrowserRouter, Navigate } from 'react-router-dom';
import { RootLayout } from './components/layout/RootLayout';
import { Loading } from './components/ui/Loading';
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
          <Suspense fallback={<Loading fullScreen />}>
            <Home />
          </Suspense>
        ) 
      },
      { path: 'dashboard', element: <Navigate to="/operations" replace /> },
      { 
        path: 'signal', 
        element: (
          <Suspense fallback={<Loading fullScreen />}>
            <CommunitySignal />
          </Suspense>
        ) 
      },
      { 
        path: 'success', 
        element: (
          <Suspense fallback={<Loading fullScreen />}>
            <SuccessExperience />
          </Suspense>
        ) 
      },
      { 
        path: 'investigation', 
        element: (
          <Suspense fallback={<Loading fullScreen />}>
            <Investigation />
          </Suspense>
        ) 
      },
      { 
        path: 'operations', 
        element: (
          <Suspense fallback={<Loading fullScreen />}>
            <OperationsWorkspace />
          </Suspense>
        ) 
      },
      { 
        path: 'about', 
        element: (
          <Suspense fallback={<Loading fullScreen />}>
            <About />
          </Suspense>
        ) 
      },
      { 
        path: 'support', 
        element: (
          <Suspense fallback={<Loading fullScreen />}>
            <Support />
          </Suspense>
        ) 
      },
      { 
        path: 'security', 
        element: (
          <Suspense fallback={<Loading fullScreen />}>
            <Security />
          </Suspense>
        ) 
      },
      { 
        path: 'settings', 
        element: (
          <Suspense fallback={<Loading fullScreen />}>
            <Settings />
          </Suspense>
        ) 
      },
      { 
        path: 'how-it-works', 
        element: (
          <Suspense fallback={<Loading fullScreen />}>
            <HowItWorksPage />
          </Suspense>
        ) 
      },
      { 
        path: 'documentation', 
        element: (
          <Suspense fallback={<Loading fullScreen />}>
            <Documentation />
          </Suspense>
        ) 
      },
      { 
        path: 'privacy', 
        element: (
          <Suspense fallback={<Loading fullScreen />}>
            <Privacy />
          </Suspense>
        ) 
      },
      { 
        path: '*', 
        element: (
          <Suspense fallback={<Loading fullScreen />}>
            <NotFound />
          </Suspense>
        ) 
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
