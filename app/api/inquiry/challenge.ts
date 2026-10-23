import { createHmac, timingSafeEqual } from 'node:crypto';
const secret=()=>process.env.HUMAN_VERIFICATION_SECRET||'';
export function signChallenge(answer:number,expires:number,nonce:string){
 if(!secret())throw new Error('Verification unavailable');
 const payload=`${answer}:${expires}:${nonce}`;
 const signature=createHmac('sha256',secret()).update(payload).digest('hex');
 return Buffer.from(payload).toString('base64url')+'.'+signature;
}
export function checkChallenge(token:unknown,answer:unknown){
 if(!secret()||typeof token!=='string'||token.length>500||!/^\\d{1,3}$/.test(String(answer??'')))return false;
 const [encoded,signature,...extra]=token.split('.');
 if(!encoded||!signature||extra.length||!/^[a-f0-9]{64}$/.test(signature))return false;
 try{
  const payload=Buffer.from(encoded,'base64url').toString('utf8');
  const [expected,expiry,nonce,...rest]=payload.split(':');
  if(rest.length||!/^\\d{1,3}$/.test(expected)||!/^\\d{13}$/.test(expiry)||!nonce||Date.now()>Number(expiry)||Number(expiry)-Date.now()>600000)return false;
  const actual=createHmac('sha256',secret()).update(payload).digest('hex');
  return timingSafeEqual(Buffer.from(signature,'hex'),Buffer.from(actual,'hex'))&&Number(answer)===Number(expected);
 }catch{return false;}
}
