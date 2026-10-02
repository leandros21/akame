import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = { title: 'Akamé | Luxury Beach Villa in Cyprus', description: 'A private luxury beach villa near Akamas, Cyprus, with private pool and jacuzzi.' };
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>}
