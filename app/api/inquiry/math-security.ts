import {createHmac,timingSafeEqual} from 'node:crypto';
const secret=()=>process.env.HUMAN_VERIFICATION_SECRET||'';
export function signChallenge(answer:number,expiry:number,nonce:string){
 if(!secret())throw Error('Missing verification configuration');
 const data=[answer,expiry,nonce].join(':');
 return Buffer.from(data).toString('base64url')+'.'+createHmac('sha256',secret()).update(data).digest('hex');
}
export function checkChallenge(token:unknown,response:unknown){
 if(!secret()||typeof token!=='string'||token.length>500)return false;
 const parts=token.split('.');
 if(parts.length!==2||parts[1].length!==64)return false;
 try{
  const data=Buffer.from(parts[0],'base64url').toString('utf8');
  const [answer,expiry,nonce]=data.split(':');
  if(!answer||!expiry||!nonce||!Number.isInteger(Number(answer))||!Number.isInteger(Number(expiry))||Date.now()>Number(expiry)||Number(expiry)-Date.now()>300000)return false;
  const expected=createHmac('sha256',secret()).update(data).digest('hex');
  return timingSafeEqual(Buffer.from(parts[1],'hex'),Buffer.from(expected,'hex'))&&Number(response)===Number(answer)&&String(response??'').trim()!=='';
 }catch{return false;}
}
