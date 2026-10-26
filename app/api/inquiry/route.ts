import { checkChallenge } from './math-security';
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
export async function POST(req:Request){
 try {
  const b=await req.json();const name=String(b.name||'').trim(),email=String(b.email||'').trim(),message=String(b.message||'').trim();
  if(!checkChallenge(b.verification_token,b.human_answer))return NextResponse.json({error:'Incorrect verification answer'},{status:400});
  if(!name||name.length>120||!email.includes('@')||email.length>254||!message||message.length>5000)return NextResponse.json({error:'Invalid fields'},{status:400});
  const clean=(v:unknown,max:number)=>typeof v==='string'?v.trim().slice(0,max):'';
  const source=clean(b.source,100)||'Unknown',medium=clean(b.medium,100),campaign=clean(b.campaign,150),referrer=clean(b.referrer,1000);
  const url=process.env.NEXT_PUBLIC_SUPABASE_URL,key=process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if(!url||!key)return NextResponse.json({error:'Service unavailable'},{status:503});
  const db=createClient(url,key,{auth:{persistSession:false}});
  const {error}=await db.from('inquiries').insert({name,email,message,source,medium,campaign,referrer});
  if(error)return NextResponse.json({error:'Unable to save enquiry'},{status:500});
  // Notification failures must not affect successful Supabase enquiries.
  const apiKey=process.env.RESEND_API_KEY, recipient=process.env.ENQUIRY_NOTIFICATION_TO;
  if(apiKey&&recipient){
   try{
    const safeReply=/^[^\s@<>\r\n]+@[^\s@<>\r\n]+\.[^\s@<>\r\n]+$/.test(email)?email:undefined;
    const controller=new AbortController();
    const timer=setTimeout(()=>controller.abort(),8000);
    try{
     const response=await fetch('https://api.resend.com/emails',{
      method:'POST',
      headers:{Authorization:'Bearer '+apiKey,'Content-Type':'application/json'},
      signal:controller.signal,
      body:JSON.stringify({
       from:'Akamé Villa <enquiries@mail.akamevilla.com.cy>',
       to:[recipient],
       cc:['fxtradingnewsletters@gmail.com'],
       ...(safeReply?{reply_to:safeReply}:{}),
       subject:'New Enquiry — Akamé Villa',
       text:['New contact form enquiry','','Name: '+name,'Email: '+email,'','Message:',message,'','Source: '+source,'Medium: '+medium,'Campaign: '+campaign,'Referrer: '+referrer].join('\n')
      })
     });
     if(!response.ok)console.error('Enquiry email notification failed',response.status);
    }finally{clearTimeout(timer);}
   }catch{console.error('Enquiry email notification failed');}
  }else{console.error('Enquiry email notification not configured');}
  return NextResponse.json({ok:true});
 }catch{return NextResponse.json({error:'Invalid request'},{status:400});}
}
