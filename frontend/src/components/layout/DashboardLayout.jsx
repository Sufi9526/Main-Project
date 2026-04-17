import { useState, useEffect } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { FaPlane } from "react-icons/fa";
import {
  Home,
  Map,
  Bookmark,
  User,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Menu, // 🔥 ADD
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { cn } from "../../lib/utils";

const sidebarLinks = [
  { name: "Dashboard", path: "/dashboard/tripplan/home", icon: Home },
  { name: "Trip Planner", path: "/dashboard/tripplan", icon: Map },
  { name: "Saved Trips", path: "/dashboard/tripplan/saved-itineraries", icon: Bookmark },
  { name: "Profile", path: "/dashboard/tripplan/profile", icon: User },
];

export function DashboardLayout() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [user, setUser] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        setUser(JSON.parse(userStr));
      } catch (e) {
        console.error("Failed to parse user data", e);
      }
    }
  }, []);

  const isActive = (path) => {
    if (path === "/dashboard") {
      return location.pathname === "/dashboard";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen flex bg-background">
      
      {/* 🔥 MOBILE TOP BAR (NEW) */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b flex items-center justify-between px-4 z-50">
        <button onClick={() => setIsMobileOpen(true)}>
          <Menu className="w-6 h-6" />
        </button>
        <span className="font-semibold">Dashboard</span>
      </div>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-foreground/50 z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed lg:static inset-y-0 left-0 z-50 flex flex-col bg-sidebar text-sidebar-foreground transition-all duration-300",
          isCollapsed ? "w-18" : "w-64",
          isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Sidebar Header */}
        <div className={cn("flex items-center h-16 px-4 border-b border-sidebar-border", isCollapsed && "justify-center")}>
          <div className="w-10 h-10 rounded-xl gradient-ocean flex items-center justify-center shrink-0">
            <FaPlane className="w-5 h-5 text-black" />
          </div>
          {!isCollapsed && <span className="font-display text-lg font-semibold">Travel Planner</span>}
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 overflow-y-auto">
          <ul className="space-y-1 px-3">
            {sidebarLinks.map((link) => (
              <li key={link.path}>
                <Link
                  to={link.path}
                  onClick={() => setIsMobileOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-3 rounded-lg transition-colors",
                    isActive(link.path)
                      ? "bg-sidebar-accent text-sidebar-primary"
                      : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                  )}
                >
                  <link.icon className="w-5 h-5 shrink-0" />
                  {!isCollapsed && <span className="text-sm font-medium">{link.name}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Sidebar Footer */}
        <div className={cn("p-4 border-t border-sidebar-border flex flex-col gap-4", isCollapsed && "items-center")}>
          {user && (
            <div className={cn("flex items-center gap-3", isCollapsed && "justify-center")}>
              {user.photoURL ? (
                <img src={user.photoURL} alt="User Avatar" className="w-10 h-10 rounded-full object-cover shrink-0 border border-border" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0 border-2 border-blue-200 font-bold text-lg uppercase shadow-sm">
                  {(user.displayName || user.fullName || user.name || user.email || "U").charAt(0)}
                </div>
              )}
              {!isCollapsed && (
                <div className="flex flex-col overflow-hidden">
                  <span className="text-sm font-semibold text-sidebar-foreground truncate">
                    {user.displayName || user.fullName || user.name || "Traveler"}
                  </span>
                  <span className="text-xs text-sidebar-foreground/70 truncate">
                    {user.email || ""}
                  </span>
                </div>
              )}
            </div>
          )}

          <Button
            variant="ghost"
            className={cn("w-full text-sidebar-foreground/70 hover:text-red-600 hover:bg-red-50", isCollapsed ? "justify-center px-0" : "justify-start")}
            asChild
          >
            <Link to="/">
              <LogOut className={cn("w-5 h-5", !isCollapsed && "mr-3")} />
              {!isCollapsed && "Log Out"}
            </Link>
          </Button>
        </div>

        {/* Collapse Toggle (Desktop) */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden lg:flex absolute -right-3 top-20 w-6 h-6 rounded-full bg-sidebar border border-sidebar-border items-center justify-center text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        
        {/* 🔥 ADD PADDING FOR MOBILE TOP BAR */}
        <main className="flex-1 p-4 lg:p-8 overflow-y-auto mt-16 lg:mt-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
}