'use client';

import CheckSession from '@/context/CheckSession';

import { ReactNode } from 'react';

export default function NextAuthProvider({
  children,
}: {
  children: ReactNode;
}) {

  return (
    <CheckSession>
      {children}
    </CheckSession>

  )
}