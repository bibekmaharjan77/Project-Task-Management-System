import { clsx, type ClassValue } from "clsx"
import { toast } from "react-toastify";
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const handleLogout = (navigate: any) => {
  localStorage.removeItem("token");
  localStorage.removeItem("user_info");
  toast.success("Logged out successfully");
  navigate("/")
};