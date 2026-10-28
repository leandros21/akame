'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { BedDouble, Image, Inbox, Search, Settings, Sparkles, Waves, LogOut, Save, Users } from 'lucide-react';
import './admin.css';
import {socialPlatforms,socialUrl} from '../social-platforms';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || '';
const supabase: SupabaseClient | null = url && key ? createClient(url, key) : null;
const fields = [
  { key:'hero_title', label:'Hero title' },
  { key:'hero_subtitle', label:'Hero subtitle' },
  { key:'villa_description', label:'Villa description' },
  { key:'seo_title', label:'SEO title' },
  { key:'seo_description', label:'SEO description' },
];
const contentGroups={"Header":["brand_name","header_subtitle","nav_villa","nav_gallery","nav_amenities","nav_location","nav_contact","booking_button"],"#top":["top_eyebrow","hero_title","top_title_italic","hero_subtitle","top_secondary_button","top_guests","top_bedrooms","top_bathrooms","top_pool"],"#villa":["villa_eyebrow","villa_title","villa_title_italic","villa_description","villa_paragraph_2","villa_link"],".featureGrid":["feature_eyebrow","feature_title","feature_title_italic","feature_description","feature_1","feature_2","feature_3","feature_4"],"#gallery":["gallery_eyebrow","gallery_title","gallery_title_italic","gallery_description","gallery_hover"],"#amenities":["amenities_eyebrow","amenities_title","amenities_title_italic","amenities"],"#location":["location_eyebrow","location_title","location_title_italic","location_description","location_link"],".quote":["quote_first","quote_italic","quote_attribution"],"#contact":["contact_eyebrow","contact_title","contact_title_italic","contact_description","contact_booking","contact_name_label","contact_name_placeholder","contact_email_label","contact_email_placeholder","contact_message_label","contact_message_placeholder","contact_submit"],"Footer":["footer_subtitle","footer_tagline","footer_credit","footer_back"]};
const contentDefaults:Record<string,string>={"brand_name":"AKAMÉ","header_subtitle":"BEACH VILLA · CYPRUS","hero_title":"Where the wild","top_title_italic":"meets the refined.","hero_subtitle":"A private beach escape shaped by Mediterranean light, quiet luxury and the untamed beauty of Akamas.","villa_title":"A slower rhythm,","villa_title_italic":"by the sea.","gallery_title":"Inside ","gallery_title_italic":"Akamé.","amenities_title":"Comfort, ","amenities_title_italic":"considered.","location_title":"At the edge of","location_title_italic":"something wild.","contact_title":"Your escape","contact_title_italic":"starts here.","quote_first":"Some places are visited.","quote_italic":"Others are felt.","footer_tagline":"Private pool · Jacuzzi · Akamas coast","amenities":"Private pool\nRooftop jacuzzi\nHigh-speed Wi-Fi\nAir conditioning\nEquipped kitchen\nPrivate parking\n4 bedrooms\n4 bathrooms","top_eyebrow":"AKAMAS · CYPRUS","top_secondary_button":"Discover Akamé","top_guests":"Up to 8 guests","top_bedrooms":"4 bedrooms","top_bathrooms":"4 bathrooms","top_pool":"Private pool & jacuzzi","villa_eyebrow":"THE VILLA","villa_description":"Akamé is a contemporary private villa designed for effortless days between sea, pool and sky. Generous indoor-outdoor spaces create a calm base for families and friends exploring the Akamas coast.","villa_paragraph_2":"Wake slowly, swim before breakfast, gather around the table at sunset, then retreat to the rooftop jacuzzi as the Mediterranean turns gold.","villa_link":"Explore the villa ↓","feature_eyebrow":"PRIVATE ESCAPE","feature_title":"Made for","feature_title_italic":"unhurried days.","feature_description":"Clean architecture, natural textures and generous outdoor living put the landscape at the centre of every stay.","feature_3":"Outdoor dining","feature_4":"Landscaped garden","gallery_eyebrow":"GALLERY","gallery_description":"Spaces designed to feel open, tactile and connected to the Mediterranean landscape.","gallery_hover":"View","amenities_eyebrow":"EVERYTHING YOU NEED","location_eyebrow":"THE AKAMAS COAST","location_description":"Set in Polis Chrysochous, Akamé places you close to Latchi and the dramatic landscapes of the Akamas Peninsula — one of Cyprus's most distinctive coastal escapes.","quote_attribution":"— AKAMÉ","contact_eyebrow":"CONTACT","contact_description":"Have a question before you book? Send us a note and we'll help with the details of your stay.","contact_name_label":"Name","contact_email_label":"Email","contact_message_label":"Message","footer_subtitle":"LUXURY BEACH VILLA · CYPRUS","footer_credit":"Designed by","footer_back":"Back to top ↑","nav_villa":"Villa","nav_gallery":"Gallery","nav_amenities":"Amenities","nav_location":"Location","nav_contact":"Contact","booking_button":"Book your stay","feature_1":"Private pool","feature_2":"Rooftop jacuzzi","contact_name_placeholder":"Your name","contact_email_placeholder":"you@email.com","contact_message_placeholder":"Tell us about your stay…","contact_submit":"Send inquiry","location_link":"Explore the area","contact_booking":"Check availability"};
const nav = [['Dashboard',Sparkles],['Villa content',BedDouble],['Gallery',Image],['Amenities',Waves],['Reviews',Sparkles],['Experiences',Waves],['Enquiries',Inbox],['Social Media',Users],['SEO',Search],['Analytics',Search],['Admins',Users],['Settings',Settings]] as const;
export default function AdminPage(){
 const [loading,setLoading]=useState(true);
 const [authorized,setAuthorized]=useState(false);
 const [email,setEmail]=useState('ioannouleandros@gmail.com');
 const [password,setPassword]=useState('');
 const [error,setError]=useState('');
 const [section,setSection]=useState('Dashboard');
 const [contentGroup,setContentGroup]=useState('#top');
 const [seoTab,setSeoTab]=useState<'meta'|'robots'|'llms'>('meta');
 const [values,setValues]=useState<Record<string,string>>({});
 const [saving,setSaving]=useState(false);
 const [dirtyKeys,setDirtyKeys]=useState<string[]>([]);
 const [images,setImages]=useState<{id:number,image_path:string,alt_text:string,sort_order:number,is_visible:boolean}[]>([]);
 const [enquiries,setEnquiries]=useState<{id:number,name:string,email:string,message:string,status:string,created_at:string,source:string|null,medium:string|null,campaign:string|null,referrer:string|null}[]>([]);
 const [enquirySourceFilter,setEnquirySourceFilter]=useState('All');
 const [enquiryStatusFilter,setEnquiryStatusFilter]=useState('All');
 const [enquirySearch,setEnquirySearch]=useState('');
 const [expandedEnquiry,setExpandedEnquiry]=useState<number|null>(null);
 const [altDrafts,setAltDrafts]=useState<Record<number,string>>({});
 const [savingAlt,setSavingAlt]=useState<number|null>(null);
 const [newImage,setNewImage]=useState('');
 const [siteSlots,setSiteSlots]=useState<Record<number,string>>({});
 const [pendingSlots,setPendingSlots]=useState<Record<number,string>>({});
 const [replacingSlot,setReplacingSlot]=useState<number|null>(null);
 const [status,setStatus]=useState('');
 const [role,setRole]=useState('admin');const [members,setMembers]=useState<{user_id:string,role:string}[]>([]);const [invites,setInvites]=useState<{email:string,role:string}[]>([]);const [inviteEmail,setInviteEmail]=useState('');const [uploading,setUploading]=useState(false);const [uploadingLogo,setUploadingLogo]=useState(false);const [extraGallerySlots,setExtraGallerySlots]=useState(2);
 useEffect(()=>{
  let active=true;
  async function check(){
   if(!supabase){setError('Supabase configuration missing');setLoading(false);return;}
   const {data:{user}}=await supabase.auth.getUser();
   let allowed=false;
   if(user){await supabase.rpc('accept_cms_admin_invite');const {data}=await supabase.from('cms_admins').select('user_id,role').eq('user_id',user.id).maybeSingle();allowed=!!data;if(data)setRole(data.role);}
   if(active){setAuthorized(allowed);setLoading(false);}
  }
  check();return()=>{active=false;};
 },[]);
 useEffect(()=>{
  if(!authorized||!supabase)return;
  supabase.from('site_content').select('key,value').then(({data})=>{if(data)setValues(Object.fromEntries(data.map(x=>[x.key,x.key==='amenities'?(()=>{try{return JSON.parse(x.value).join('\n')}catch{return x.value}})():x.value])));});
  supabase.from('gallery_images').select('*').order('sort_order').then(({data})=>{if(data)setImages(data);});
  supabase.from('site_image_slots').select('slot,image_path').then(({data})=>{if(data){setSiteSlots(Object.fromEntries(data.map(x=>[x.slot,x.image_path])));setExtraGallerySlots(Math.max(2,...data.filter(x=>x.slot>=9).map(x=>x.slot-8)));}});
  if(role==='super_admin'){supabase.from('cms_admins').select('user_id,role').then(({data})=>setMembers(data||[]));supabase.from('cms_admin_invites').select('email,role').then(({data})=>setInvites(data||[]));}
  supabase.from('inquiries').select('*').order('created_at',{ascending:false}).then(({data})=>{if(data)setEnquiries(data);});
 },[authorized,role]);
 async function login(e:React.FormEvent){
  e.preventDefault();setError('');setLoading(true);
  if(!supabase){setError('Supabase configuration missing');setLoading(false);return;}
  const {data,error:loginError}=await supabase.auth.signInWithPassword({email,password});
  if(loginError||!data.user){setError('Incorrect email or password');setLoading(false);return;}
  await supabase.rpc('accept_cms_admin_invite');const {data:admin}=await supabase.from('cms_admins').select('user_id,role').eq('user_id',data.user.id).maybeSingle();
  if(!admin){await supabase.auth.signOut();setError('This account does not have admin access');setLoading(false);return;}
  setRole(admin.role);setPassword('');setAuthorized(true);setLoading(false);
 }
 async function save(){
  if(!supabase||saving)return;
  const keys=section==='Analytics'?['analytics_tag']:section==='SEO'?(seoTab==='robots'?['robots_txt']:seoTab==='llms'?['llms_txt']:['seo_title','seo_description']):section==='Villa content'?contentGroups[contentGroup as keyof typeof contentGroups]:section==='Amenities'?['amenities']:section==='Reviews'?['reviews']:section==='Experiences'?['experiences']:['hero_title','hero_subtitle','villa_description'];
  const updates=keys.filter(key=>dirtyKeys.includes(key)&&typeof values[key]==='string'&&values[key].trim().length>0).map(key=>({key,value:key==='amenities'?JSON.stringify(values[key].split('\n').map(x=>x.trim()).filter(Boolean)):values[key]}));
  if(!updates.length){setStatus('No non-empty changes to save. Existing content was preserved.');return;}
  setSaving(true);setStatus('');
  const {error}=await supabase.from('site_content').upsert(updates,{onConflict:'key'});
  if(error){setStatus('Could not save: '+error.message);}
  else{setDirtyKeys(previous=>previous.filter(key=>!updates.some(item=>item.key===key)));setStatus('Saved '+updates.length+' field(s) to Supabase.');}
  setSaving(false);
 }
 async function saveSocial(){
  if(!supabase||saving)return;
  const invalid=socialPlatforms.find(p=>values[p.key]?.trim()&&!socialUrl(values[p.key],p.host));
  if(invalid){setStatus('Please enter a valid '+invalid.name+' URL or leave it blank.');return;}
  setSaving(true);setStatus('');
  const rows=socialPlatforms.map(p=>({key:p.key,value:values[p.key]?.trim()||''}));
  const {error}=await supabase.from('site_content').upsert(rows,{onConflict:'key'});
  setSaving(false);setStatus(error?'Could not save: '+error.message:'Social links saved successfully. Empty links are hidden from the website.');
 }
 async function logout(){await supabase?.auth.signOut();setAuthorized(false);setPassword('');}
 if(loading)return <div className="adminGate">Loading Akamé admin…</div>;
 if(!authorized)return <main className="adminGate"><form onSubmit={login} className="adminLogin"><span className="adminBrand">AKAMÉ</span><small>PRIVATE VILLA ADMIN</small><h1>Welcome back.</h1><p>Sign in to manage Akamé Villa.</p><label>Email<input type="email" required value={email} onChange={e=>setEmail(e.target.value)}/></label><label>Password<input type="password" required value={password} onChange={e=>setPassword(e.target.value)}/></label>{error&&<p role="alert" className="adminError">{error}</p>}<button type="submit">Sign in</button><Link href="/">← Back to website</Link></form></main>;
 const editable=['Villa content','SEO','Analytics','Amenities','Reviews','Experiences'].includes(section);
 const editFields=section==='Analytics'?[{key:'analytics_tag',label:'Google Analytics 4 (gtag.js) code'}]:section==='SEO'?(seoTab==='robots'?[{key:'robots_txt',label:'robots.txt content'}]:seoTab==='llms'?[{key:'llms_txt',label:'llms.txt content'}]:fields.slice(3)):section==='Villa content'?contentGroups[contentGroup as keyof typeof contentGroups].map(key=>({key,label:key.replaceAll('_',' ')})):[{key:section.toLowerCase(),label:section==='Amenities'?'Amenities (one per line)':'Content'}];

 const uploadPhoto=async(file:File)=>{
  if(!supabase)return;
  if(file.size>10485760){setStatus('Maximum file size: 10 MB');return;}
  setUploading(true);setStatus('Uploading…');
  const path=crypto.randomUUID()+'-'+file.name.replace(/[^a-zA-Z0-9._-]/g,'_');
  const {error}=await supabase.storage.from('akame-gallery').upload(path,file);
  if(error){setStatus(error.message);setUploading(false);return;}
  const {data}=supabase.storage.from('akame-gallery').getPublicUrl(path);
  const {error:saveError}=await supabase.from('gallery_images').insert({image_path:data.publicUrl,alt_text:file.name,sort_order:images.length,is_visible:true});
  if(saveError){setStatus(saveError.message);}else{const {data:all}=await supabase.from('gallery_images').select('*').order('sort_order');setImages(all||[]);setStatus('Photo uploaded to library. Choose a website slot below to publish it.');}
  setUploading(false);
 };
 const uploadVideo=async(file:File)=>{
  if(!supabase)return;
  if(!['video/mp4','video/webm'].includes(file.type)||file.size>41943040){setStatus('Videos must be MP4 or WebM, maximum 40 MB.');return;}
  setUploading(true);setStatus('Uploading video…');
  const ext=file.type==='video/mp4'?'mp4':'webm';
  const path='videos/'+crypto.randomUUID()+'.'+ext;
  const {error}=await supabase.storage.from('akame-videos').upload(path,file,{contentType:file.type,upsert:false});
  if(error){setStatus('Video upload failed: '+error.message);setUploading(false);return;}
  const {data}=supabase.storage.from('akame-videos').getPublicUrl(path);
  const {error:saveError}=await supabase.from('gallery_images').insert({image_path:data.publicUrl,alt_text:file.name,sort_order:images.length,is_visible:true});
  if(saveError)setStatus('Video uploaded but could not be saved: '+saveError.message);
  else{const {data:all}=await supabase.from('gallery_images').select('*').order('sort_order');setImages(all||[]);setStatus('Video uploaded. Assign it to a Gallery slot below to publish.');}
  setUploading(false);
 };
 const uploadLogo=async(file:File)=>{
  if(!supabase)return;
  if(!['image/png','image/jpeg','image/webp'].includes(file.type)||file.size>5242880){setStatus('Logo must be PNG, JPG or WebP, up to 5 MB.');return;}
  setUploadingLogo(true);setStatus('Uploading logo…');
  const ext=file.type==='image/png'?'png':file.type==='image/webp'?'webp':'jpg';
  const path='logos/'+crypto.randomUUID()+'.'+ext;
  const {error}=await supabase.storage.from('akame-gallery').upload(path,file,{contentType:file.type,upsert:false});
  if(error){setStatus('Logo upload failed: '+error.message);setUploadingLogo(false);return;}
  const {data}=supabase.storage.from('akame-gallery').getPublicUrl(path);
  const {error:saveError}=await supabase.from('site_content').upsert({key:'logo_image_url',value:data.publicUrl},{onConflict:'key'});
  if(saveError)setStatus('Logo uploaded but not published: '+saveError.message);
  else{setValues(v=>({...v,logo_image_url:data.publicUrl}));setStatus('Logo published. Reload the website to see it in header and footer.');}
  setUploadingLogo(false);
 };
 const replacePhoto=async(slot:number)=>{
  if(!supabase)return;
  const path=pendingSlots[slot];
  if(!path){setStatus('Choose a replacement photo first.');return;}
  setReplacingSlot(slot);setStatus('');
  const {error}=await supabase.from('site_image_slots').upsert({slot,image_path:path},{onConflict:'slot'});
  if(error)setStatus('Replace failed: '+error.message);
  else{setSiteSlots(v=>({...v,[slot]:path}));setPendingSlots(v=>({...v,[slot]:''}));setStatus('Photo replaced! Reload the public website to see the change.');}
  setReplacingSlot(null);
 };
 const restorePhoto=async(slot:number)=>{
  if(!supabase)return;
  setReplacingSlot(slot);setStatus('');
  const {error}=await supabase.from('site_image_slots').delete().eq('slot',slot);
  if(error)setStatus('Restore failed: '+error.message);
  else{setSiteSlots(v=>{const next={...v};delete next[slot];return next;});setPendingSlots(v=>({...v,[slot]:''}));setStatus('Original photo restored on the website.');}
  setReplacingSlot(null);
 };
 const saveAlt=async(id:number)=>{
  if(!supabase)return;
  const photo=images.find(img=>img.id===id);
  if(!photo)return;
  const alt=(altDrafts[id]??photo.alt_text??'').trim().slice(0,300);
  setSavingAlt(id);setStatus('');
  const {error}=await supabase.from('gallery_images').update({alt_text:alt}).eq('id',id);
  if(error)setStatus('Could not save alt text: '+error.message);
  else{setImages(items=>items.map(img=>img.id===id?{...img,alt_text:alt}:img));setStatus('Image alt text saved.');}
  setSavingAlt(null);
 };
 const removePhoto=async(id:number)=>{
  if(!supabase)return;const {error}=await supabase.from('gallery_images').delete().eq('id',id);
  if(error)setStatus(error.message);else setImages(v=>v.filter(x=>x.id!==id));
 };
 const inviteAdmin=async()=>{
  if(!supabase||!inviteEmail.includes('@'))return;
  const email=inviteEmail.trim().toLowerCase();
  const {error}=await supabase.from('cms_admin_invites').insert({email,role:'admin'});
  if(error)setStatus(error.message);else{setInvites(v=>[...v,{email,role:'admin'}]);setInviteEmail('');setStatus('Invitation recorded. The person must create and verify a Supabase account with this email.');}
 };
 const originalPhotos=['/images/WhatsApp Image 2026-10-02 at 22.56.07 (8).jpeg','/images/WhatsApp Image 2026-10-02 at 22.56.09 (6).jpeg','/images/WhatsApp Image 2026-10-02 at 22.56.06 (1).jpeg','/images/WhatsApp Image 2026-10-02 at 22.56.09 (2).jpeg','/images/WhatsApp Image 2026-10-02 at 22.56.08 (7).jpeg','/images/WhatsApp Image 2026-10-02 at 22.56.09 (1).jpeg','/images/WhatsApp Image 2026-10-02 at 22.56.07 (3).jpeg','/images/WhatsApp Image 2026-10-02 at 22.56.06 (5).jpeg','/images/WhatsApp Image 2026-10-02 at 22.56.08 (3).jpeg'];
 const slotLabels=['Homepage hero','Villa feature','Gallery photo 1','Gallery photo 2','Gallery photo 3','Gallery photo 4','Gallery photo 5','Gallery photo 6','Location image',...Array.from({length:extraGallerySlots},(_,i)=>'Gallery photo '+(i+7))];
 return (
 <main className="adminShell">
  <aside className="adminSide">
   <div className="adminLogo"><span>AKAMÉ</span><small>VILLA ADMIN</small></div>
   <nav>{nav.filter(([label])=>label!=='Admins'||role==='super_admin').map(([label,Icon])=><button key={label} className={section===label?'active':''} onClick={()=>{setSection(label);setStatus('');}}><Icon size={17}/><span>{label}</span></button>)}</nav>
   <div className="adminSideFoot"><a href="/" target="_blank" rel="noopener noreferrer" className="adminWebsiteLink"><span>↗</span> View Website</a><span>SECURE CMS</span><button onClick={logout}><LogOut size={15}/> Sign out</button></div>
  </aside>
  <section className="adminMain">
   <header className="adminTop"><div><p className="adminEyebrow">AKAMAS · CYPRUS</p><h1>{section==='Dashboard'?'Welcome to Akamé.':section}</h1><p>Manage the villa experience from one calm, private workspace.</p></div><Link href="/" className="adminView">View website ↗</Link></header>
   {section==='Dashboard' && <><div className="adminCards">
    <article><div className="adminIcon"><BedDouble size={20}/></div><p>VILLA CONTENT</p><strong>Akamé</strong><small>Hero, story & property details</small></article>
    <article><div className="adminIcon"><Image size={20}/></div><p>GALLERY</p><strong>{images.length} photos</strong><small>Photo library and replacements</small></article>
    <article><div className="adminIcon"><Inbox size={20}/></div><p>ENQUIRIES</p><strong>{enquiries.length} messages</strong><small>Guest enquiries</small></article>
    <article><div className="adminIcon"><Waves size={20}/></div><p>BOOKING</p><strong>External</strong><small>Official Akamé booking engine</small></article>
   </div><div className="adminGrid"><article className="adminPanel adminProgress"><div className="panelHead"><div><p className="adminEyebrow">CMS BUILD</p><h2>Content control</h2></div><span>Phase 2</span></div><div className="adminTasks"><p><i>01</i><span><b>Dashboard foundation</b><small>Luxury Akamé admin UI</small></span><em>READY</em></p><p><i>02</i><span><b>Supabase connection</b><small>Secure content and login</small></span><em>READY</em></p><p><i>03</i><span><b>Editable content and photos</b><small>Use the menu to manage content</small></span><em>READY</em></p></div></article><article className="adminPanel adminPreview"><p className="adminEyebrow">PROPERTY</p><h2>Akamé Luxury Beach Villa</h2><p>4 bedrooms · 4 bathrooms · up to 8 guests</p><div className="previewPhoto"/><div className="previewMeta"><span>AKAMAS BAY</span><span>PRIVATE POOL & JACUZZI</span></div></article></div></>}
   {section==='Gallery' && <article className="adminPanel adminEditor">
    <h2>Photo library</h2><p>Upload photos here. They will not appear on the website until you assign them to a position below.</p>
    <label>Upload photo (max 10 MB)<input type="file" accept="image/jpeg,image/png,image/webp,image/avif" disabled={uploading} onChange={async e=>{const file=e.target.files?.[0];if(file)await uploadPhoto(file);e.target.value='';}}/></label>
    <label>Upload video (MP4 or WebM, max 40 MB)<input type="file" accept="video/mp4,video/webm" disabled={uploading} onChange={async e=>{const file=e.target.files?.[0];if(file)await uploadVideo(file);e.target.value='';}}/></label><h3>Media library ({images.length})</h3>
    <div className="photoLibrary">{images.map(img=><div key={img.id} className="photoLibraryItem">{/\.(mp4|webm)(?:\?|$)/i.test(img.image_path)?<video src={img.image_path} preload="metadata" controls playsInline style={{width:'100%',maxHeight:230}}/>:<img src={img.image_path} alt={img.alt_text||'Villa photo'}/>}<label className="photoAltLabel">Image Alt Text<input type="text" maxLength={300} placeholder="Describe this photo for SEO" value={altDrafts[img.id]??img.alt_text??''} onChange={e=>setAltDrafts(v=>({...v,[img.id]:e.target.value}))}/></label><div className="photoLibraryActions"><button onClick={()=>void saveAlt(img.id)} disabled={savingAlt===img.id}>{savingAlt===img.id?'Saving…':'Save Alt Text'}</button><button onClick={()=>{if(window.confirm('Delete this photo from the library?'))void removePhoto(img.id);}}>Delete</button></div></div>)}</div>
    <div className="photoReplaceSlot"><h3>Website logo</h3><p>Upload a PNG with a transparent background to replace the logo in the header and footer. The image will not be added to the Gallery.</p><img src={values.logo_image_url||'/images/akame-logo.png'} alt="Current Akamé logo" style={{width:240,height:180,objectFit:'contain',background:'#172b22',padding:12}}/><label>Upload new logo (PNG, JPG or WebP, max 5 MB)<input type="file" accept="image/png,image/jpeg,image/webp" disabled={uploadingLogo} onChange={async e=>{const file=e.target.files?.[0];if(file)await uploadLogo(file);e.target.value='';}}/></label>{uploadingLogo&&<p role="status">Uploading logo…</p>}</div>
    <h3>Replace a website photo</h3><p>Select a photo from the library for each position.</p>
    {slotLabels.map((label,i)=><div key={i} className="photoReplaceSlot">
     <h4>{label}</h4>
     <div className="photoReplaceCompare">
      <div><small>Currently on website</small>{siteSlots[i]||originalPhotos[i]?{/\.(mp4|webm)(?:\?|$)/i.test(siteSlots[i]||originalPhotos[i])?<video src={siteSlots[i]||originalPhotos[i]} preload="metadata" controls playsInline style={{width:'100%'}}/>:<img src={siteSlots[i]||originalPhotos[i]} alt={'Current '+label}/>}:<div className="photoReplaceEmpty">Empty slot — add a photo</div>}</div>
      <div><small>Selected replacement</small>{pendingSlots[i]?{/\.(mp4|webm)(?:\?|$)/i.test(pendingSlots[i])?<video src={pendingSlots[i]} preload="metadata" controls playsInline style={{width:'100%'}}/>:<img src={pendingSlots[i]} alt={'New '+label}/>}:<div className="photoReplaceEmpty">Choose a photo below</div>}</div>
     </div>
     <label>Choose from photo library<select value={pendingSlots[i]||''} onChange={e=>setPendingSlots(v=>({...v,[i]:e.target.value}))}><option value="">Select a replacement photo…</option>{images.map(img=><option key={img.id} value={img.image_path}>{/\.(mp4|webm)(?:\?|$)/i.test(img.image_path)?'Video: ':''}{img.alt_text||img.image_path}</option>)}</select></label>
     <div className="photoReplaceActions"><button type="button" disabled={!pendingSlots[i]||replacingSlot!==null} onClick={()=>replacePhoto(i)}>{replacingSlot===i?'Replacing…':'Replace Photo'}</button>{siteSlots[i]&&<button type="button" disabled={replacingSlot!==null} onClick={()=>restorePhoto(i)}>{i>=9?'Remove Photo':'Restore Original'}</button>}</div>
    </div>)}
    <button type="button" disabled={extraGallerySlots>=92} onClick={()=>setExtraGallerySlots(v=>Math.min(v+1,92))}>+ Add another Gallery photo slot</button>
    <p role="status">{status}</p>
   </article>}
   {section==='Admins' && role==='super_admin' && <article className="adminPanel adminEditor">
    <h2>Administrators</h2><p>Only super admins can manage other administrators.</p><h3>Current members</h3>
    {members.map(m=><div key={m.user_id} className="adminMember"><span>{m.role} · {m.user_id}</span>{m.role==='admin'&&<button onClick={async()=>{const {error}=await supabase!.from('cms_admins').delete().eq('user_id',m.user_id);if(error)setStatus(error.message);else setMembers(v=>v.filter(x=>x.user_id!==m.user_id));}}>Remove</button>}</div>)}
    <h3>Invite admin</h3><label>Email<input type="email" value={inviteEmail} onChange={e=>setInviteEmail(e.target.value)}/></label><button onClick={inviteAdmin}>Add invitation</button>
    <h3>Pending invitations</h3>{invites.map(i=><div key={i.email} className="adminMember"><span>{i.email}</span><button onClick={async()=>{const {error}=await supabase!.from('cms_admin_invites').delete().eq('email',i.email);if(error)setStatus(error.message);else setInvites(v=>v.filter(x=>x.email!==i.email));}}>Cancel</button></div>)}
    <p role="status">{status}</p>
   </article>}
   {section==='Enquiries' && <article className="adminPanel adminEditor"><h2>Guest enquiries</h2>
    <div className="enquiryToolbar"><label>Source<select value={enquirySourceFilter} onChange={ev=>setEnquirySourceFilter(ev.target.value)}><option value="All">All sources</option>{Array.from(new Set(enquiries.map(e=>e.source||'Unknown'))).sort().map(src=><option key={src} value={src}>{src}</option>)}</select></label><label>Status<select value={enquiryStatusFilter} onChange={ev=>setEnquiryStatusFilter(ev.target.value)}><option value="All">All statuses</option><option value="new">New</option><option value="replied">Replied</option><option value="closed">Closed</option></select></label><label>Search<input placeholder="Search enquiries…" value={enquirySearch} onChange={ev=>setEnquirySearch(ev.target.value)}/></label></div>
    {enquiries.length===0?<p>No enquiries yet.</p>:<div className="enquiryList">{enquiries.filter(e=>(enquirySourceFilter==='All'||(e.source||'Unknown')===enquirySourceFilter)&&(enquiryStatusFilter==='All'||e.status===enquiryStatusFilter)&&(!enquirySearch||[e.name,e.email,e.message,e.source||'',e.campaign||''].join(' ').toLowerCase().includes(enquirySearch.toLowerCase()))).map(e=><div key={e.id} className="enquiryItem"><div className="enquiryRow"><button type="button" className="enquiryOpen" onClick={()=>setExpandedEnquiry(v=>v===e.id?null:e.id)} aria-expanded={expandedEnquiry===e.id}><span className="enquiryGuest"><b>{e.name}</b><small>{e.email}</small></span><span className="enquiryPreview">{e.message}</span><span className="enquirySource">{e.source||'Unknown'}</span><small className="enquiryDate">{new Date(e.created_at).toLocaleDateString()}</small><span aria-hidden="true">{expandedEnquiry===e.id?'⌃':'⌄'}</span></button><select aria-label={'Status for '+e.name} value={e.status} onChange={async ev=>{const status=ev.target.value;const {error}=await supabase!.from('inquiries').update({status}).eq('id',e.id);if(!error)setEnquiries(v=>v.map(x=>x.id===e.id?{...x,status}:x));}}><option value="new">New</option><option value="replied">Replied</option><option value="closed">Closed</option></select></div>{expandedEnquiry===e.id&&<div className="enquiryDetails"><p>{e.message}</p><small>{new Date(e.created_at).toLocaleString()} · Source: {e.source||'Unknown'}{e.medium?' · '+e.medium:''}{e.campaign?' · Campaign: '+e.campaign:''}</small>{e.referrer&&<small>Referrer: {e.referrer}</small>}</div>}</div>)}</div>}</article>}
   {editable && <article className="adminPanel adminEditor"><p className="adminEyebrow">SUPABASE CONTENT EDITOR</p><h2>{section}</h2>
    {section==='SEO' && <div className="seoSubnav">{([['meta','Meta Tags'],['robots','robots.txt'],['llms','llms.txt']] as const).map(([id,label])=><button key={id} type="button" className={seoTab===id?'selected':''} onClick={()=>{setSeoTab(id);setStatus('');}}>{label}</button>)}</div>}
    {section==='Analytics'?<p>Paste the Google tag code here. For security, only a valid GA4 Measurement ID (G-...) is used to load Google Analytics on the public website. This does not yet show analytics reports in the admin.</p>:<p>Save your changes securely to the CMS database.</p>}
    {section==='Villa content'&&<label>HTML section<select value={contentGroup} onChange={e=>setContentGroup(e.target.value)}>{Object.keys(contentGroups).map(id=><option key={id} value={id}>{id}</option>)}</select></label>}
    {editFields.map(f=><label key={f.key}>{f.label}<textarea spellCheck={!f.key.endsWith('_txt')} rows={f.key==='analytics_tag'||f.key.endsWith('_txt')?14:f.key.includes('description')?5:2} value={values[f.key]??contentDefaults[f.key]??''} onChange={e=>{setValues(v=>({...v,[f.key]:e.target.value}));setDirtyKeys(keys=>keys.includes(f.key)?keys:[...keys,f.key]);}}/></label>)}
    <button onClick={save} disabled={saving}><Save size={16}/>{saving?'Saving…':'Save changes'}</button><p role="status">{status}</p>
    {section==='SEO' && seoTab==='robots' && <a href="/robots.txt" target="_blank" rel="noreferrer">Open public robots.txt ↗</a>}
    {section==='SEO' && seoTab==='llms' && <a href="/llms.txt" target="_blank" rel="noreferrer">Open public llms.txt ↗</a>}
   </article>}
   {section==='Social Media' && <article className="adminPanel adminEditor socialEditor"><h2>Social Media Links</h2><p>Add your social media links to display in the website footer. Leave any field empty to hide its icon.</p><p className="adminNote">Only icons with valid links appear on the public website.</p><div className="socialFields">{socialPlatforms.map(p=><label key={p.key} className="socialField"><span className={'socialFieldIcon '+p.key}>{p.symbol}</span><span>{p.name}</span><input type="url" placeholder={'https://www.'+p.host+'/...'} value={values[p.key]||''} onChange={e=>setValues(v=>({...v,[p.key]:e.target.value}))}/></label>)}</div><button onClick={saveSocial} disabled={saving}><Save size={16}/>{saving?'Saving…':'Save Changes'}</button><p className="adminNote">Leave all fields empty to hide the entire Follow Us section.</p>{status&&<p role="status">{status}</p>}</article>}
   {section==='Settings' && <article className="adminPanel adminEditor"><h2>Settings</h2><p>Signed in with secure Supabase authentication.</p><button onClick={logout}>Sign out</button></article>}
   <footer className="adminFooter"><span>Akamé Villa CMS</span><span>Designed by MarketingCy</span></footer>
  </section>
 </main>
 );

}
