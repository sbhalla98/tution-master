'use client';

import { useUser } from '@clerk/nextjs';

export default function Onboarding() {
  const { isLoaded, user } = useUser();

  if (!isLoaded) {
    return (
      <div>
        <p className="text-lg">Loading...</p>
      </div>
    );
  }

  if (!user)
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg">You must be signed in to access this page.</p>
      </div>
    );

  console.log(user);

  const updateUser = async () => {
    await user.update({
      firstName: 'John',
      lastName: 'Doe',
    });
  };
  return (
    <div>
      onboarding <button onClick={updateUser}>onclick</button>
    </div>
  );
}
