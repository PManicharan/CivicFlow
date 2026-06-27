import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Toaster } from 'sonner'
import './index.css'
import App from './App.tsx'
import { ThemeProvider } from './components/ThemeProvider.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider defaultTheme="system" storageKey="civicflow-ui-theme">
      <App />
      <Toaster position="top-right" theme="system" richColors closeButton />
    </ThemeProvider>
  </StrictMode>,
)
