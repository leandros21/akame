import { NextResponse } from 'next/server';
import { randomInt, randomUUID } from 'node:crypto';
import { signChallenge } from '../inquiry/challenge';
export const dynamic='force-dynamic';
export async function GET(){
 try{
  const a=randomInt(2,16),b=randomInt(2,13);
  const op=randomInt(0,3);
  const question=op===0?`What is ${a} + ${b}?`:op===1?`What is ${a+b} − ${b}?`:`What is ${a} × ${randomInt(2,6)}?`;
  const answer=op===0?a+b:op===1?a:Number(question.match(/× (\\d+)/)?.[1]||0)*a;
  const token=signChallenge(answer,Date.now()+5*60*1000,randomUUID());
  return NextResponse.json({question,token},{headers:{'Cache-Control':'no-store'}});
 }catch{return NextResponse.json({error:'Verification unavailable'},{status:503});}
}
