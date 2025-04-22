import { AvatarFallback, AvatarImage } from "@radix-ui/react-avatar"
import { useEffect, useState } from "react";

export default function AvatarCommonSection() {
    const [userInfo, setUserInfo] = useState<any>();
    useEffect(() => {
        const info = window?.localStorage?.getItem("user_info") ?? "";
        const parseInfo = JSON.parse(info);
        setUserInfo(parseInfo)
    }, [window?.localStorage])
    return (
        <>
            <AvatarImage src='/avatars/01.png' alt='@user' />
            <AvatarFallback>{userInfo?.firstname?.charAt(0).toUpperCase() + userInfo?.lastname?.charAt(0).toUpperCase()}</AvatarFallback>
        </>
    )
}

export function UserNameDetails() {
    const [userInfo, setUserInfo] = useState<any>();
    useEffect(() => {
        const info = window?.localStorage?.getItem("user_info") ?? "";
        const parseInfo = JSON.parse(info);
        setUserInfo(parseInfo)
    }, [window?.localStorage])
    return (
        <>
            <p className='text-sm font-medium leading-none'>{userInfo?.firstname?.charAt(0).toUpperCase() + userInfo?.firstname?.slice(1) + " " + userInfo?.lastname?.charAt(0).toUpperCase() + userInfo?.lastname.slice(1)}</p>
            <p className='text-xs leading-none text-muted-foreground'>
                {userInfo?.email ?? ""}
            </p>
        </>
    )
}