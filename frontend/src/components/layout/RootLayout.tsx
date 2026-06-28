import { useState, useEffect } from 'react';
import { Outlet, Link, NavLink, useLocation } from 'react-router-dom';
import { Map, Menu, X, LayoutDashboard, PlusCircle, Settings, HelpCircle, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function RootLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const [isCollapsed, setIsCollapsed] = useState(() => {
    return localStorage.getItem('civicflow-main-sidebar-collapsed') === 'true';
  });

  useEffect(() => {
    localStorage.setItem('civicflow-main-sidebar-collapsed', String(isCollapsed));
  }, [isCollapsed]);

  const isLandingPage = location.pathname === '/';

  // Close mobile drawer on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Prevent scroll when mobile drawer is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isMobileMenuOpen]);

  // Close mobile drawer on ESC
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsMobileMenuOpen(false);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  const navItems = [
    { type: 'heading', label: 'MENU' },
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/signal', icon: PlusCircle, label: 'Submit Signal' },
    { type: 'divider' },
    { type: 'heading', label: 'SYSTEM' },
    { to: '/settings', icon: Settings, label: 'Settings' },
    { to: '/support', icon: HelpCircle, label: 'Support' }
  ];

  return (
    <div className="flex min-h-screen flex-col bg-background font-sans antialiased text-foreground selection:bg-primary/20">
      
      {/* Header */}
      <header className="sticky top-0 z-30 w-full border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Left Nav */}
            <div className="flex items-center gap-6">
              {!isLandingPage && (
                <button 
                  className="hidden md:flex items-center justify-center w-8 h-8 rounded-md text-muted-foreground hover:bg-muted transition-colors"
                  onClick={() => setIsCollapsed(!isCollapsed)}
                  aria-label="Toggle Sidebar"
                >
                  {isCollapsed ? <PanelLeftOpen className="w-5 h-5" /> : <PanelLeftClose className="w-5 h-5" />}
                </button>
              )}
              <button 
                className="md:hidden p-2 -ml-2 text-foreground focus-visible:ring-2 focus-visible:ring-primary rounded-md"
                onClick={() => setIsMobileMenuOpen(true)}
                aria-label="Open Mobile Menu"
              >
                <Menu className="w-5 h-5" />
              </button>

              <Link to="/" className="flex items-center gap-2 font-semibold tracking-tight text-lg text-foreground hover:opacity-80 transition-opacity">
                <Map className="w-5 h-5 text-primary" />
                <span>CivicFlow.</span>
              </Link>
            </div>
            
            {/* Right Nav */}
            <div className="flex items-center gap-4">
              <NavLink to="/workspace" className={({isActive}) => `text-sm font-medium transition-colors hidden sm:block ${isActive ? "text-primary font-bold" : "text-muted-foreground hover:text-foreground"}`}>
                Workspace
              </NavLink>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Drawer */}
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
                  <Map className="w-5 h-5 text-primary" />
                  CivicFlow.
                </div>
                <button 
                  className="p-2 text-muted-foreground hover:bg-muted rounded-md transition-colors focus-visible:ring-2 focus-visible:ring-primary"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <nav className="flex-1 overflow-y-auto py-4 flex flex-col gap-1 px-3">
                {isLandingPage ? (
                  <>
                    <NavLink to="/how-it-works" className={({isActive}) => `flex items-center px-4 py-3 rounded-lg text-sm transition-all ${isActive ? "bg-primary/10 text-primary font-bold border-l-4 border-primary" : "text-muted-foreground hover:bg-muted/50 hover:-translate-y-px hover:shadow-sm border-l-4 border-transparent"}`}>How it Works</NavLink>
                    <NavLink to="/dashboard" className={({isActive}) => `flex items-center px-4 py-3 rounded-lg text-sm transition-all ${isActive ? "bg-primary/10 text-primary font-bold border-l-4 border-primary" : "text-muted-foreground hover:bg-muted/50 hover:-translate-y-px hover:shadow-sm border-l-4 border-transparent"}`}>Community Dashboard</NavLink>
                    <NavLink to="/about" className={({isActive}) => `flex items-center px-4 py-3 rounded-lg text-sm transition-all ${isActive ? "bg-primary/10 text-primary font-bold border-l-4 border-primary" : "text-muted-foreground hover:bg-muted/50 hover:-translate-y-px hover:shadow-sm border-l-4 border-transparent"}`}>About</NavLink>
                    <NavLink to="/workspace" className={({isActive}) => `flex items-center px-4 py-3 rounded-lg text-sm transition-all ${isActive ? "bg-primary/10 text-primary font-bold border-l-4 border-primary" : "text-muted-foreground hover:bg-muted/50 hover:-translate-y-px hover:shadow-sm border-l-4 border-transparent"}`}>Workspace</NavLink>
                  </>
                ) : (
                  navItems.map((item, idx) => {
                    if (item.type === 'heading') {
                      return <div key={idx} className="px-4 py-2 mt-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground pointer-events-none select-none">{item.label}</div>;
                    }
                    if (item.type === 'divider') {
                      return <div key={idx} className="h-px w-full bg-border my-4" />;
                    }
                    const Icon = item.icon;
                    return (
                      <NavLink key={idx} to={item.to!} className={({isActive}) => `flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all ${isActive ? "bg-primary/10 text-primary font-bold border-l-4 border-primary shadow-sm" : "text-muted-foreground hover:bg-muted hover:text-foreground hover:-translate-y-px hover:shadow-sm border-l-4 border-transparent"}`}>
                        {Icon && <Icon className="w-5 h-5" />}
                        {item.label}
                      </NavLink>
                    );
                  })
                )}
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <div className="flex flex-1 overflow-hidden relative">
        {/* Desktop Sidebar */}
        {!isLandingPage && (
          <motion.aside 
            initial={false}
            animate={{ width: isCollapsed ? 80 : 280 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="hidden md:flex flex-col border-r border-border bg-background/50 backdrop-blur-xl shrink-0 overflow-y-auto shadow-[1px_0_0_0_var(--border)] relative z-10"
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
                return (
                  <NavLink 
                    key={idx} 
                    to={item.to!} 
                    title={isCollapsed ? item.label : undefined}
                    className={({isActive}) => `flex items-center gap-3 py-3 rounded-xl text-sm transition-all duration-200 ${isActive ? "bg-primary/10 text-primary font-bold border-l-4 border-primary shadow-subtle" : "text-muted-foreground hover:bg-muted hover:text-foreground hover:-translate-y-px hover:shadow-sm border-l-4 border-transparent"} ${isCollapsed ? 'justify-center px-0' : 'px-4'}`}
                  >
                    {Icon && <Icon className="w-5 h-5 shrink-0" />}
                    <AnimatePresence>
                      {!isCollapsed && (
                        <motion.span 
                          initial={{ opacity: 0, width: 0 }}
                          animate={{ opacity: 1, width: 'auto' }}
                          exit={{ opacity: 0, width: 0 }}
                          className="truncate"
                        >
                          {item.label}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </NavLink>
                );
              })}
            </nav>
          </motion.aside>
        )}

        {/* Main Content Container */}
        <main className="flex-1 overflow-y-auto w-full scroll-smooth bg-background flex flex-col">
          <div className="flex-1">
            <Outlet />
          </div>
          
          {/* Footer inside main container for Application layout */}
          {!isLandingPage && (
            <footer className="w-full py-6 px-6 border-t border-border bg-background/50 backdrop-blur-sm flex flex-col md:flex-row items-center justify-between gap-4 mt-auto">
              <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
                <Link to="/about" className="hover:text-foreground transition-colors">About</Link>
                <Link to="/documentation" className="hover:text-foreground transition-colors">Documentation</Link>
                <Link to="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link>
                <Link to="/support" className="hover:text-foreground transition-colors">Support</Link>
                <a href="https://github.com/PManicharan/CivicFlow" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">GitHub</a>
              </div>
              <div className="text-sm text-muted-foreground flex items-center gap-4">
                <span>v1.0.0-rc</span>
                <span>&copy; {new Date().getFullYear()} CivicFlow</span>
              </div>
            </footer>
          )}
        </main>
      </div>
      
      {/* Landing Page Footer */}
      {isLandingPage && (
        <footer className="border-t border-border bg-muted/20 pt-16 pb-8">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
              <div className="col-span-1 md:col-span-2">
                <div className="flex items-center gap-2 font-semibold tracking-tight text-lg text-foreground mb-4">
                  <Map className="w-5 h-5 text-primary" />
                  CivicFlow.
                </div>
                <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">
                  Transforming community signals into structured, actionable intelligence through explainable AI models.
                </p>
              </div>
              
              <div>
                <h4 className="font-medium mb-4 text-foreground">Product</h4>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li><Link to="/how-it-works" className="hover:text-foreground transition-colors">How it Works</Link></li>
                  <li><Link to="/security" className="hover:text-foreground transition-colors">Security</Link></li>
                  <li><Link to="/documentation" className="hover:text-foreground transition-colors">Documentation</Link></li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium mb-4 text-foreground">Company</h4>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li><Link to="/about" className="hover:text-foreground transition-colors">About</Link></li>
                  <li><Link to="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link></li>
                  <li><Link to="/support" className="hover:text-foreground transition-colors">Support</Link></li>
                </ul>
              </div>
            </div>
            
              <div className="pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
                <p>Built by Pendem Manicharan.</p>
                <div className="flex items-center gap-4">
                  <a href="https://github.com/PManicharan/CivicFlow" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors text-xs font-medium">GITHUB</a>
                  <a href="https://twitter.com/civicflow" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors text-xs font-medium">TWITTER / X</a>
                </div>
              </div>
          </div>
        </footer>
      )}
    </div>
  );
}
