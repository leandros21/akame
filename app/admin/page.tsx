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
const nav = [['Dashboard',Sparkles],['Villa content',BedDouble],['Gallery',Image],['Amenities',Waves],['Enquiries',Inbox],['SEO',Search],['Settings',Settings]] as const;
export default function AdminPage(){
 const [loading,setLoading]=useState(true);
 const [authorized,setAuthorized]=useState(false);
 const [email,setEmail]=useState('ioannouleandros@gmail.com');
 const [password,setPassword]=useState('');
 const [error,setError]=useState('');
 const [section,setSection]=useState('Dashboard');
 const [values,setValues]=useState<Record<string,string>>({});
 const [saving,setSaving]=useState(false);
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
  supabase.from('site_content').select('key,value').then(({data})=>{if(data)setValues(Object.fromEntries(data.map(x=>[x.key,x.value])));});
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
  const keys=section==='SEO'?['seo_title','seo_description']:['hero_title','hero_subtitle','villa_description'];
  const {error}=await supabase.from('site_content').upsert(keys.map(key=>({key,value:values[key]||''})),{onConflict:'key'});
  setStatus(error?'Could not save: '+error.message:'Changes saved to Supabase');
  setSaving(false);
 }
 async function logout(){await supabase?.auth.signOut();setAuthorized(false);setPassword('');}
 if(loading)return <div className="adminGate">Loading Akamé admin…</div>;
 if(!authorized)return <main className="adminGate"><form onSubmit={login} className="adminLogin"><span className="adminBrand">AKAMÉ</span><small>PRIVATE VILLA ADMIN</small><h1>Welcome back.</h1><p>Sign in to manage Akamé Villa.</p><label>Email<input type="email" required value={email} onChange={e=>setEmail(e.target.value)}/></label><label>Password<input type="password" required value={password} onChange={e=>setPassword(e.target.value)}/></label>{error&&<p role="alert" className="adminError">{error}</p>}<button type="submit">Sign in</button><Link href="/">← Back to website</Link></form></main>;
 const editable=section==='Villa content'||section==='SEO';
 const editFields=section==='SEO'?fields.slice(3):fields.slice(0,3);
 return <main className="adminShell"><aside className="adminSide"><div className="adminLogo"><span>AKAMÉ</span><small>VILLA ADMIN</small></div><nav>{nav.map(([label,Icon])=><button key={label} className={section===label?'active':''} onClick={()=>{setSection(label);setStatus('');}}><Icon size={17}/><span>{label}</span></button>)}</nav><div className="adminSideFoot"><span>SECURE CMS</span><button onClick={logout}><LogOut size={15}/> Sign out</button></div></aside><section className="adminMain"><header className="adminTop"><div><p className="adminEyebrow">AKAMAS · CYPRUS</p><h1>{section==='Dashboard'?'Welcome to Akamé.':section}</h1><p>Manage the villa experience from one calm, private workspace.</p></div><Link href="/" className="adminView">View website ↗</Link></header>{section==='Dashboard'?<><div className="adminCards"><article><div className="adminIcon"><BedDouble size={20}/></div><p>VILLA CONTENT</p><strong>Akamé</strong><small>Hero, story & property details</small></article><article><div className="adminIcon"><Image size={20}/></div><p>GALLERY</p><strong>Villa photos</strong><small>Gallery management coming next</small></article><article><div className="adminIcon"><Inbox size={20}/></div><p>ENQUIRIES</p><strong>Messages</strong><small>Enquiry management coming next</small></article><article><div className="adminIcon"><Waves size={20}/></div><p>BOOKING</p><strong>External</strong><small>Official Akamé booking engine</small></article></div><div className="adminGrid"><article className="adminPanel adminProgress"><div className="panelHead"><div><p className="adminEyebrow">CMS BUILD</p><h2>Content control</h2></div><span>Phase 1</span></div><div className="adminTasks"><p><i>01</i><span><b>Dashboard foundation</b><small>Luxury Akamé admin UI</small></span><em>READY</em></p><p><i>02</i><span><b>Supabase connection</b><small>Database and secure login</small></span><em>READY</em></p><p><i>03</i><span><b>Editable villa content</b><small>Click Villa content or SEO to edit</small></span><em>READY</em></p></div></article><article className="adminPanel adminPreview"><p className="adminEyebrow">PROPERTY</p><h2>Akamé Luxury Beach Villa</h2><p>4 bedrooms · 4 bathrooms · up to 8 guests</p><div className="previewPhoto"/><div className="previewMeta"><span>AKAMAS BAY</span><span>PRIVATE POOL & JACUZZI</span></div></article></div></>:editable?<article className="adminPanel adminEditor"><p className="adminEyebrow">SUPABASE CONTENT EDITOR</p><h2>{section}</h2><p>Save your changes securely to the CMS database.</p>{editFields.map(f=><label key={f.key}>{f.label}<textarea rows={f.key.includes('description')?5:2} value={values[f.key]||''} onChange={e=>setValues(v=>({...v,[f.key]:e.target.value}))}/></label>)}<button onClick={save} disabled={saving}><Save size={16}/>{saving?'Saving…':'Save changes'}</button>{status&&<p role="status">{status}</p>}<p className="adminNote">The public website is not yet connected to these fields. Saved content will appear publicly after the next integration phase.</p></article>:<article className="adminPanel adminEditor"><h2>{section}</h2><p>This section is being connected to the CMS. No changes can be made here yet.</p></article>}<footer className="adminFooter"><span>Akamé Villa CMS</span><span>Designed by MarketingCy</span></footer></section></main>;
}
