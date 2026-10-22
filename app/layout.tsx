import type { Metadata } from 'next';
import { createClient } from '@supabase/supabase-js';
import './globals.css';
export const dynamic = 'force-dynamic';
export async function generateMetadata(): Promise<Metadata> {
 const fallback={title:'Akamé | Luxury Beach Villa in Cyprus',description:'A private luxury beach villa near Akamas, Cyprus, with private pool and jacuzzi.'};
 const url=process.env.NEXT_PUBLIC_SUPABASE_URL; const key=process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
 if(!url||!key)return fallback;
 try { const db=createClient(url,key,{auth:{persistSession:false}});const {data}=await db.from('site_content').select('key,value').in('key',['seo_title','seo_description']);const m=Object.fromEntries((data||[]).map(x=>[x.key,x.value]));return {title:m.seo_title?.trim()||fallback.title,description:m.seo_description?.trim()||fallback.description};}catch{return fallback;}
}
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>}
