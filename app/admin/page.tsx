'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { BedDouble, Image, Inbox, Search, Settings, Sparkles, Waves, LogOut, Save } from 'lucide-react';
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
const nav = [['Dashboard',Sparkles],['Villa content',BedDouble],['Gallery',Image],['Amenities',Waves],['Reviews',Sparkles],['Experiences',Waves],['Enquiries',Inbox],['SEO',Search],['Settings',Settings]] as const;
export default function AdminPage(){
 const [loading,setLoading]=useState(true);
 const [authorized,setAuthorized]=useState(false);
 const [email,setEmail]=useState('ioannouleandros@gmail.com');
 const [password,setPassword]=useState('');
 const [error,setError]=useState('');
 const [section,setSection]=useState('Dashboard');
 const [values,setValues]=useState<Record<string,string>>({});
 const [saving,setSaving]=useState(false);
 const [images,setImages]=useState<{id:number,image_path:string,alt_text:string,sort_order:number,is_visible:boolean}[]>([]);
 const [enquiries,setEnquiries]=useState<{id:number,name:string,email:string,message:string,status:string,created_at:string}[]>([]);
 const [newImage,setNewImage]=useState('');
 const [status,setStatus]=useState('');
 useEffect(()=>{
  let active=true;
  async function check(){
   if(!supabase){setError('Supabase configuration missing');setLoading(false);return;}
   const {data:{user}}=await supabase.auth.getUser();
   let allowed=false;
   if(user){const {data}=await supabase.from('cms_admins').select('user_id').eq('user_id',user.id).maybeSingle();allowed=!!data;}
   if(active){setAuthorized(allowed);setLoading(false);}
  }
  check();return()=>{active=false;};
 },[]);
 useEffect(()=>{
  if(!authorized||!supabase)return;
  supabase.from('site_content').select('key,value').then(({data})=>{if(data)setValues(Object.fromEntries(data.map(x=>[x.key,x.key==='amenities'?(()=>{try{return JSON.parse(x.value).join('\n')}catch{return x.value}})():x.value])));});
  supabase.from('gallery_images').select('*').order('sort_order').then(({data})=>{if(data)setImages(data);});
  supabase.from('inquiries').select('*').order('created_at',{ascending:false}).then(({data})=>{if(data)setEnquiries(data);});
 },[authorized]);
 async function login(e:React.FormEvent){
  e.preventDefault();setError('');setLoading(true);
  if(!supabase){setError('Supabase configuration missing');setLoading(false);return;}
  const {data,error:loginError}=await supabase.auth.signInWithPassword({email,password});
  if(loginError||!data.user){setError('Incorrect email or password');setLoading(false);return;}
  const {data:admin}=await supabase.from('cms_admins').select('user_id').eq('user_id',data.user.id).maybeSingle();
  if(!admin){await supabase.auth.signOut();setError('This account does not have admin access');setLoading(false);return;}
  setPassword('');setAuthorized(true);setLoading(false);
 }
 async function save(){
  if(!supabase)return;
  setSaving(true);setStatus('');
  const keys=section==='SEO'?['seo_title','seo_description']:section==='Amenities'?['amenities']:section==='Reviews'?['reviews']:section==='Experiences'?['experiences']:['hero_title','hero_subtitle','villa_description'];
  const {error}=await supabase.from('site_content').upsert(keys.map(key=>({key,value:key==='amenities'?JSON.stringify((values[key]||'').split('\n').map(x=>x.trim()).filter(Boolean)):values[key]||''})),{onConflict:'key'});
  setStatus(error?'Could not save: '+error.message:'Changes saved to Supabase');
  setSaving(false);
 }
 async function logout(){await supabase?.auth.signOut();setAuthorized(false);setPassword('');}
 if(loading)return <div className="adminGate">Loading Akamé admin…</div>;
 if(!authorized)return <main className="adminGate"><form onSubmit={login} className="adminLogin"><span className="adminBrand">AKAMÉ</span><small>PRIVATE VILLA ADMIN</small><h1>Welcome back.</h1><p>Sign in to manage Akamé Villa.</p><label>Email<input type="email" required value={email} onChange={e=>setEmail(e.target.value)}/></label><label>Password<input type="password" required value={password} onChange={e=>setPassword(e.target.value)}/></label>{error&&<p role="alert" className="adminError">{error}</p>}<button type="submit">Sign in</button><Link href="/">← Back to website</Link></form></main>;
 const editable=['Villa content','SEO','Amenities','Reviews','Experiences'].includes(section);
 const editFields=section==='SEO'?fields.slice(3):section==='Villa content'?fields.slice(0,3):[{key:section.toLowerCase(),label:section==='Amenities'?'Amenities (one per line)':'Content'}];
 return <main className="adminShell"><aside className="adminSide"><div className="adminLogo"><span>AKAMÉ</span><small>VILLA ADMIN</small></div><nav>{nav.map(([label,Icon])=><button key={label} className={section===label?'active':''} onClick={()=>{setSection(label);setStatus('');}}><Icon size={17}/><span>{label}</span></button>)}</nav><div className="adminSideFoot"><span>SECURE CMS</span><button onClick={logout}><LogOut size={15}/> Sign out</button></div></aside><section className="adminMain"><header className="adminTop"><div><p className="adminEyebrow">AKAMAS · CYPRUS</p><h1>{section==='Dashboard'?'Welcome to Akamé.':section}</h1><p>Manage the villa experience from one calm, private workspace.</p></div><Link href="/" className="adminView">View website ↗</Link></header>{section==='Dashboard'?<><div className="adminCards"><article><div className="adminIcon"><BedDouble size={20}/></div><p>VILLA CONTENT</p><strong>Akamé</strong><small>Hero, story & property details</small></article><article><div className="adminIcon"><Image size={20}/></div><p>GALLERY</p><strong>Villa photos</strong><small>Gallery management coming next</small></article><article><div className="adminIcon"><Inbox size={20}/></div><p>ENQUIRIES</p><strong>Messages</strong><small>Enquiry management coming next</small></article><article><div className="adminIcon"><Waves size={20}/></div><p>BOOKING</p><strong>External</strong><small>Official Akamé booking engine</small></article></div><div className="adminGrid"><article className="adminPanel adminProgress"><div className="panelHead"><div><p className="adminEyebrow">CMS BUILD</p><h2>Content control</h2></div><span>Phase 1</span></div><div className="adminTasks"><p><i>01</i><span><b>Dashboard foundation</b><small>Luxury Akamé admin UI</small></span><em>READY</em></p><p><i>02</i><span><b>Supabase connection</b><small>Database and secure login</small></span><em>READY</em></p><p><i>03</i><span><b>Editable villa content</b><small>Click Villa content or SEO to edit</small></span><em>READY</em></p></div></article><article className="adminPanel adminPreview"><p className="adminEyebrow">PROPERTY</p><h2>Akamé Luxury Beach Villa</h2><p>4 bedrooms · 4 bathrooms · up to 8 guests</p><div className="previewPhoto"/><div className="previewMeta"><span>AKAMAS BAY</span><span>PRIVATE POOL & JACUZZI</span></div></article></div></>:section==='Gallery'?<article className="adminPanel adminEditor"><h2>Gallery</h2><p>Add an image path (starting with /images/) or a public image URL.</p><label>Image path or URL<input value={newImage} onChange={e=>setNewImage(e.target.value)} placeholder="/images/photo.jpeg" style={{padding:14}}/></label><button onClick={async()=>{if(!supabase||!newImage.trim())return;const path=newImage.trim();if(!path.startsWith('/images/')&&!path.startsWith('https://')){setStatus('Use /images/ or https://');return;}const {error}=await supabase.from('gallery_images').insert({image_path:path,sort_order:images.length});if(error)setStatus(error.message);else{setNewImage('');const {data}=await supabase.from('gallery_images').select('*').order('sort_order');setImages(data||[]);setStatus('Image added');}}}>Add image</button>{images.map(img=><div key={img.id} style={{display:'flex',gap:12,alignItems:'center',borderTop:'1px solid #ddd',paddingTop:12}}><img src={img.image_path} alt={img.alt_text} width={110} height={75} style={{objectFit:'cover'}}/><span style={{flex:1,overflowWrap:'anywhere'}}>{img.image_path}</span><button onClick={async()=>{await supabase?.from('gallery_images').delete().eq('id',img.id);setImages(v=>v.filter(x=>x.id!==img.id));}}>Delete</button></div>)}<p>{status}</p></article>:section==='Enquiries'?<article className="adminPanel adminEditor"><h2>Guest enquiries</h2>{enquiries.length===0?<p>No enquiries yet.</p>:enquiries.map(e=><div key={e.id} style={{borderBottom:'1px solid #ddd',paddingBottom:15}}><strong>{e.name} — {e.email}</strong><p>{e.message}</p><small>{new Date(e.created_at).toLocaleString()}</small><label>Status<select value={e.status} onChange={async ev=>{const status=ev.target.value;const {error}=await supabase!.from('inquiries').update({status}).eq('id',e.id);if(!error)setEnquiries(v=>v.map(x=>x.id===e.id?{...x,status}:x));}}><option value="new">New</option><option value="replied">Replied</option><option value="closed">Closed</option></select></label></div>)}</article>:editable?<article className="adminPanel adminEditor"><p className="adminEyebrow">SUPABASE CONTENT EDITOR</p><h2>{section}</h2><p>Save your changes securely to the CMS database.</p>{editFields.map(f=><label key={f.key}>{f.label}<textarea rows={f.key.includes('description')?5:2} value={values[f.key]||''} onChange={e=>setValues(v=>({...v,[f.key]:e.target.value}))}/></label>)}<button onClick={save} disabled={saving}><Save size={16}/>{saving?'Saving…':'Save changes'}</button>{status&&<p role="status">{status}</p>}<p className="adminNote">SEO metadata and villa text update on the public website. Gallery and amenities also sync. Reviews and experiences are saved for future display.</p></article>:<article className="adminPanel adminEditor"><h2>{section}</h2><p>This section is being connected to the CMS. No changes can be made here yet.</p></article>}<footer className="adminFooter"><span>Akamé Villa CMS</span><span>Designed by MarketingCy</span></footer></section></main>;
}
