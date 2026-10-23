import { NextResponse } from 'next/server';
import { randomInt, randomUUID } from 'node:crypto';
import { signChallenge } from '../inquiry/challenge';
export const dynamic = 'force-dynamic';
export async function GET() {
 try {
  const a=randomInt(2,16), b=randomInt(2,13), op=randomInt(0,3), factor=randomInt(2,6);
  const question=op===0?'What is '+a+' + '+b+'?':op===1?'What is '+(a+b)+' - '+b+'?':'What is '+a+' x '+factor+'?';
  const answer=op===0?a+b:op===1?a:a*factor;
  return NextResponse.json({question,token:signChallenge(answer,Date.now()+300000,randomUUID())},{headers:{'Cache-Control':'no-store'}});
 }catch{return NextResponse.json({error:'Verification unavailable'},{status:503});}
}
