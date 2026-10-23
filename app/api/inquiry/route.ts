import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
export async function POST(req:Request){
 try {
  const b=await req.json();const name=String(b.name||'').trim(),email=String(b.email||'').trim(),message=String(b.message||'').trim();
  if(String(b.human_answer??'').trim()!=='7')return NextResponse.json({error:'Incorrect verification answer'},{status:400});
  if(!name||name.length>120||!email.includes('@')||email.length>254||!message||message.length>5000)return NextResponse.json({error:'Invalid fields'},{status:400});
  const clean=(v:unknown,max:number)=>typeof v==='string'?v.trim().slice(0,max):'';
  const source=clean(b.source,100)||'Unknown',medium=clean(b.medium,100),campaign=clean(b.campaign,150),referrer=clean(b.referrer,1000);
  const url=process.env.NEXT_PUBLIC_SUPABASE_URL,key=process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if(!url||!key)return NextResponse.json({error:'Service unavailable'},{status:503});
  const db=createClient(url,key,{auth:{persistSession:false}});
  const {error}=await db.from('inquiries').insert({name,email,message,source,medium,campaign,referrer});
  if(error)return NextResponse.json({error:'Unable to save enquiry'},{status:500});
  return NextResponse.json({ok:true});
 }catch{return NextResponse.json({error:'Invalid request'},{status:400});}
}
