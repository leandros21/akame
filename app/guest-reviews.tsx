'use client';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';

type Review = { name: string; rating: number; text: string; relativeTime: string };
type ReviewsData = { rating: number | null; total: number; reviews: Review[] };

export default function GuestReviews() {
  const [data, setData] = useState<ReviewsData | null>(null);
  const [index, setIndex] = useState(0);
  const viewport = useRef<HTMLDivElement>(null);
  const position = useRef(0);
  const normalize = (value: number, count: number) => ((value % count) + count) % count;

  useEffect(() => {
    const controller = new AbortController();
    fetch('/api/google-reviews', { signal: controller.signal })
      .then(response => response.ok ? response.json() : null)
      .then(value => { if (value && Array.isArray(value.reviews) && value.reviews.length) setData(value); })
      .catch(() => {});
    return () => controller.abort();
  }, []);

  const count = data?.reviews.length ?? 0;
  const stepSize = () => {
    const node = viewport.current;
    const card = node?.querySelector<HTMLElement>('.guestReviewCard');
    if (!node || !card) return 0;
    return card.getBoundingClientRect().width + (parseFloat(getComputedStyle(node).columnGap) || 0);
  };
  useLayoutEffect(() => {
    if (!count || !viewport.current) return;
    position.current = count;
    viewport.current.scrollLeft = count * stepSize();
    setIndex(0);
  }, [count]);
  useEffect(() => {
    const node = viewport.current;
    if (!node || count < 2) return;
    const onEnd = () => {
      const step = stepSize();
      if (!step) return;
      const current = Math.round(node.scrollLeft / step);
      position.current = current;
      setIndex(normalize(current, count));
      if (current < count || current >= count * 2) {
        const centered = count + normalize(current, count);
        node.style.scrollSnapType = 'none';
        node.style.scrollBehavior = 'auto';
        node.scrollLeft = centered * step;
        position.current = centered;
        node.getBoundingClientRect();
        node.style.scrollBehavior = '';
        node.style.scrollSnapType = '';
      }
    };
    node.addEventListener('scrollend', onEnd);
    return () => node.removeEventListener('scrollend', onEnd);
  }, [count]);
  if (!data) return null;
  const goTo = (target: number) => {
    const node = viewport.current;
    const step = stepSize();
    if (!node || !step) return;
    const current = Math.round(node.scrollLeft / step);
    const next = current + (target - normalize(current, count));
    position.current = next;
    node.scrollTo({ left: next * step, behavior: 'smooth' });
    setIndex(normalize(target, count));
  };
  const onScroll = () => {
    const node = viewport.current;
    const step = stepSize();
    if (!node || !step) return;
    const physical = Math.round(node.scrollLeft / step);
    position.current = physical;
    setIndex(normalize(physical, count));
  };
  return <section className="guestReviews section" aria-label="Guest reviews">
    <div className="guestReviewsHead">
      <div><p className="eyebrow dark">GUEST EXPERIENCES</p><h2>Words from <em>our guests.</em></h2></div>
      <div className="guestReviewsSummary"><span className="guestReviewsScore">{data.rating?.toFixed(1) || '—'}</span><div><div className="guestReviewsStars" aria-label="Google rating">{Array.from({ length: 5 }, (_, i) => <Star key={i} size={16} fill="currentColor" />)}</div><span>{data.total} reviews on Google</span></div></div>
    </div>
    <div className="guestReviewsCards" ref={viewport} onScroll={onScroll} role="region" aria-roledescription="carousel" aria-label="Google guest reviews" tabIndex={0}>
      {[...data.reviews, ...data.reviews, ...data.reviews].map((review, i) => <article className="guestReviewCard" key={i} aria-roledescription="slide" aria-label={`Review ${(i % count) + 1} of ${count}`}>
        <div className="guestReviewsStars" aria-label={review.rating + ' out of 5 stars'}>{Array.from({ length: Math.max(0, Math.min(5, review.rating)) }, (_, star) => <Star key={star} size={16} fill="currentColor" />)}</div>
        <p className="guestReviewText">“{review.text}”</p>
        <div className="guestReviewAuthor"><strong>{review.name}</strong><span>{review.relativeTime}</span></div>
      </article>)}
    </div>
    <div className="guestReviewsBottom">
      <span className="guestReviewsAttribution">Google Reviews</span>
      {count > 1 && <div className="guestReviewsControls">
        <div className="guestReviewsDots" aria-label="Choose review">{data.reviews.map((_, dot) => <button key={dot} type="button" className={dot === index ? 'guestReviewsDot active' : 'guestReviewsDot'} aria-label={'Show review ' + (dot + 1)} aria-current={dot === index ? 'true' : undefined} onClick={() => goTo(dot)} />)}</div>
        <button type="button" aria-label="Previous reviews" onClick={() => goTo(index - 1)}><ChevronLeft size={19} /></button>
        <span aria-live="polite">{index + 1} / {count}</span>
        <button type="button" aria-label="Next reviews" onClick={() => goTo(index + 1)}><ChevronRight size={19} /></button>
      </div>}
    </div>
  </section>;
}
