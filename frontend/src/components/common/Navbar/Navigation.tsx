import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

import {
  LogOut,
  User,
  Users,
  DollarSign,
  LayoutDashboard,
} from "lucide-react";
import { useAtom } from "jotai";
import { loginInfo } from "@/store/store";
import { useSidebar } from "@/components/ui/sidebar";
import { log } from "console";

const Sidebar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const token = window.localStorage.getItem("token");
  const [userinformation] = useAtom<any>(loginInfo);
  const { state } = useSidebar()
  console.log(state, "state")
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token || !!userinformation.data.token);
  }, [userinformation.data.token, token]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user_info");
    setIsLoggedIn(false);
    toast.success("Logged out successfully");
    navigate("/");
    setLogoutDialogOpen(false);
  };

  const navItems = [
    { label: "Dashboard", href: "/dashboard", icon: <LayoutDashboard size={18} /> },
    { label: "Users", href: "/users", icon: <User size={18} /> },
    { label: "Projects", href: "/projects", icon: <DollarSign size={18} /> },
    { label: "Profile", href: "/profile", icon: <Users size={18} /> },
  ];

  const NavLinks = () => (
    <div className="space-y-1 pt-4">
      {navItems.map((item) => (
        <Button
          key={item.href}
          variant="ghost"
          className={cn(
            "w-full justify-start gap-2 cursor-pointer hover:text-blue-900",
            location.pathname === item.href && "bg-muted text-blue-500 ",
            state === "collapsed" && "flex justify-center items-center"
          )}
          onClick={() => navigate(item.href)}
        >
          {item.icon}
          {state === "expanded" && item.label}
        </Button>
      ))}
    </div>
  );

  return (
    <div className="bg-gray-100 dark:bg-sidebar">
      <div className={`"py-6 text-lg font-bold ${state === "expanded" ? "px-4" : "flex w-full justify-center items-center"} uppercase"`}>{state === "expanded" ? "ProjectB" : "PB"}</div>
      {isLoggedIn && (
        <NavLinks />
      )}
      <Dialog open={logoutDialogOpen} onOpenChange={setLogoutDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Logout</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-gray-600">Are you sure you want to log out?</p>
          <DialogFooter className="mt-4">
            <Button variant="ghost" onClick={() => setLogoutDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleLogout}>
              Logout
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Sidebar;
