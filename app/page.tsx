import { createClient } from '@supabase/supabase-js';
import Home from './home-client';

export const dynamic = 'force-dynamic';

export default async function Page() {
 const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
 const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
 let initialSlots: Record<number,string> = {};
 if (url && key) {
  try {
   const db = createClient(url, key, { auth: { persistSession: false } });
   const { data } = await db.from('site_image_slots').select('slot,image_path');
   if (data) initialSlots = Object.fromEntries(data.map(row => [row.slot, row.image_path]));
  } catch {
   // Client-side fetch can retry; do not show a stale fallback hero image.
  }
 }
 return <Home initialSlots={initialSlots} />;
}
