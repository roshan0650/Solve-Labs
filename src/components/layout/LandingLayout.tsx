import { Link, Outlet } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Lightbulb } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";

export function LandingLayout() {
  const { user, userProfile } = useAuth();

  return (
    <div className="min-h-screen bg-white text-black selection:bg-black/10">
      <header className="fixed top-0 left-0 right-0 z-50 flex h-20 items-center justify-between px-6 md:px-12 bg-white/80 backdrop-blur-md border-b border-black/5">
        <div className="flex items-center gap-2">
          <Lightbulb className="h-6 w-6" />
          <span className="text-xl font-heading italic font-semibold tracking-tight">SolveLabs</span>
        </div>
        
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-black/60">
          <a href="/#features" className="hover:text-black transition-colors">Features</a>
          <a href="/#how-it-works" className="hover:text-black transition-colors">How It Works</a>
          <Link to="/dashboard/explorer" className="hover:text-black transition-colors">Explore</Link>
        </nav>

        <div className="flex items-center gap-4">
          {user ? (
            <Link to="/dashboard" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <span className="text-sm font-medium hidden sm:block">{userProfile?.displayName || "Dashboard"}</span>
              <div className="h-8 w-8 rounded-full bg-black/5 border border-black/10 overflow-hidden flex items-center justify-center">
                {userProfile?.photoURL ? (
                  <img src={userProfile.photoURL} alt="Avatar" className="h-full w-full object-cover" />
                ) : (
                  <span className="text-xs font-medium">{userProfile?.displayName?.charAt(0) || userProfile?.email?.charAt(0) || "U"}</span>
                )}
              </div>
            </Link>
          ) : (
            <>
              <Link to="/login" className="text-sm font-medium text-black/60 hover:text-black transition-colors hidden sm:block">
                Log in
              </Link>
              <Button asChild className="rounded-full px-6">
                <Link to="/signup">Get Started</Link>
              </Button>
            </>
          )}
        </div>
      </header>

      <main className="pt-20">
        <Outlet />
      </main>

      <footer className="border-t border-black/5 py-12 px-6 md:px-12 mt-24">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2 text-black/60">
            <Lightbulb className="h-5 w-5" />
            <span className="font-heading italic">SolveLabs &copy; {new Date().getFullYear()}</span>
          </div>
          <div className="flex gap-6 text-sm text-black/60">
            <a href="#" className="hover:text-black">Privacy</a>
            <a href="#" className="hover:text-black">Terms</a>
            <a href="#" className="hover:text-black">Twitter</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
