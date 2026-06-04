import { Link, useLocation } from "wouter";
import { UserButton } from "@clerk/react";
import { 
  LayoutDashboard, 
  Users, 
  Briefcase, 
  Truck, 
  FileText, 
  Settings,
  HelpCircle,
  Menu,
  X
} from "lucide-react";
import { useState } from "react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navLinks = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/leads", label: "Leads (CRM)", icon: Users },
    { href: "/admin/jobs", label: "Jobs", icon: Briefcase },
    { href: "/admin/workers", label: "Workers", icon: Truck },
    { href: "/admin/blog", label: "Blog", icon: FileText },
    { href: "/admin/faqs", label: "FAQs", icon: HelpCircle },
    { href: "/admin/pricing", label: "Pricing Rules", icon: Settings },
  ];

  const Sidebar = () => (
    <>
      <div className="p-6">
        <Link href="/admin" className="flex items-center gap-3 group mb-8">
          <div className="h-12 w-12 rounded-full overflow-hidden shadow-sm shrink-0">
            <img src="/logo.jpg" alt="OneWorld Van Lines" className="h-full w-full object-cover scale-125 group-hover:opacity-90 transition-opacity" />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="font-serif font-bold text-base tracking-tight text-primary">One World</span>
            <span className="font-serif font-bold text-base tracking-tight text-primary">Van Lines</span>
          </div>
        </Link>
        <nav className="space-y-1">
          {navLinks.map((link) => {
            const isActive = location === link.href || (location.startsWith(link.href + "/") && link.href !== "/admin");
            const Icon = link.icon;
            return (
              <Link 
                key={link.href} 
                href={link.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive 
                    ? "bg-primary text-primary-foreground" 
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
                onClick={() => setSidebarOpen(false)}
              >
                <Icon className="w-4 h-4" />
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="mt-auto p-6 border-t border-border">
        <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2">
          ← Back to Website
        </Link>
      </div>
    </>
  );

  return (
    <div className="min-h-[100dvh] flex bg-muted/30">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 flex-col fixed inset-y-0 left-0 bg-background border-r border-border z-20">
        <Sidebar />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}
      
      {/* Mobile Sidebar */}
      <aside className={`fixed inset-y-0 left-0 w-64 bg-background border-r border-border z-50 transform transition-transform duration-200 ease-in-out lg:hidden flex flex-col ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <Sidebar />
      </aside>

      {/* Main Content */}
      <div className="flex-1 lg:pl-64 flex flex-col min-h-[100dvh]">
        {/* Topbar */}
        <header className="h-16 bg-background border-b border-border flex items-center justify-between px-4 lg:px-8 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button 
              className="lg:hidden p-2 text-muted-foreground hover:text-foreground"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="font-serif font-semibold text-lg hidden sm:block">Admin Portal</h1>
          </div>
          <div className="flex items-center gap-4">
            <UserButton />
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
