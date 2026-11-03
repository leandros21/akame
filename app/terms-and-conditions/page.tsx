import type { Metadata } from 'next';
import Link from 'next/link';
import '../legal.css';

export const metadata: Metadata = {
 title: 'Terms & Conditions | Akamé Luxury Beach Villa',
 description: 'Terms for using the Akamé Luxury Beach Villa website and sending enquiries.',
 alternates: { canonical: 'https://www.akamevilla.com.cy/terms-and-conditions' },
};

export default function TermsPage(){
 return <main className="legalPage">
 <header className="legalHeader"><Link href="/" className="legalBrand">AKAMÉ <span>Luxury Beach Villa</span></Link><Link href="/#contact">Contact us ↗</Link></header>
 <article className="legalContent">
 <p className="legalEyebrow">AKAMÉ · LEGAL INFORMATION</p><h1>Terms &amp; <em>Conditions</em></h1>
 <p className="legalLead">These terms govern use of the Akamé Luxury Beach Villa website. They are separate from the terms that apply to any accommodation booking.</p>
 <p className="legalDate">Last updated: 3 November 2026</p>
 <section><h2>1. About this website</h2><p>This website provides information about Akamé Luxury Beach Villa in the Polis Chrysochous / Akamas area of Cyprus, including facilities, photographs, enquiries and links to third-party services. References to “we”, “us” and “our” mean the operator of Akamé Luxury Beach Villa. For operator contact details, please use the <Link href="/#contact">contact form</Link>.</p></section>
 <section><h2>2. Information and availability</h2><p>We aim to keep descriptions, photographs and other information accurate, but details may change. Images are illustrative of the property and its surroundings. Website content is not a guarantee of availability, price, amenities or specific booking conditions. Please confirm all important details before making a reservation.</p></section>
 <section><h2>3. Enquiries are not bookings</h2><p>Sending an enquiry through this website does not create a reservation, guarantee availability or establish a rental agreement. A booking is confirmed only through the applicable booking process and according to the terms provided at the time of booking.</p></section>
 <section><h2>4. External booking platform</h2><p>The “Book your stay” and availability links lead to an external reservation service at <a href="https://akameluxurybeachvilla.reserve-online.net/" target="_blank" rel="noopener noreferrer">akameluxurybeachvilla.reserve-online.net</a>. Prices, deposits, payments, cancellation terms, check-in/check-out arrangements, house rules and any other reservation conditions should be reviewed on that platform before confirming a booking. Those conditions, and any separate rental agreement provided, govern the booking rather than these website-use terms.</p></section>
 <section><h2>5. Acceptable use</h2><p>You agree not to misuse this website, attempt unauthorised access, interfere with its operation or submit unlawful, abusive or misleading material. We may apply reasonable technical safeguards, including limits on repeated enquiry submissions, to protect the service.</p></section>
 <section><h2>6. Intellectual property</h2><p>Unless otherwise stated, website text, design, branding and original media are owned by or licensed for use by Akamé Luxury Beach Villa. You may browse the site for personal, non-commercial purposes, but may not reproduce or commercially exploit its contents without permission, except where permitted by law.</p></section>
 <section><h2>7. Third-party websites</h2><p>Links to maps, social media, booking platforms and other third-party services are provided for convenience. Their availability, content, terms and privacy practices are controlled by their respective operators.</p></section>
 <section><h2>8. Liability</h2><p>We take reasonable care in operating this website, but do not promise that it will always be uninterrupted or error-free. Nothing in these terms excludes or limits liability that cannot lawfully be excluded or affects mandatory consumer rights under applicable law.</p></section>
 <section><h2>9. Changes and applicable law</h2><p>We may update these website terms by publishing a revised version here. Subject to any mandatory consumer protections, these website-use terms are governed by the laws of the Republic of Cyprus.</p></section>
 <section><h2>10. Contact</h2><p>For questions about this website or these terms, please <Link href="/#contact">contact Akamé Luxury Beach Villa</Link>.</p></section>
 <aside className="legalNotice"><strong>Booking conditions:</strong> For a specific reservation, refer to the terms shown by the booking provider and any agreement issued for your stay.</aside>
 </article><footer className="legalFooter"><Link href="/">← Back to Akamé</Link><nav><Link href="/privacy-and-cookies-policy">Privacy &amp; Cookies Policy</Link><Link href="/refund-and-cancellation-policy">Refund &amp; Cancellation Policy</Link><Link href="/terms-and-conditions">Terms &amp; Conditions</Link></nav></footer>
 </main>;
}
