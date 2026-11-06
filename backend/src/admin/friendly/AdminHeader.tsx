import React from 'react'
import type { ServerProps } from 'payload'
import { AdminBar } from './AdminChrome'
import { displayName } from './model'
export default function AdminHeader({ user }: ServerProps) {
  return user ? <AdminBar name={displayName(user.email)} /> : null
}
