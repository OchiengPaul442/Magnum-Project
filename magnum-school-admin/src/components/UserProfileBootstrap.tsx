'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useUserProfileStore } from '@/store/useUserProfileStore';

const UserProfileBootstrap = () => {
  const { status, data: session } = useSession();
  const profileStatus = useUserProfileStore((state) => state.status);
  const fetchUserProfile = useUserProfileStore(
    (state) => state.fetchUserProfile,
  );

  useEffect(() => {
    if (
      status === 'authenticated' &&
      !session?.error &&
      profileStatus === 'idle'
    ) {
      void fetchUserProfile();
    }
  }, [status, profileStatus, fetchUserProfile, session?.error]);

  return null;
};

export default UserProfileBootstrap;
