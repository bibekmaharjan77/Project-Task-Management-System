import { Outlet } from "react-router-dom";
import HeaderIndex from "./components/Common/Header";
import { AppSidebar } from "./components/Common/SideBar/app-sidebar";
import { cn } from "./lib/utils";
import { SidebarProvider } from "./components/ui/sidebar";
import Cookies from 'js-cookie'

const Layout = () => {
  const defaultOpen = Cookies.get('sidebar:state') !== 'false'
  return (
    <div>
      <SidebarProvider defaultOpen={defaultOpen}>
        <AppSidebar />
        <div
          id='content'
          className={cn(
            'ml-auto w-full max-w-full',
            'peer-data-[state=collapsed]:w-[calc(100%-var(--sidebar-width-icon)-1rem)]',
            'peer-data-[state=expanded]:w-[calc(100%-var(--sidebar-width))]',
            'transition-[width] duration-200 ease-linear',
            'flex h-svh flex-col',
            'group-data-[scroll-locked=1]/body:h-full',
            'group-data-[scroll-locked=1]/body:has-[main.fixed-main]:h-svh'
          )}
        >
          <HeaderIndex />
          <Outlet />
        </div>

      </SidebarProvider>
    </div>
  );
};

export default Layout;
