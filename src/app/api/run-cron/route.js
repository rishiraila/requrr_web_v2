// app/api/run-cron/route.js
import { NextResponse } from 'next/server';
// import { runDailyCronJob } from '@/cron/notifications';

import runDailyCronJob from '../../cron/notifications'

export async function GET() {
  await runDailyCronJob();
  return NextResponse.json({ status: 'Notifications checked and sent.' });
}
