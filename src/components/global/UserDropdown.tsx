'use client';

import { useState } from 'react';
import { useUser, SignOutButton, UserProfile } from '@clerk/nextjs';
import { useUserStore } from '@/lib/store/useUserStore';
import { ChevronDown, LogOut, Settings, User, UserIcon } from 'lucide-react';
import Link from 'next/link';
import { Dialog, DialogContent } from '../ui/dialog';

export default function UserDropdown() {
    const { user } = useUser();
    const [open, setOpen] = useState(false);
    const reset = useUserStore((state) => state.reset);

    if (!user) return null;

    const handleSignOut = () => {
        reset(); // Clear Zustand store
        window.location.href = '/sign-in'; // Full reload after logout
    };


    return (
        <div className="relative inline-block text-left">
            <button
                onClick={() => setOpen(!open)}
                className="flex items-center gap-2 rounded-full"
            >
                <img
                    src={user.imageUrl}
                    alt="User"
                    className="w-8 h-8 rounded-full"
                />
            </button>

            {open && (
                <div className="absolute right-0 mt-2 w-48 bg-white border rounded-md shadow-lg z-10">
                    <div className="px-4 py-3">
                        <p className="text-sm font-medium">{user.fullName}</p>
                        <p className="text-sm text-gray-500 truncate">{user.primaryEmailAddress?.emailAddress}</p>



                    </div>
                    <div className="border-t" />
                    <SignOutButton signOutCallback={handleSignOut}>
                        <button
                            className="flex items-center gap-2 w-full px-4 py-2 text-sm hover:bg-gray-100"
                        >
                            <LogOut className="w-4 h-4" />
                            Sign out
                        </button>
                    </SignOutButton>
                </div>
            )}
        </div>
    );
}