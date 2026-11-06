import React from 'react'
import type { AdminViewServerProps } from 'payload'
import { redirect } from 'next/navigation'
import { Dashboard } from './Dashboard'
import { dashboardData } from './dashboard-data'
import { displayName } from './model'
import { readDashboard } from './server-data'
export default async function DashboardView(props: AdminViewServerProps) {
  const { req } = props.initPageResult
  if (!req.user) redirect('/admin/login')
  const source = await readDashboard({ payload: req.payload, user: req.user })
  const date = new Date()
  const month = Number(new Intl.DateTimeFormat('en', { timeZone: 'America/Sao_Paulo', month: 'numeric' }).format(date))
  const hour = Number(new Intl.DateTimeFormat('en', { timeZone: 'America/Sao_Paulo', hour: 'numeric', hourCycle: 'h23' }).format(date))
  const greeting = hour < 12 ? 'Bom dia' : hour < 18 ? 'Boa tarde' : 'Boa noite'
  return <Dashboard data={dashboardData(source.products, source.banners, source.media, source.mediaCount, source.certifications, month)} name={displayName(req.user.email)} greeting={greeting} />
}
