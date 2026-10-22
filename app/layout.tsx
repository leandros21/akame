import type { Metadata } from 'next';
import Script from 'next/script';
import { createClient } from '@supabase/supabase-js';
import './globals.css';
import { villaStructuredData } from './villa-structured-data';
export const dynamic = 'force-dynamic';
export async function generateMetadata(): Promise<Metadata> {
 const fallback={title:'Akamé | Luxury Beach Villa in Cyprus',description:'A private luxury beach villa near Akamas, Cyprus, with private pool and jacuzzi.'};
 const url=process.env.NEXT_PUBLIC_SUPABASE_URL; const key=process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
 if(!url||!key)return fallback;
 try { const db=createClient(url,key,{auth:{persistSession:false}});const {data}=await db.from('site_content').select('key,value').in('key',['seo_title','seo_description']);const m=Object.fromEntries((data||[]).map(x=>[x.key,x.value]));return {title:m.seo_title?.trim()||fallback.title,description:m.seo_description?.trim()||fallback.description};}catch{return fallback;}
}
export default async function RootLayout({children}:{children:React.ReactNode}){
 let measurementId='G-F7QENB7XVH';
 const url=process.env.NEXT_PUBLIC_SUPABASE_URL;
 const key=process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
 if(url&&key){
  try{
   const db=createClient(url,key,{auth:{persistSession:false}});
   const {data}=await db.from('site_content').select('value').eq('key','analytics_tag').maybeSingle();
   if(data?.value){
    const match=data.value.match(/gtag\s*\(\s*['"]config['"]\s*,\s*['"](G-[A-Z0-9]+)['"]/i);
    measurementId=match?.[1]?.toUpperCase()||'';
   }
  }catch{}
 }
 return <html lang="en"><body>
  {children}
  <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(await villaStructuredData()).replace(/</g,'\\u003c')}}/>
  {measurementId&&<><Script src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`} strategy="afterInteractive"/>
  <Script id="akame-google-analytics" strategy="afterInteractive">{`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${measurementId}');`}</Script></>}
 </body></html>;
}
