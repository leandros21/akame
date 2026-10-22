import { createClient } from '@supabase/supabase-js';
export const dynamic='force-dynamic';
export async function GET(){
 const url=process.env.NEXT_PUBLIC_SUPABASE_URL;
 const key=process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
 let body="User-agent: *\nAllow: /\nDisallow: /admin\n";
 if(url&&key){try{const db=createClient(url,key,{auth:{persistSession:false}});const {data}=await db.from('site_content').select('value').eq('key',"robots_txt").maybeSingle();if(data?.value?.trim())body=data.value;}catch{}}
 return new Response(body.endsWith('\n')?body:body+'\n',{headers:{'Content-Type':'text/plain; charset=utf-8','Cache-Control':'public, max-age=0, s-maxage=60'}});
}
