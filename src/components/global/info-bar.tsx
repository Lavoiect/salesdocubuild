'use client'
import { NotificationWithUser } from "@/lib/types";
import { UserButton } from "@clerk/nextjs";
import React, { useState } from "react";
import { twMerge } from "tailwind-merge";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "../ui/sheet";
import { Bell } from "lucide-react";
import { Role } from "@prisma/client";
import { Card } from "../ui/card";
import { Switch } from "../ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { ModeToggle } from "./mode-toggle";
import Image from "next/image";
import { useUserStore } from "@/lib/store/useUserStore";
import UserDropdown from "./UserDropdown";

type Props = {
    notifications: NotificationWithUser | []
    role?: Role
    className?: string
    agencyId?: string
}

const InfoBar = ({ notifications, agencyId, className, role }: Props) => {
    const [allNotifications, setAllNotifications] = useState(notifications)
    const [showAll, setShowAll] = useState(true)
    const { reset } = useUserStore();

    const handleClick = () => {
        if (!showAll) {
            setAllNotifications(notifications)
        } else {
            if (notifications?.length !== 0) {
                setAllNotifications(
                    notifications?.filter((item) => item.agencyId === agencyId) ?? []
                )
            }
        }
        setShowAll((prev) => !prev)
    }

    return (

        <div
            className={twMerge(
                'fixed z-[20] left-0 right-0 top-0 p-2 pl-2 bg-white backdrop-blur-md gap-4 items-center border-b-[1px]',
                className
            )}
        >
            <div className="flex items-center justify-between gap-2">
                <div>
                    <Image className="text-primary" alt="logo" src='/logo3.svg' width="190" height="60" />
                </div>
                <div className="flex gap-3 items-center">
                    <UserDropdown/>
                    <Sheet>
                        <SheetTrigger>
                            <div className="rounded-full w-9 h-9 bg-primary flex items-center justify-center text-white">
                                <Bell size={17} />
                            </div>
                        </SheetTrigger>
                        <SheetContent className="mt-4 mr-4 pr-4 overflow-scroll">
                            <SheetHeader className="text-left">
                                <SheetTitle>Notifications</SheetTitle>
                                <SheetDescription>

                                </SheetDescription>
                            </SheetHeader>
                            {allNotifications?.map((notification) => (
                                <div
                                    key={notification.id}
                                    className="flex flex-col gap-y-2 mb-2 overflow-x-scroll text-ellipsis"
                                >
                                    <div className="flex gap-2">

                                        <Avatar>
                                            <AvatarImage
                                                src={notification.User.avatarUrl}
                                                alt="Profile Picture"
                                            />
                                            <AvatarFallback className="bg-primary">
                                                {notification.User.name.slice(0, 2).toUpperCase()}
                                            </AvatarFallback>

                                        </Avatar>
                                        <div className="flex flex-col">
                                            <p>
                                                <span className="font-bold">
                                                    {notification.notification.split('|')[0]}
                                                </span>
                                                <span className="text-muted-foreground">
                                                    {notification.notification.split('|')[1]}
                                                </span>
                                                <span className="font-bold">
                                                    {notification.notification.split('|')[2]}
                                                </span>
                                            </p>
                                            <small className="text-xs text-muted-foreground">
                                                {new Date(notification.createdAt).toLocaleDateString()}
                                            </small>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {allNotifications?.length === 0 && (
                                <div className="flex items-center justify-center mb-4 text-muted-foreground">
                                    You Have no notifications.
                                </div>
                            )}
                        </SheetContent>
                        <ModeToggle />
                    </Sheet>
                </div>
            </div>

        </div>

    );
}

export default InfoBar;