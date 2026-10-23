export const socialPlatforms=[
 {key:'social_instagram',name:'Instagram',host:'instagram.com',symbol:'◎'},
 {key:'social_facebook',name:'Facebook',host:'facebook.com',symbol:'f'},
 {key:'social_youtube',name:'YouTube',host:'youtube.com',symbol:'▶'},
 {key:'social_tiktok',name:'TikTok',host:'tiktok.com',symbol:'♪'},
 {key:'social_linkedin',name:'LinkedIn',host:'linkedin.com',symbol:'in'},
 {key:'social_booking',name:'Booking.com',host:'booking.com',symbol:'B.'},
 {key:'social_tripadvisor',name:'TripAdvisor',host:'tripadvisor.',symbol:'◉'}
] as const;
export function socialUrl(value:string|undefined,_host:string){
 if(!value?.trim())return '';
 try{
  const input=value.trim();
  const url=new URL(input);
  if(url.protocol!=='https:'&&url.protocol!=='http:')return '';
  if(!url.hostname||url.username||url.password)return '';
  return url.href;
 }catch{return '';}
}
