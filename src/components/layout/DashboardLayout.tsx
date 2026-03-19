import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { 
  Hexagon, 
  LayoutDashboard, 
  Map, 
  Briefcase, 
  Users, 
  Lightbulb, 
  Sparkles, 
  Settings,
  Menu,
  Search,
  Bell,
  LogOut
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { auth } from "../../firebase";
import { signOut } from "firebase/auth";
import { toast } from "sonner";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: Map, label: "Problem Explorer", href: "/dashboard/explorer" },
  { icon: Briefcase, label: "Venture Opportunities", href: "/dashboard/ventures" },
  { icon: Users, label: "Team Builder", href: "/dashboard/team" },
  { icon: Lightbulb, label: "Startup Idea Analyzer", href: "/dashboard/analyzer" },
  { icon: Sparkles, label: "Idea Generator", href: "/dashboard/generator" },
  { icon: Settings, label: "Settings", href: "/dashboard/settings" },
];

export function DashboardLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { userProfile } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      toast.success("Signed out successfully");
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
      toast.error("Failed to sign out");
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] text-black flex flex-col md:flex-row">
      {/* Mobile Header */}
      <header className="md:hidden flex h-16 items-center justify-between px-4 border-b border-black/5 bg-white sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 -ml-2 text-black/60 hover:text-black">
            <Menu className="h-5 w-5" />
          </button>
          <Hexagon className="h-5 w-5" />
          <span className="font-heading italic font-semibold text-lg">SolveLabs</span>
        </div>
        <div className="h-8 w-8 rounded-full bg-black/5 border border-black/10 overflow-hidden flex items-center justify-center">
          {userProfile?.photoURL ? (
            <img src={userProfile.photoURL} alt="Avatar" className="h-full w-full object-cover" />
          ) : (
            <span className="text-xs font-medium">{userProfile?.displayName?.charAt(0) || userProfile?.email?.charAt(0) || "U"}</span>
          )}
        </div>
      </header>

      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-black/5 transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:flex-shrink-0 flex flex-col",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="h-16 flex items-center gap-2 px-6 border-b border-black/5 hidden md:flex">
          <Hexagon className="h-6 w-6" />
          <span className="font-heading italic font-semibold text-xl tracking-tight">SolveLabs</span>
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
          <div className="px-2 mb-4 text-xs font-semibold text-black/40 uppercase tracking-wider">Menu</div>
          {navItems.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.href}
                to={item.href}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-colors",
                  isActive 
                    ? "bg-black/5 text-black" 
                    : "text-black/60 hover:bg-black/5 hover:text-black"
                )}
              >
                <item.icon className={cn("h-4 w-4", isActive ? "text-black" : "text-black/50")} />
                {item.label}
              </Link>
            );
          })}
        </div>

        <div className="p-4 border-t border-black/5">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="h-8 w-8 rounded-full bg-black/5 border border-black/10 overflow-hidden flex items-center justify-center">
              {userProfile?.photoURL ? (
                <img src={userProfile.photoURL} alt="Avatar" className="h-full w-full object-cover" />
              ) : (
                <span className="text-xs font-medium">{userProfile?.displayName?.charAt(0) || userProfile?.email?.charAt(0) || "U"}</span>
              )}
            </div>
            <div className="flex flex-col flex-1 min-w-0">
              <span className="text-sm font-medium leading-none truncate">{userProfile?.displayName || "User"}</span>
              <span className="text-xs text-black/50 mt-1 truncate">{userProfile?.email}</span>
            </div>
            <button onClick={handleSignOut} className="p-1.5 text-black/40 hover:text-black hover:bg-black/5 rounded-md transition-colors">
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Desktop Header */}
        <header className="hidden md:flex h-16 items-center justify-between px-8 border-b border-black/5 bg-white/50 backdrop-blur-sm sticky top-0 z-30">
          <div className="flex-1 max-w-xl">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-black/40" />
              <input 
                type="text" 
                placeholder="Search for a real-world problem..." 
                className="w-full h-10 pl-10 pr-4 rounded-full bg-black/5 border-transparent focus:bg-white focus:border-black/20 focus:ring-2 focus:ring-black/10 transition-all text-sm outline-none placeholder:text-black/40"
              />
            </div>
          </div>
          <div className="flex items-center gap-4 ml-4">
            <button className="p-2 text-black/60 hover:text-black rounded-full hover:bg-black/5 transition-colors relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-blue-500 border-2 border-white"></span>
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-6xl mx-auto">
            <Outlet />
          </div>
        </div>
      </main>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-30 md:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
