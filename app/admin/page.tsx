import Link from "next/link";
import { BedDouble, Image, Inbox, MapPin, Search, Settings, Sparkles, Star, Waves } from "lucide-react";

const cards = [
  { label: "Villa content", value: "Akamé", note: "Hero, story & property details", icon: BedDouble },
  { label: "Gallery", value: "43 photos", note: "Upload, captions & ordering", icon: Image },
  { label: "Enquiries", value: "Ready", note: "Guest messages & statuses", icon: Inbox },
  { label: "Booking", value: "External", note: "Booking.com + WebHotelier", icon: Waves },
];

const nav = [
  ["Dashboard", Sparkles], ["Villa content", BedDouble], ["Gallery", Image],
  ["Amenities", Waves], ["Reviews", Star], ["Experiences", MapPin],
  ["Enquiries", Inbox], ["SEO", Search], ["Settings", Settings],
] as const;

export default function AdminPage() {
  return (
    <main className="adminShell">
      <aside className="adminSide">
        <div className="adminLogo"><span>AKAMÉ</span><small>VILLA ADMIN</small></div>
        <nav>{nav.map(([label, Icon], i) => <button className={i === 0 ? "active" : ""} key={label}><Icon size={17}/><span>{label}</span></button>)}</nav>
        <div className="adminSideFoot"><span>CMS preview</span><small>Supabase connection next</small></div>
      </aside>
      <section className="adminMain">
        <header className="adminTop">
          <div><p className="adminEyebrow">AKAMAS · CYPRUS</p><h1>Welcome to Akamé.</h1><p>Manage the villa experience from one calm, private workspace.</p></div>
          <Link href="/" className="adminView">View website ↗</Link>
        </header>
        <div className="adminCards">{cards.map(({label,value,note,icon:Icon}) => <article key={label}><div className="adminIcon"><Icon size={20}/></div><p>{label}</p><strong>{value}</strong><small>{note}</small></article>)}</div>
        <div className="adminGrid">
          <article className="adminPanel adminProgress"><div className="panelHead"><div><p className="adminEyebrow">CMS BUILD</p><h2>Content control</h2></div><span>Phase 1</span></div>
            <div className="progressRow"><span>Admin interface</span><b>Live preview</b></div><div className="progressBar"><i style={{width:"35%"}}/></div>
            <div className="adminTasks"><p><i>01</i><span><b>Dashboard foundation</b><small>Luxury Akamé admin UI</small></span><em>Ready</em></p><p><i>02</i><span><b>Supabase connection</b><small>Database, auth and storage</small></span><em>Next</em></p><p><i>03</i><span><b>Editable villa content</b><small>Public website powered by CMS</small></span><em>Queued</em></p></div>
          </article>
          <article className="adminPanel adminPreview"><p className="adminEyebrow">PROPERTY</p><h2>Akamé Luxury Beach Villa</h2><p>4 bedrooms · 4 bathrooms · up to 8 guests</p><div className="previewPhoto"/><div className="previewMeta"><span>Akamas Bay</span><span>Private pool & Jacuzzi</span></div></article>
        </div>
        <footer className="adminFooter"><span>Akamé Villa CMS</span><span>Designed by MarketingCy</span></footer>
      </section>
    </main>
  );
}
