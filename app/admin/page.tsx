'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { BedDouble, Image, Inbox, Search, Settings, Sparkles, Waves, LogOut, Save, Users } from 'lucide-react';
import './admin.css';

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
const nav = [['Dashboard',Sparkles],['Villa content',BedDouble],['Gallery',Image],['Amenities',Waves],['Reviews',Sparkles],['Experiences',Waves],['Enquiries',Inbox],['SEO',Search],['Admins',Users],['Settings',Settings]] as const;
export default function AdminPage(){
 const [loading,setLoading]=useState(true);
 const [authorized,setAuthorized]=useState(false);
 const [email,setEmail]=useState('ioannouleandros@gmail.com');
 const [password,setPassword]=useState('');
 const [error,setError]=useState('');
 const [section,setSection]=useState('Dashboard');
 const [seoTab,setSeoTab]=useState<'meta'|'robots'|'llms'>('meta');
 const [values,setValues]=useState<Record<string,string>>({});
 const [saving,setSaving]=useState(false);
 const [images,setImages]=useState<{id:number,image_path:string,alt_text:string,sort_order:number,is_visible:boolean}[]>([]);
 const [enquiries,setEnquiries]=useState<{id:number,name:string,email:string,message:string,status:string,created_at:string}[]>([]);
 const [newImage,setNewImage]=useState('');
 const [siteSlots,setSiteSlots]=useState<Record<number,string>>({});
 const [status,setStatus]=useState('');
 const [role,setRole]=useState('admin');const [members,setMembers]=useState<{user_id:string,role:string}[]>([]);const [invites,setInvites]=useState<{email:string,role:string}[]>([]);const [inviteEmail,setInviteEmail]=useState('');const [uploading,setUploading]=useState(false);
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
  supabase.from('site_image_slots').select('slot,image_path').then(({data})=>{if(data)setSiteSlots(Object.fromEntries(data.map(x=>[x.slot,x.image_path])));});
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
  if(!supabase)return;
  setSaving(true);setStatus('');
  const keys=section==='SEO'?(seoTab==='robots'?['robots_txt']:seoTab==='llms'?['llms_txt']:['seo_title','seo_description']):section==='Amenities'?['amenities']:section==='Reviews'?['reviews']:section==='Experiences'?['experiences']:['hero_title','hero_subtitle','villa_description'];
  const {error}=await supabase.from('site_content').upsert(keys.map(key=>({key,value:key==='amenities'?JSON.stringify((values[key]||'').split('\n').map(x=>x.trim()).filter(Boolean)):values[key]||''})),{onConflict:'key'});
  setStatus(error?'Could not save: '+error.message:'Changes saved to Supabase');
  setSaving(false);
 }
 async function logout(){await supabase?.auth.signOut();setAuthorized(false);setPassword('');}
 if(loading)return <div className="adminGate">Loading Akamé admin…</div>;
 if(!authorized)return <main className="adminGate"><form onSubmit={login} className="adminLogin"><span className="adminBrand">AKAMÉ</span><small>PRIVATE VILLA ADMIN</small><h1>Welcome back.</h1><p>Sign in to manage Akamé Villa.</p><label>Email<input type="email" required value={email} onChange={e=>setEmail(e.target.value)}/></label><label>Password<input type="password" required value={password} onChange={e=>setPassword(e.target.value)}/></label>{error&&<p role="alert" className="adminError">{error}</p>}<button type="submit">Sign in</button><Link href="/">← Back to website</Link></form></main>;
 const editable=['Villa content','SEO','Amenities','Reviews','Experiences'].includes(section);
 const editFields=section==='SEO'?(seoTab==='robots'?[{key:'robots_txt',label:'robots.txt content'}]:seoTab==='llms'?[{key:'llms_txt',label:'llms.txt content'}]:fields.slice(3)):section==='Villa content'?fields.slice(0,3):[{key:section.toLowerCase(),label:section==='Amenities'?'Amenities (one per line)':'Content'}];

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
 const replacePhoto=async(slot:number,path:string)=>{
  if(!supabase||!path)return;
  const {error}=await supabase.from('site_image_slots').upsert({slot,image_path:path},{onConflict:'slot'});
  if(error)setStatus(error.message);else{setSiteSlots(v=>({...v,[slot]:path}));setStatus('Website photo replaced.');}
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
 const slotLabels=['Homepage hero','Villa feature','Gallery photo 1','Gallery photo 2','Gallery photo 3','Gallery photo 4','Gallery photo 5','Gallery photo 6','Location image'];
 return (
 <main className="adminShell">
  <aside className="adminSide">
   <div className="adminLogo"><span>AKAMÉ</span><small>VILLA ADMIN</small></div>
   <nav>{nav.filter(([label])=>label!=='Admins'||role==='super_admin').map(([label,Icon])=><button key={label} className={section===label?'active':''} onClick={()=>{setSection(label);setStatus('');}}><Icon size={17}/><span>{label}</span></button>)}</nav>
   <div className="adminSideFoot"><span>SECURE CMS</span><button onClick={logout}><LogOut size={15}/> Sign out</button></div>
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
    <h3>Existing photos ({images.length})</h3>
    <div className="photoLibrary">{images.map(img=><div key={img.id} className="photoLibraryItem"><img src={img.image_path} alt={img.alt_text||'Villa photo'}/><small>{img.alt_text||'Villa photo'}</small><button onClick={()=>removePhoto(img.id)}>Delete</button></div>)}</div>
    <h3>Replace a website photo</h3><p>Select a photo from the library for each position.</p>
    {slotLabels.map((label,i)=><label key={i}>{label}<select value={siteSlots[i]||''} onChange={e=>replacePhoto(i,e.target.value)}><option value="">Original website photo</option>{images.map(img=><option key={img.id} value={img.image_path}>{img.alt_text||img.image_path}</option>)}</select></label>)}
    <p role="status">{status}</p>
   </article>}
   {section==='Admins' && role==='super_admin' && <article className="adminPanel adminEditor">
    <h2>Administrators</h2><p>Only super admins can manage other administrators.</p><h3>Current members</h3>
    {members.map(m=><div key={m.user_id} className="adminMember"><span>{m.role} · {m.user_id}</span>{m.role==='admin'&&<button onClick={async()=>{const {error}=await supabase!.from('cms_admins').delete().eq('user_id',m.user_id);if(error)setStatus(error.message);else setMembers(v=>v.filter(x=>x.user_id!==m.user_id));}}>Remove</button>}</div>)}
    <h3>Invite admin</h3><label>Email<input type="email" value={inviteEmail} onChange={e=>setInviteEmail(e.target.value)}/></label><button onClick={inviteAdmin}>Add invitation</button>
    <h3>Pending invitations</h3>{invites.map(i=><div key={i.email} className="adminMember"><span>{i.email}</span><button onClick={async()=>{const {error}=await supabase!.from('cms_admin_invites').delete().eq('email',i.email);if(error)setStatus(error.message);else setInvites(v=>v.filter(x=>x.email!==i.email));}}>Cancel</button></div>)}
    <p role="status">{status}</p>
   </article>}
   {section==='Enquiries' && <article className="adminPanel adminEditor"><h2>Guest enquiries</h2>{enquiries.length===0?<p>No enquiries yet.</p>:enquiries.map(e=><div key={e.id} className="adminMember"><div><b>{e.name} · {e.email}</b><p>{e.message}</p><small>{new Date(e.created_at).toLocaleString()}</small></div><select value={e.status} onChange={async ev=>{const status=ev.target.value;const {error}=await supabase!.from('inquiries').update({status}).eq('id',e.id);if(!error)setEnquiries(v=>v.map(x=>x.id===e.id?{...x,status}:x));}}><option value="new">New</option><option value="replied">Replied</option><option value="closed">Closed</option></select></div>)}</article>}
   {editable && <article className="adminPanel adminEditor"><p className="adminEyebrow">SUPABASE CONTENT EDITOR</p><h2>{section}</h2>
    {section==='SEO' && <div className="seoSubnav">{([['meta','Meta Tags'],['robots','robots.txt'],['llms','llms.txt']] as const).map(([id,label])=><button key={id} type="button" className={seoTab===id?'selected':''} onClick={()=>{setSeoTab(id);setStatus('');}}>{label}</button>)}</div>}
    <p>Save your changes securely to the CMS database.</p>
    {editFields.map(f=><label key={f.key}>{f.label}<textarea spellCheck={!f.key.endsWith('_txt')} rows={f.key.endsWith('_txt')?14:f.key.includes('description')?5:2} value={values[f.key]||''} onChange={e=>setValues(v=>({...v,[f.key]:e.target.value}))}/></label>)}
    <button onClick={save} disabled={saving}><Save size={16}/>{saving?'Saving…':'Save changes'}</button><p role="status">{status}</p>
    {section==='SEO' && seoTab==='robots' && <a href="/robots.txt" target="_blank" rel="noreferrer">Open public robots.txt ↗</a>}
    {section==='SEO' && seoTab==='llms' && <a href="/llms.txt" target="_blank" rel="noreferrer">Open public llms.txt ↗</a>}
   </article>}
   {section==='Settings' && <article className="adminPanel adminEditor"><h2>Settings</h2><p>Signed in with secure Supabase authentication.</p><button onClick={logout}>Sign out</button></article>}
   <footer className="adminFooter"><span>Akamé Villa CMS</span><span>Designed by MarketingCy</span></footer>
  </section>
 </main>
 );

}
