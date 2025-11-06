import { useState, useEffect } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Users,
  Database,
  LayoutDashboard,
  Menu,
  X,
  Laptop,
  LogOut,
  User,
} from "lucide-react";
import mindnervesLogo from "@/assets/mindnerves-logo.png";
import { useAuth } from "@/hooks/useAuth";

const AppLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, loading, signOut } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const handleLogout = async () => {
    await signOut();
    navigate("/auth");
  };

  const navigation = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard },
    { name: "Employees", href: "/employees", icon: Users },
    { name: "Laptop IN/OUT", href: "/laptop-inout", icon: Laptop },
    { name: "Masters", href: "/masters", icon: Database },
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "w-64" : "w-0"
        } transition-all duration-300 bg-sidebar border-r border-sidebar-border overflow-hidden`}
      >
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-sidebar-border">
            <img
              src={mindnervesLogo}
              alt="MindNerves Technology"
              className="w-full h-auto"
            />
          </div>
          <ScrollArea className="flex-1 px-3 py-4">
            <nav className="space-y-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link key={item.name} to={item.href}>
                    <Button
                      variant={isActive(item.href) ? "secondary" : "ghost"}
                      className={`w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground ${
                        isActive(item.href)
                          ? "bg-sidebar-accent text-sidebar-accent-foreground"
                          : ""
                      }`}
                    >
                      <Icon className="mr-2 h-4 w-4" />
                      {item.name}
                    </Button>
                  </Link>
                );
              })}
            </nav>
          </ScrollArea>
          <div className="p-4 border-t border-sidebar-border">
            <p className="text-xs text-sidebar-foreground/60 text-center">
              Nourishing IT Better
            </p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 border-b bg-card flex items-center px-6 gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
          <h1 className="text-xl font-semibold text-foreground flex-1">
            Employee Management System
          </h1>
          <div className="flex items-center gap-2">
            <Link to="/profile">
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
              </Button>
            </Link>
            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
