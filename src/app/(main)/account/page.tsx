// app/account/page.tsx
'use client';

import { UserProfile } from '@clerk/nextjs';

export default function AccountPage() {
  return (
    <div className="flex justify-center mt-10">
      <UserProfile path="/account" routing="path" />
    </div>
  );
}
