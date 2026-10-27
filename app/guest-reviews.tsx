'use client';
import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';

type Review = { name: string; rating: number; text: string; relativeTime: string };
type ReviewsData = { rating: number | null; total: number; reviews: Review[] };

export default function GuestReviews() {
  const [data, setData] = useState<ReviewsData | null>(null);
  const [index, setIndex] = useState(0);
  const viewport = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const controller = new AbortController();
    fetch('/api/google-reviews', { signal: controller.signal })
      .then(response => response.ok ? response.json() : null)
      .then(value => { if (value && Array.isArray(value.reviews) && value.reviews.length) setData(value); })
      .catch(() => {});
    return () => controller.abort();
  }, []);

  if (!data) return null;
  const count = data.reviews.length;
  const goTo = (target: number) => {
    const node = viewport.current;
    if (!node) return;
    const next = Math.max(0, Math.min(count - 1, target));
    const card = node.querySelector<HTMLElement>('.guestReviewCard');
    if (!card) return;
    const gap = parseFloat(getComputedStyle(node).columnGap) || 0;
    node.scrollTo({ left: next * (card.getBoundingClientRect().width + gap), behavior: 'smooth' });
    setIndex(next);
  };
  const onScroll = () => {
    const node = viewport.current;
    const card = node?.querySelector<HTMLElement>('.guestReviewCard');
    if (!node || !card) return;
    const gap = parseFloat(getComputedStyle(node).columnGap) || 0;
    const step = card.getBoundingClientRect().width + gap;
    if (step > 0) setIndex(Math.min(count - 1, Math.round(node.scrollLeft / step)));
  };
  return <section className="guestReviews section" aria-label="Guest reviews">
    <div className="guestReviewsHead">
      <div><p className="eyebrow dark">GUEST EXPERIENCES</p><h2>Words from <em>our guests.</em></h2></div>
      <div className="guestReviewsSummary"><span className="guestReviewsScore">{data.rating?.toFixed(1) || '—'}</span><div><div className="guestReviewsStars" aria-label="Google rating">{Array.from({ length: 5 }, (_, i) => <Star key={i} size={16} fill="currentColor" />)}</div><span>{data.total} reviews on Google</span></div></div>
    </div>
    <div className="guestReviewsCards" ref={viewport} onScroll={onScroll} role="region" aria-roledescription="carousel" aria-label="Google guest reviews" tabIndex={0}>
      {data.reviews.map((review, i) => <article className="guestReviewCard" key={i} aria-roledescription="slide" aria-label={`Review ${i + 1} of ${count}`}>
        <div className="guestReviewsStars" aria-label={review.rating + ' out of 5 stars'}>{Array.from({ length: Math.max(0, Math.min(5, review.rating)) }, (_, star) => <Star key={star} size={16} fill="currentColor" />)}</div>
        <p className="guestReviewText">“{review.text}”</p>
        <div className="guestReviewAuthor"><strong>{review.name}</strong><span>{review.relativeTime}</span></div>
      </article>)}
    </div>
    <div className="guestReviewsBottom">
      <span className="guestReviewsAttribution">Google Reviews</span>
      {count > 1 && <div className="guestReviewsControls">
        <div className="guestReviewsDots" aria-label="Choose review">{data.reviews.map((_, dot) => <button key={dot} type="button" className={dot === index ? 'guestReviewsDot active' : 'guestReviewsDot'} aria-label={'Show review ' + (dot + 1)} aria-current={dot === index ? 'true' : undefined} onClick={() => goTo(dot)} />)}</div>
        <button type="button" aria-label="Previous reviews" disabled={index === 0} onClick={() => goTo(index - 1)}><ChevronLeft size={19} /></button>
        <span aria-live="polite">{index + 1} / {count}</span>
        <button type="button" aria-label="Next reviews" disabled={index >= count - 1} onClick={() => goTo(index + 1)}><ChevronRight size={19} /></button>
      </div>}
    </div>
  </section>;
}
