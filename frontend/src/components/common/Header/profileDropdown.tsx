import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Link, useNavigate } from 'react-router-dom'
import AvatarCommonSection, { UserNameDetails } from '../Navbar/avatar';
import { handleLogout } from '@/lib/utils';

export function ProfileDropdown() {
    const navigate = useNavigate();
    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <Button variant='ghost' className='relative h-8 w-8 rounded-full cursor-pointer'>
                    <Avatar className='h-8 w-8 cursor-pointer border-black border-[1px] flex justify-center items-center'>
                        <AvatarCommonSection />
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className='w-56 bg-white dark:bg-sidebar border border-gray-200 dark:border-gray-700 shadow-lg' align='end' forceMount>
                <DropdownMenuLabel className='font-normal'>
                    <div className='flex flex-col space-y-1'>
                        <UserNameDetails />
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem asChild>
                        <Link to='/profile'>
                            Profile
                        </Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem asChild>
                        <Link to='/settings'>
                            Settings
                        </Link>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleLogout(navigate)}>
                    Log out
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
