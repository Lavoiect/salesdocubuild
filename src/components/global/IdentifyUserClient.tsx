'use client';

import { useEffect } from 'react';
import posthog from 'posthog-js';

export const IdentifyUserClient = ({ user }: { user: { id: string; name: string; email: string } }) => {
  useEffect(() => {
    if (user?.id) {
      posthog.identify(user.id, {
        name: user.name,
        email: user.email,
      });
    }
    
  }, [user]);

  return null;
};