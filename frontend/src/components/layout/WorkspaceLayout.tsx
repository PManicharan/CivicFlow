import React, { useState, useEffect } from 'react';
import { Outlet, Link, NavLink, useLocation, Navigate } from 'react-router-dom';
import { Menu, X, PanelLeftClose, PanelLeftOpen, LayoutDashboard, Settings, BrainCircuit, LogOut, ChartNoAxesCombined } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { auth } from '../../lib/firebase';
import { signOut } from 'firebase/auth';

export function WorkspaceLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { currentUser } = useAuth();

  const [isCollapsed, setIsCollapsed] = useState(() => {
    return localStorage.getItem('civicflow-sidebar-collapsed') === 'true';
  });

  useEffect(() => {
    localStorage.setItem('civicflow-sidebar-collapsed', String(isCollapsed));
  }, [isCollapsed]);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsMobileMenuOpen(false);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  if (!currentUser) {
    return <Navigate to="/workspace/login" state={{ from: location }} replace />;
  }

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  interface NavItem {
    type?: 'heading' | 'divider' | 'action';
    to?: string;
    icon?: React.ElementType;
    label?: string;
    onClick?: () => void;
  }

  const navItems: NavItem[] = [
    { type: 'heading', label: 'Operations' },
    { to: '/workspace/operations', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/workspace/analytics', icon: ChartNoAxesCombined, label: 'Analytics' },
    { type: 'divider' },
    { type: 'heading', label: 'System' },
    { to: '/workspace/settings', icon: Settings, label: 'Settings' },
    { type: 'divider' },
    { type: 'action', icon: LogOut, label: 'Sign Out', onClick: handleLogout }
  ];

  return (
    <div className="flex min-h-screen flex-col bg-background font-sans antialiased text-foreground selection:bg-primary/20">
      <header className="sticky top-0 z-30 w-full border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="flex h-16 items-center px-4 lg:px-8">
          <div className="flex items-center gap-6">
            <button 
              className="hidden md:flex items-center justify-center w-8 h-8 rounded-md text-muted-foreground hover:bg-muted transition-colors"
              onClick={() => setIsCollapsed(!isCollapsed)}
              aria-label="Toggle Sidebar"
            >
              {isCollapsed ? <PanelLeftOpen className="w-5 h-5" /> : <PanelLeftClose className="w-5 h-5" />}
            </button>
            <button 
              className="md:hidden p-2 -ml-2 text-foreground focus-visible:ring-2 focus-visible:ring-primary rounded-md"
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Open Mobile Menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <Link to="/workspace/operations" className="flex items-center gap-2 font-semibold tracking-tight text-lg text-foreground hover:opacity-80 transition-opacity">
              <BrainCircuit className="w-5 h-5 text-primary" />
              {!isCollapsed && !isMobileMenuOpen ? "Secure Workspace" : <span className="hidden sm:inline">Secure Workspace</span>}
            </Link>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 md:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.aside 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-72 bg-background border-r border-border z-50 flex flex-col shadow-2xl md:hidden"
            >
              <div className="flex h-16 items-center justify-between px-6 border-b border-border">
                <div className="flex items-center gap-2 font-semibold tracking-tight text-lg">
                  <BrainCircuit className="w-5 h-5 text-primary" />
                  Workspace
                </div>
                <button 
                  className="p-2 text-muted-foreground hover:bg-muted rounded-md transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
                {navItems.map((item, idx) => {
                  if (item.type === 'heading') {
                    return <div key={idx} className="px-4 py-2 mt-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground pointer-events-none select-none">{item.label}</div>;
                  }
                  if (item.type === 'divider') {
                    return <div key={idx} className="h-px w-full bg-border my-4" />;
                  }
                  const Icon = item.icon;
                  if (item.type === 'action') {
                    return (
                      <button key={idx} onClick={item.onClick} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-all">
                        {Icon && <Icon className="w-5 h-5" />}
                        {item.label}
                      </button>
                    );
                  }
                  return (
                    <NavLink key={idx} to={item.to!} className={({isActive}) => `flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all ${isActive ? "bg-primary/10 text-primary font-bold border-l-4 border-primary shadow-sm" : "text-muted-foreground hover:bg-muted hover:text-foreground hover:-translate-y-px hover:shadow-sm border-l-4 border-transparent"}`}>
                      {Icon && <Icon className="w-5 h-5" />}
                      {item.label}
                    </NavLink>
                  );
                })}
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <div className="flex flex-1 overflow-hidden relative">
        <motion.aside 
          initial={false}
          animate={{ width: isCollapsed ? 80 : 280 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="hidden md:flex flex-col border-r border-border bg-muted/5 shrink-0 overflow-y-auto shadow-[1px_0_0_0_var(--border)] relative z-10"
        >
          <nav className="flex flex-col space-y-1 p-4 mt-2">
            {navItems.map((item, idx) => {
              if (item.type === 'heading') {
                return (
                  <div key={idx} className={`py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground pointer-events-none select-none transition-all duration-300 ${isCollapsed ? 'opacity-0 h-0 overflow-hidden' : 'px-3 mt-2 opacity-100'}`}>
                    {item.label}
                  </div>
                );
              }
              if (item.type === 'divider') {
                return <div key={idx} className="h-px w-full bg-border my-4" />;
              }
              const Icon = item.icon;
              if (item.type === 'action') {
                return (
                  <button key={idx} onClick={item.onClick} title={isCollapsed ? item.label : undefined} className={`flex items-center gap-3 py-3 rounded-xl text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-all duration-200 w-full ${isCollapsed ? 'justify-center px-0' : 'px-4'}`}>
                    {Icon && <Icon className="w-5 h-5 shrink-0" />}
                    <AnimatePresence>
                      {!isCollapsed && (
                        <motion.span initial={{ opacity: 0, width: 0 }} animate={{ opacity: 1, width: 'auto' }} exit={{ opacity: 0, width: 0 }} className="truncate">
                          {item.label}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </button>
                );
              }
              return (
                <NavLink 
                  key={idx} 
                  to={item.to!} 
                  title={isCollapsed ? item.label : undefined}
                  className={({isActive}) => `flex items-center gap-3 py-3 rounded-xl text-sm transition-all duration-200 ${isActive ? "bg-primary/10 text-primary font-bold border-l-4 border-primary shadow-sm" : "text-muted-foreground hover:bg-muted hover:text-foreground hover:-translate-y-px hover:shadow-sm border-l-4 border-transparent"} ${isCollapsed ? 'justify-center px-0' : 'px-4'}`}
                >
                  {Icon && <Icon className="w-5 h-5 shrink-0" />}
                  <AnimatePresence>
                    {!isCollapsed && (
                      <motion.span initial={{ opacity: 0, width: 0 }} animate={{ opacity: 1, width: 'auto' }} exit={{ opacity: 0, width: 0 }} className="truncate">
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </NavLink>
              );
            })}
          </nav>
        </motion.aside>

        <main className="flex-1 overflow-y-auto w-full scroll-smooth bg-background flex flex-col">
          <div className="flex-1 p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
