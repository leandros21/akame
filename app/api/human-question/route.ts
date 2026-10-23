import {NextResponse} from 'next/server';
import {randomInt,randomUUID} from 'node:crypto';
import {signChallenge} from '../inquiry/math-security';
export const dynamic='force-dynamic';
export async function GET(){
 try{
 const a=randomInt(2,16),b=randomInt(2,13),mode=randomInt(0,3),c=randomInt(2,6);
 const question=mode===0?'What is '+a+' + '+b+'?':mode===1?'What is '+(a+b)+' - '+b+'?':'What is '+a+' x '+c+'?';
 const answer=mode===0?a+b:mode===1?a:a*c;
 return NextResponse.json({question,token:signChallenge(answer,Date.now()+300000,randomUUID())},{headers:{'Cache-Control':'no-store'}});
 }catch{return NextResponse.json({error:'Unavailable'},{status:503});}
}
