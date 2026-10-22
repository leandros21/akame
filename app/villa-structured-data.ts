import { createClient } from '@supabase/supabase-js';

const baseUrl='https://akame-wine.vercel.app';
const defaultPhotos=[
 '/images/WhatsApp Image 2026-10-02 at 22.56.07 (8).jpeg',
 '/images/WhatsApp Image 2026-10-02 at 22.56.09 (6).jpeg',
 '/images/WhatsApp Image 2026-10-02 at 22.56.06 (1).jpeg',
 '/images/WhatsApp Image 2026-10-02 at 22.56.09 (2).jpeg',
 '/images/WhatsApp Image 2026-10-02 at 22.56.08 (7).jpeg',
 '/images/WhatsApp Image 2026-10-02 at 22.56.09 (1).jpeg',
 '/images/WhatsApp Image 2026-10-02 at 22.56.07 (3).jpeg',
 '/images/WhatsApp Image 2026-10-02 at 22.56.06 (5).jpeg',
 '/images/WhatsApp Image 2026-10-02 at 22.56.08 (3).jpeg'
];
const amenity=(name:string)=>({'@type':'LocationFeatureSpecification',name,value:true});
export async function villaStructuredData(){
 const content:Record<string,string>={};
 const slots:Record<number,string>={};
 const url=process.env.NEXT_PUBLIC_SUPABASE_URL;
 const key=process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
 if(url&&key){
  try{
   const db=createClient(url,key,{auth:{persistSession:false}});
   const [texts,photos]=await Promise.all([
    db.from('site_content').select('key,value').in('key',['villa_description','amenities']),
    db.from('site_image_slots').select('slot,image_path')
   ]);
   for(const row of texts.data||[])content[row.key]=row.value;
   for(const row of photos.data||[])slots[row.slot]=row.image_path;
  }catch{}
 }
 const images=defaultPhotos.map((photo,index)=>slots[index]||photo).map(photo=>new URL(photo,baseUrl).href);
 let amenities=['Private swimming pool','Rooftop jacuzzi','High-speed Wi-Fi','Air conditioning','Equipped kitchen','Private parking'];
 if(content.amenities){try{const parsed=JSON.parse(content.amenities);if(Array.isArray(parsed))amenities=parsed.filter((item:unknown):item is string=>typeof item==='string');}catch{}}
 return {
  '@context':'https://schema.org',
  '@type':'VacationRental',
  '@id':baseUrl+'/#vacation-rental',
  name:'Akamé Luxury Beach Villa',
  url:baseUrl+'/',
  description:content.villa_description||'Private luxury beach villa in the Akamas area of Cyprus, with four bedrooms, a private swimming pool and a rooftop jacuzzi.',
  address:{'@type':'PostalAddress',addressLocality:'Polis Chrysochous',addressRegion:'Paphos District',addressCountry:'CY'},
  numberOfBedrooms:4,
  numberOfBathroomsTotal:4,
  occupancy:{'@type':'QuantitativeValue',value:8},
  amenityFeature:amenities.map(amenity),
  image:images,
  potentialAction:{'@type':'ReserveAction',target:{'@type':'EntryPoint',urlTemplate:'https://akameluxurybeachvilla.reserve-online.net/'}}
 };
}
