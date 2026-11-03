import type { Metadata } from 'next';
import Link from 'next/link';
import '../legal.css';

export const metadata: Metadata = {
 title: 'Refund & Cancellation Policy | Akamé Luxury Beach Villa',
 description: 'Information about cancellations, refunds and reservation changes for Akamé Luxury Beach Villa in Cyprus.',
 alternates: { canonical: 'https://www.akamevilla.com.cy/refund-and-cancellation-policy' },
};

export default function RefundCancellationPage(){
 return <main className="legalPage">
 <header className="legalHeader"><Link href="/" className="legalBrand">AKAMÉ <span>Luxury Beach Villa</span></Link><Link href="/#contact">Contact us ↗</Link></header>
 <article className="legalContent">
 <p className="legalEyebrow">AKAMÉ · BOOKING INFORMATION</p>
 <h1>Refund &amp; <em>Cancellation Policy</em></h1>
 <p className="legalLead">Information about cancelling, changing or requesting a refund for a stay at Akamé Luxury Beach Villa.</p>
 <p className="legalDate">Last updated: 3 November 2026</p>
 <section><h2>1. Your booking terms apply</h2><p>Cancellation deadlines, refund eligibility, payment conditions and any applicable charges depend on the terms accepted when your reservation was made. Please refer to your booking confirmation and the conditions displayed by the booking provider. This page is general guidance and does not replace the terms of a confirmed reservation or any mandatory rights under applicable law.</p></section>
 <section><h2>2. Before booking</h2><p>Review the cancellation and payment conditions carefully before confirming your stay, including whether your selected rate is refundable, any applicable deadlines, deposit requirements and fees. Reservations can be made through our <a href="https://akameluxurybeachvilla.reserve-online.net/" target="_blank" rel="noopener noreferrer">external booking platform</a>, which presents the applicable booking conditions.</p></section>
 <section><h2>3. Cancelling a reservation</h2><p>If you need to cancel, follow the cancellation instructions in your booking confirmation or contact the booking provider through the channel used for your reservation. Whether a refund is available, and whether any cancellation charge applies, is determined by your confirmed booking terms and applicable law. Please keep your booking reference and any written cancellation confirmation.</p></section>
 <section><h2>4. Changes to dates or guest details</h2><p>Requests to change arrival or departure dates, guest details or other booking arrangements are subject to availability and the terms of the original reservation. A change may affect the total price or applicable cancellation conditions. A requested change is not confirmed until acknowledged through the relevant booking channel.</p></section>
 <section><h2>5. Refunds and payment processing</h2><p>Where a refund is due under your reservation terms or applicable law, the refund will normally be handled through the payment or booking channel used for the reservation. Processing times may vary depending on the provider and payment method. We do not state a fixed refund period here because this depends on the applicable booking and payment arrangements.</p></section>
 <section><h2>6. If your stay is affected by an unexpected event</h2><p>If an exceptional event prevents your stay from proceeding as planned, contact the booking provider or villa operator promptly. Any cancellation, rescheduling or refund will be considered under the booking terms and applicable law, including any mandatory consumer protections.</p></section>
 <section><h2>7. Website enquiries are not reservations</h2><p>Sending a message through our website does not create a confirmed reservation or a payment obligation. Enquiries therefore do not themselves require cancellation or qualify for a booking refund.</p></section>
 <section><h2>8. Questions or assistance</h2><p>For questions about a particular reservation, use the contact details in your booking confirmation. For general assistance, you can also <Link href="/#contact">send us an enquiry</Link>. Please avoid including payment-card details in your message.</p></section>
 <aside className="legalNotice"><strong>Important:</strong> This page does not promise a particular cancellation window, refund percentage or processing deadline. The conditions provided with your confirmed booking govern, subject to applicable law.</aside>
 </article>
 <footer className="legalFooter"><Link href="/">← Back to Akamé</Link><nav><Link href="/terms-and-conditions">Terms &amp; Conditions</Link><Link href="/privacy-and-cookies-policy">Privacy &amp; Cookies Policy</Link><Link href="/refund-and-cancellation-policy">Refund &amp; Cancellation Policy</Link></nav></footer>
 </main>;
}
