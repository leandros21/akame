'use client';
import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
type Review = { name: string; authorUrl: string | null; rating: number; text: string; relativeTime: string; url: string | null };
type ReviewsData = { rating: number | null; total: number; reviews: Review[]; googleUrl: string };
export default function GuestReviews() {
  const [data, setData] = useState<ReviewsData | null>(null);
  const [index, setIndex] = useState(0);
  const dragStart = useRef<{ x: number; y: number } | null>(null);
  const change = (direction: number, count: number) => setIndex(i => (i + direction + count) % count);
  const startDrag = (x: number, y: number) => { dragStart.current = { x, y }; };
  const endDrag = (x: number, y: number, count: number) => {
    const start = dragStart.current;
    dragStart.current = null;
    if (!start || count < 2) return;
    const dx = x - start.x;
    const dy = y - start.y;
    if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.2) change(dx < 0 ? 1 : -1, count);
  };
  useEffect(() => {
    const controller = new AbortController();
    fetch('/api/google-reviews', { signal: controller.signal }).then(r => r.ok ? r.json() : null).then(d => {
      if (d && Array.isArray(d.reviews) && d.reviews.length) setData(d);
    }).catch(() => {});
    return () => controller.abort();
  }, []);
  if (!data) return null;
  const count = data.reviews.length;
  const visible = [0, 1, 2].slice(0, Math.min(3, count)).map(offset => data.reviews[(index + offset) % count]);
  return <section className="guestReviews section" aria-label="Guest reviews">
    <div className="guestReviewsHead">
      <div><p className="eyebrow dark">GUEST EXPERIENCES</p><h2>Words from <em>our guests.</em></h2></div>
      <div className="guestReviewsSummary"><span className="guestReviewsScore">{data.rating?.toFixed(1) || '—'}</span><div><div className="guestReviewsStars" aria-label="Google rating"><Star size={16} fill="currentColor"/><Star size={16} fill="currentColor"/><Star size={16} fill="currentColor"/><Star size={16} fill="currentColor"/><Star size={16} fill="currentColor"/></div><span>{data.total} reviews on Google</span></div></div>
    </div>
    <div className="guestReviewsCards" aria-roledescription="carousel" onTouchStart={e => startDrag(e.touches[0].clientX, e.touches[0].clientY)} onTouchEnd={e => { if (e.changedTouches.length) endDrag(e.changedTouches[0].clientX, e.changedTouches[0].clientY, count); }} onMouseDown={e => { if (e.button === 0) startDrag(e.clientX, e.clientY); }} onMouseUp={e => endDrag(e.clientX, e.clientY, count)} onMouseLeave={() => { dragStart.current = null; }}>{visible.map((review, offset) => <article className="guestReviewCard" key={index + '-' + offset}>
      <div className="guestReviewsStars" aria-label={review.rating + ' out of 5 stars'}>{Array.from({length: Math.max(0, Math.min(5, review.rating))}, (_, i) => <Star key={i} size={16} fill="currentColor"/>)}</div>
      <p className="guestReviewText">“{review.text}”</p>
      <div className="guestReviewAuthor"><strong>{review.authorUrl ? <a href={review.authorUrl} target="_blank" rel="noopener noreferrer">{review.name}</a> : review.name}</strong><span>{review.relativeTime}</span></div>
    </article>)}</div>
    <div className="guestReviewsBottom">{count > 1 && <div className="guestReviewsControls"><div className="guestReviewsDots" aria-label="Choose review">{data.reviews.map((_, dot) => <button key={dot} type="button" className={dot === index ? "guestReviewsDot active" : "guestReviewsDot"} aria-label={"Show review " + (dot + 1)} aria-current={dot === index ? "true" : undefined} onClick={() => setIndex(dot)} />)}</div><button type="button" aria-label="Previous reviews" onClick={() => change(-1, count)}><ChevronLeft size={19}/></button><span aria-live="polite">{index + 1} / {count}</span><button type="button" aria-label="Next reviews" onClick={() => change(1, count)}><ChevronRight size={19}/></button></div>}</div>
  </section>;
}
