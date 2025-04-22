import { SidebarProvider } from "@/components/ui/sidebar";
import { Header } from "./header";
import { ProfileDropdown } from "./profileDropdown";
import { Search } from "./search";
import { ThemeSwitch } from "./theme";

export default function HeaderIndex() {
    return (
        <Header>
            <div className='ml-auto flex items-center space-x-4'>
                {/* <Search /> */}
                <ThemeSwitch />
                <ProfileDropdown />
            </div>
        </Header>
    )
}