import { useState } from 'react';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';

import './App.css';
import LandingSection from './components/LandingSection';
import SimpleBar from './components/SimpleBar';
import BubbleChart from './components/BubbleChart';
import TileGrid from './components/Tiles';
import Scroll from './components/Scroll';
import ProblemsGrid from './components/Problems';

import pieImage from './assets/subTopicPie.png';
import ldaImage from './assets/ldaResults.png';
import gapImage from './assets/gap33.png';

import GeoMap from "./components/GeoMap";
import geoData from "./data/new_york_city_boroughs.json";

/* ─────────────────────────────────────────────
   Inline global styles (fonts + keyframes + utilities)
───────────────────────────────────────────── */
const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,700;0,9..144,900;1,9..144,400&family=DM+Sans:wght@400;500;600&display=swap');

  :root {
    --cream: #fffdf1;
    --green-deep: #1a4a2e;
    --green-mid: #2d7a4f;
    --green-soft: #4caf50;
    --green-pale: #e8f5e9;
    --green-tint: #f0faf0;
    --ink: #1a1a1a;
    --muted: #5a5a5a;
    --rule: #d4e8d4;
  }

  body {
    background-color: var(--cream);
    font-family: 'DM Sans', sans-serif;
    color: var(--ink);
  }

  .font-display { font-family: 'Fraunces', serif; }

  .section-rule {
    display: flex; align-items: center; gap: 1rem;
    color: var(--green-mid); opacity: 0.5;
  }
  .section-rule::before, .section-rule::after {
    content: ''; flex: 1; height: 1px; background: currentColor;
  }

  .tag-pill {
    display: inline-flex; align-items: center; gap: 0.35rem;
    background: var(--green-pale); color: var(--green-deep);
    border: 1px solid #b2dfb2; border-radius: 999px;
    padding: 0.2rem 0.8rem; font-size: 0.72rem;
    font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase;
  }

  .stat-card {
    background: #fff; border: 1.5px solid var(--rule);
    border-radius: 1.25rem; padding: 2rem 1.5rem;
    transition: border-color 0.3s, box-shadow 0.3s;
  }
  .stat-card:hover {
    border-color: var(--green-mid);
    box-shadow: 0 8px 32px rgba(45,122,79,0.10);
  }

  .section-label {
    font-size: 0.7rem; font-weight: 700;
    letter-spacing: 0.18em; text-transform: uppercase;
    color: var(--green-mid); margin-bottom: 0.5rem;
    display: block;
  }

  .diagonal-strip {
    background: linear-gradient(135deg, var(--green-pale) 0%, var(--cream) 100%);
    clip-path: polygon(0 6%, 100% 0%, 100% 94%, 0 100%);
    padding: 6rem 0;
  }

  .big-number {
    font-family: 'Fraunces', serif; font-weight: 900;
    font-size: clamp(3.5rem, 8vw, 6rem); line-height: 1;
    background: linear-gradient(135deg, #1a4a2e 0%, #2d7a4f 60%, #4caf50 100%);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
  }

  .divider-leaf { text-align: center; color: var(--green-mid); font-size: 1.4rem; opacity: 0.4; margin: 0.5rem 0; }

  .pull-quote {
    border-left: 4px solid var(--green-mid); padding-left: 1.5rem;
    font-family: 'Fraunces', serif; font-style: italic;
    font-size: 1.4rem; line-height: 1.6; color: var(--green-deep);
  }

  /* Responsive two-col grid */
  .two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 3rem; align-items: center; }
  @media (max-width: 768px) { .two-col { grid-template-columns: 1fr; gap: 2rem; } }
  @media (max-width: 768px) { .stat-grid { grid-template-columns: 1fr !important; } }

  /* ── Fix 1: ProblemsGrid card-back readability on dark green ── */
  /* Target the back face of every flip card inside the dark section */
  .card-back,
  [class*="card-back"],
  [class*="cardBack"],
  .flip-card-back {
    color: #ffffff !important;
  }
  .card-back *,
  [class*="card-back"] *,
  [class*="cardBack"] *,
  .flip-card-back * {
    color: #ffffff !important;
  }
  /* Stat / fact numbers on the back — make them pop in mint green */
  .card-back strong,
  [class*="card-back"] strong,
  [class*="cardBack"] strong,
  .flip-card-back strong {
    color: #a8d5b5 !important;
  }
  /* Source attribution — slightly dimmed white */
  .card-back small,
  .card-back [class*="source"],
  [class*="card-back"] small,
  [class*="cardBack"] small,
  .flip-card-back small {
    color: rgba(255,255,255,0.65) !important;
  }

  /* ── Fix 2: Hide / constrain bar chart on small screens ── */
  .bar-chart-mobile-wrap {
    width: 100%;
    overflow-x: auto;          /* allow horizontal scroll if SVG is wide */
    -webkit-overflow-scrolling: touch;
  }
  @media (max-width: 768px) {
    .bar-chart-mobile-wrap {
      /* Give the chart a fixed height so it doesn't blow out the layout */
      max-height: 260px;
      overflow-y: hidden;
    }
    /* If SimpleBar renders an <svg>, cap its width so it never overflows */
    .bar-chart-mobile-wrap svg {
      max-width: 100% !important;
      height: auto !important;
    }
  }
`;

/* ─── Tiny helpers ─── */
const SectionLabel = ({ children, light }) => (
  <span className="section-label" style={light ? { color: '#a8d5b5' } : {}}>{children}</span>
);
const Divider = () => <div className="divider-leaf">✦</div>;

/* ═══════════════════════════════════════════════
   APP
═══════════════════════════════════════════════ */
function App() {
  const [activeStep, setActiveStep] = useState(0);

  const submissions = [
    { year: "2022", reviews: 100 },
    { year: "2023", reviews: 120 },
    { year: "2024", reviews: 199 },
  ];

  const dxData = [
    { name: "Anxiety Disorder", value: 32588050 },
    { name: "Panic Disorder", value: 3751170 },
    { name: "Depression", value: 15802762 },
    { name: "Nicotine Dependence", value: 11885240 },
    { name: "Attention-deficit hyperactivity disorder", value: 6133783 },
    { name: "Major depressive disorder", value: 9976385 },
    { name: "Bipolar disorder", value: 3588700 },
    { name: "Generalized Anxiety Disorder", value: 23974840 },
    { name: "Schizophrenia", value: 1314426 },
    { name: "Autistic Disorder", value: 3219369 },
  ];

  const boroughData = {
    "Manhattan": 970263,
    "Brooklyn": 1604435,
    "Queens": 1861664,
    "Bronx": 1011556,
    "Staten Island": 305773,
  };

  return (
    <>
      <style>{globalStyles}</style>

      <div style={{ backgroundColor: 'var(--cream)', minHeight: '100vh' }}>

        {/* ── LANDING ── */}
        <LandingSection />

        {/* ── INTRO HEADLINE ── */}
        <section style={{ padding: '5rem 1.5rem' }}>
          <div style={{ maxWidth: '720px', margin: '0 auto', textAlign: 'center' }}>
            <div className="section-rule" style={{ marginBottom: '2rem' }}>
              <span className="tag-pill">🗽 Participatory Budgeting · NYC</span>
            </div>

            <h2 className="font-display" style={{
              fontSize: 'clamp(2.4rem, 5vw, 3.6rem)', fontWeight: 900,
              color: 'var(--green-deep)', lineHeight: 1.15, marginBottom: '1.5rem'
            }}>
              Your City. Your Money. Your Say.
            </h2>

            <p style={{ fontSize: '1.1rem', color: 'var(--muted)', lineHeight: 1.75, maxWidth: '560px', margin: '0 auto 1.25rem' }}>
              We pay our taxes. What do the people of NYC have to say about how the people's money should be spent?
            </p>
            <p style={{ fontSize: '1.05rem', color: 'var(--muted)', lineHeight: 1.75, maxWidth: '560px', margin: '0 auto 2rem' }}>
              From 2022 to 2024, NYC's Civic Engagement Commission surveyed thousands of New Yorkers to ask one defining question:
            </p>

            <div className="pull-quote" style={{ maxWidth: '520px', margin: '0 auto 2rem' }}>
              How should the <span style={{ color: 'var(--green-mid)' }}>city's budget</span> be spent?
            </div>

            <p style={{ fontSize: '1rem', color: 'var(--muted)' }}>
              After analyzing three years of responses, here is what we discovered.
            </p>
          </div>
        </section>

        {/* ── STAT STRIP ── */}
        <div className="diagonal-strip">
          <div style={{ maxWidth: '960px', margin: '0 auto', padding: '0 1.5rem' }}>
            <div className="stat-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
              {[
                { label: 'Total Submissions', num: '8,142', sub: 'Across three years of participatory budgeting' },
                { label: 'Mental Health Submissions', num: '419', sub: 'Total voices specifically for mental health' },
                { label: 'Growth in 3 Years', num: '2×', sub: 'Submissions doubled from 2022 → 2024' },
              ].map(({ label, num, sub }) => (
                <div key={label} className="stat-card" style={{ textAlign: 'center' }}>
                  <SectionLabel>{label}</SectionLabel>
                  <div className="big-number">{num}</div>
                  <p style={{ color: 'var(--muted)', fontSize: '0.9rem', marginTop: '0.5rem' }}>{sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── BAR CHART ── */}
        <section style={{ padding: '5rem 1.5rem' }}>
          <div style={{ maxWidth: '960px', margin: '0 auto' }}>
            <SectionLabel>Trend Over Time</SectionLabel>
            <h3 className="font-display" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)', fontWeight: 700, color: 'var(--green-deep)', marginBottom: '2.5rem', maxWidth: '520px' }}>
              A rapidly growing demand for mental health support
            </h3>
            <div className="two-col">
              <p style={{ color: 'var(--muted)', fontSize: '1.05rem', lineHeight: 1.8 }}>
                Upon reviewing <strong style={{ color: 'var(--green-deep)' }}>8,142</strong> submissions from 2022–2024,
                we see an increasing demand for mental health support — with the number of responses
                nearly <strong style={{ color: 'var(--green-mid)' }}>doubling</strong> in just{' '}
                <strong style={{ color: 'var(--green-mid)' }}>three</strong> years.
                New Yorkers are speaking up. Loudly.
              </p>
              <Scroll stepId="bar" onEnter={() => setActiveStep(1)}>
                <div className="bar-chart-mobile-wrap">
                  <SimpleBar data={submissions} trigger={activeStep === 1} />
                </div>
              </Scroll>
            </div>
          </div>
        </section>

        <Divider />

        {/* ── LDA WORD VISUAL ── */}
        <section style={{ padding: '4rem 1.5rem' }}>
          <div style={{ maxWidth: '960px', margin: '0 auto', textAlign: 'center' }}>
            <SectionLabel>Text Analysis</SectionLabel>
            <h3 className="font-display" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)', fontWeight: 700, color: 'var(--ink)', marginBottom: '1rem' }}>
              In their own words
            </h3>
            <p style={{ color: 'var(--muted)', maxWidth: '580px', margin: '0 auto 2.5rem', fontSize: '1.05rem', lineHeight: 1.7 }}>
              A visual snapshot of the collective mindset — words that appeared most frequently as New Yorkers
              shared their thoughts on mental health.
            </p>
            <div style={{ borderRadius: '1.5rem', overflow: 'hidden', border: '1.5px solid var(--rule)', boxShadow: '0 12px 48px rgba(45,122,79,0.08)' }}>
              <img src={ldaImage} alt="LDA word analysis" style={{ width: '100%', height: 'auto', display: 'block' }} />
            </div>
          </div>
        </section>

        {/* ── PIE CHART ── */}
        <section style={{ background: 'var(--green-tint)', padding: '5rem 1.5rem' }}>
          <div style={{ maxWidth: '960px', margin: '0 auto' }}>
            <Scroll stepId="pie" onEnter={() => setActiveStep(2)}>
              <div className="two-col">
                <div>
                  <SectionLabel>Topic Modeling · LDA</SectionLabel>
                  <h3 className="font-display" style={{ fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', fontWeight: 700, color: 'var(--green-deep)', marginBottom: '1.25rem' }}>
                    Mental Health Domains
                  </h3>
                  <p style={{ color: 'var(--muted)', lineHeight: 1.8, fontSize: '1.05rem' }}>
                    Using Latent Dirichlet Allocation (LDA) to cluster thousands of comments into coherent themes,
                    we revealed the top 10 priorities for New Yorkers. The largest slice of the pie{' '}
                    <strong style={{ color: 'var(--green-deep)' }}>(15.3%)</strong> belongs to youth mental health
                    and school healing programs, with community health access and economic disparities rounding out the top concerns.
                  </p>
                </div>
                <div style={{ borderRadius: '1.25rem', overflow: 'hidden', boxShadow: '0 8px 32px rgba(0,0,0,0.07)' }}>
                  <img src={pieImage} alt="Mental Health Sub-Topics Pie Chart" style={{ width: '100%', objectFit: 'contain', display: 'block' }} />
                </div>
              </div>
            </Scroll>
          </div>
        </section>

        {/* ── DARK INTERSTITIAL ── */}
        <section style={{ background: 'var(--green-deep)', padding: '7rem 1.5rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: '-80px', right: '-80px', width: '320px', height: '320px', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.07)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', bottom: '-60px', left: '-60px', width: '240px', height: '240px', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.05)', pointerEvents: 'none' }} />
          <div style={{ position: 'relative', zIndex: 1, maxWidth: '680px', margin: '0 auto' }}>
            <SectionLabel light>The Bigger Picture</SectionLabel>
            <h2 className="font-display" style={{ fontSize: 'clamp(2.2rem, 5vw, 3.5rem)', fontWeight: 900, color: '#fff', lineHeight: 1.2, margin: '1rem 0 1.25rem' }}>
              This is not a single narrative.
            </h2>
            <p className="font-display" style={{ fontSize: '1.3rem', color: '#a8d5b5', fontStyle: 'italic', marginBottom: '1.5rem' }}>
              It is the shared experience of a city.
            </p>
            <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '1.05rem', lineHeight: 1.75 }}>
              These priorities reflect the deep impact of{' '}
              <strong style={{ color: '#a8d5b5' }}>Social Determinants of Health</strong> —
              the very conditions that shape our communities and our futures.
            </p>
          </div>
        </section>

        {/* ── BUBBLE CHART ── */}
        <section style={{ padding: '5rem 1.5rem' }}>
          <div style={{ maxWidth: '960px', margin: '0 auto' }}>
            <div style={{ display: 'inline-block', background: 'var(--green-pale)', border: '1px solid #b2dfb2', borderRadius: '0.5rem', padding: '0.25rem 0.75rem', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--green-deep)', marginBottom: '1rem' }}>
              Data Snapshot · New York State
            </div>
            <h3 className="font-display" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)', fontWeight: 700, color: 'var(--ink)', marginBottom: '0.25rem' }}>
              Top Mental Health Diagnoses
            </h3>
            <p style={{ color: 'var(--muted)', marginBottom: '2.5rem' }}>January 2022 – December 2025</p>
            <Scroll stepId="bubble" onEnter={() => setActiveStep(3)}>
              <BubbleChart data={dxData} trigger={activeStep === 3} />
            </Scroll>
            <div style={{ marginTop: '3rem', textAlign: 'center', maxWidth: '640px', margin: '3rem auto 0' }}>
              <h4 className="font-display" style={{ fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', fontWeight: 700, color: 'var(--ink)', lineHeight: 1.3, marginBottom: '1rem' }}>
                Diagnoses rarely exist in isolation.{' '}
                <span style={{ color: 'var(--green-mid)' }}>Comorbidities are the norm, not the exception.</span>
              </h4>
              <p style={{ color: 'var(--muted)', fontSize: '1.05rem', lineHeight: 1.7 }}>
                Effective care requires resources that can meet people where they are.
              </p>
            </div>
          </div>
        </section>

        {/* ── GEO MAP ── */}
        <section style={{ background: 'var(--green-tint)', padding: '5rem 1.5rem' }}>
          <div style={{ maxWidth: '960px', margin: '0 auto' }}>
            <SectionLabel>Claims Data · 5 Boroughs</SectionLabel>
            <h3 className="font-display" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)', fontWeight: 700, color: 'var(--ink)', marginBottom: '1rem' }}>
              Mental Health Claims in NYC
            </h3>
            <p style={{ color: 'var(--muted)', maxWidth: '700px', lineHeight: 1.8, marginBottom: '3rem', fontSize: '1.05rem' }}>
              We examined nearly four years of claims data (January 2022 – December 2025), capturing approximately{' '}
              <strong style={{ color: 'var(--green-deep)' }}>5.8 million</strong> records across the five boroughs.
              However, this represents only those who accessed care. Millions more remain unseen due to barriers like
              unaffordable healthcare and limited resources. The outer boroughs face significant gaps in mental health service access.
            </p>
            <Scroll stepId="map" onEnter={() => setActiveStep(4)}>
              <div style={{ borderRadius: '1.5rem', overflow: 'hidden', boxShadow: '0 8px 40px rgba(0,0,0,0.08)' }}>
                <GeoMap geoData={geoData} dataMap={boroughData} />
              </div>
            </Scroll>
          </div>
        </section>

        {/* ── ACCESS GAP ── */}
        <section style={{ padding: '5rem 1.5rem' }}>
          <div style={{ maxWidth: '960px', margin: '0 auto' }}>
            <Scroll stepId="gap" onEnter={() => setActiveStep(5)}>
              <div className="two-col">
                <div>
                  <SectionLabel>Equity Gap</SectionLabel>
                  <h3 className="font-display" style={{ fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', fontWeight: 700, color: 'var(--green-deep)', marginBottom: '1.25rem' }}>
                    The Access Gap
                  </h3>
                  <p style={{ color: 'var(--muted)', lineHeight: 1.8, marginBottom: '1.5rem' }}>
                    Comparing three neighborhoods with the highest healthcare access against those with the lowest
                    reveals a stark divide:
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
                    <div style={{ background: 'var(--green-pale)', border: '1.5px solid #b2dfb2', borderRadius: '0.75rem', padding: '1rem 1.25rem' }}>
                      <span className="font-display" style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--green-deep)' }}>7 in 10</span>
                      <p style={{ color: 'var(--muted)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
                        residents receive care in neighborhoods with robust mental health infrastructure.
                      </p>
                    </div>
                    <div style={{ background: '#fff5f5', border: '1.5px solid #f5c6c6', borderRadius: '0.75rem', padding: '1rem 1.25rem' }}>
                      <span className="font-display" style={{ fontSize: '2rem', fontWeight: 900, color: '#c0392b' }}>1 in 5</span>
                      <p style={{ color: 'var(--muted)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
                        in areas with the lowest connection to services.
                      </p>
                    </div>
                  </div>
                  <p style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--green-deep)', textAlign: 'center' }}>
                    Geography is a primary driver of treatment outcomes.
                  </p>
                </div>
                <div style={{ borderRadius: '1.25rem', overflow: 'hidden', boxShadow: '0 8px 32px rgba(0,0,0,0.07)' }}>
                  <img src={gapImage} alt="Gap In Healthcare Access Chart" style={{ width: '100%', objectFit: 'contain', display: 'block' }} />
                </div>
              </div>
            </Scroll>
          </div>
        </section>

        {/* ── GAP ANALYSIS EXTRAS ── */}
        <section style={{ background: 'var(--cream)', padding: '0 1.5rem 5rem' }}>
          <div style={{ maxWidth: '960px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
              <SectionLabel>Gap Analysis</SectionLabel>
              <h3 className="font-display" style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', fontWeight: 700, color: 'var(--ink)', marginTop: '0.5rem' }}>
                Why the gap persists — even when services exist
              </h3>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>

              {/* Card 1 — Medicaid */}
              <div style={{ background: '#fff', border: '1.5px solid var(--rule)', borderRadius: '1.25rem', padding: '2rem', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: 'linear-gradient(180deg, #e67e22, #f39c12)' }} />
                <div style={{ paddingLeft: '0.75rem' }}>
                  <div style={{ fontSize: '1.6rem', marginBottom: '0.75rem' }}>💸</div>
                  <h4 className="font-display" style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--ink)', marginBottom: '0.75rem' }}>Low Medicaid Reimbursement</h4>
                  <p style={{ color: 'var(--muted)', lineHeight: 1.75, fontSize: '0.95rem', marginBottom: '1rem' }}>
                    Providers earn <strong style={{ color: '#c0392b' }}>30–50% less</strong> for Medicaid patients than those with private insurance.
                    The math doesn't work — so many providers opt out of the Medicaid network entirely, shrinking the already small pool of available care.
                  </p>
                  <div style={{ background: '#fff8f0', border: '1px solid #f5c6a0', borderRadius: '0.5rem', padding: '0.75rem 1rem', fontSize: '0.85rem', color: '#7a4a1e', fontStyle: 'italic' }}>
                    "The people who need care the most are the hardest to get reimbursed for."
                  </div>
                </div>
              </div>

              {/* Card 2 — Labor Shortage */}
              <div style={{ background: '#fff', border: '1.5px solid var(--rule)', borderRadius: '1.25rem', padding: '2rem', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: 'linear-gradient(180deg, #c0392b, #e74c3c)' }} />
                <div style={{ paddingLeft: '0.75rem' }}>
                  <div style={{ fontSize: '1.6rem', marginBottom: '0.75rem' }}>⏳</div>
                  <h4 className="font-display" style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--ink)', marginBottom: '0.75rem' }}>Severe Labor Shortages</h4>
                  <p style={{ color: 'var(--muted)', lineHeight: 1.75, fontSize: '0.95rem', marginBottom: '1rem' }}>
                    There simply aren't enough licensed mental health professionals to meet demand. Even for patients lucky enough to find a
                    Medicaid-accepting provider, <strong style={{ color: '#c0392b' }}>wait times exceed 3 months</strong> — a crisis-level delay for someone in acute distress.
                  </p>
                  <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <div style={{ flex: 1, background: '#fff5f5', border: '1px solid #f5c6c6', borderRadius: '0.5rem', padding: '0.75rem', textAlign: 'center' }}>
                      <div className="font-display" style={{ fontSize: '1.4rem', fontWeight: 900, color: '#c0392b' }}>3+</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>months average wait</div>
                    </div>
                    <div style={{ flex: 1, background: 'var(--green-pale)', border: '1px solid #b2dfb2', borderRadius: '0.5rem', padding: '0.75rem', textAlign: 'center' }}>
                      <div className="font-display" style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--green-deep)' }}>47</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>child psychologists in Medicaid (2022)</div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ── PROBLEMS (dark section) ── */}
        <section style={{ background: 'var(--green-deep)', padding: '6rem 1.5rem', textAlign: 'center' }}>
          <div style={{ maxWidth: '960px', margin: '0 auto' }}>
            <SectionLabel light>Real-World Barriers</SectionLabel>
            <h2 className="font-display" style={{ fontSize: 'clamp(2rem, 4.5vw, 3.2rem)', fontWeight: 900, color: '#fff', lineHeight: 1.2, margin: '0.75rem 0 1rem' }}>
              Access Isn't Enough For Our City Residents
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto 3.5rem', lineHeight: 1.75 }}>
              Having a clinic nearby doesn't mean you can walk through the door.
              Here are the real-world hurdles stopping New Yorkers today.
            </p>
            <ProblemsGrid />
          </div>
        </section>

        {/* ── SOLUTION BRIDGE ── */}
        <section style={{ padding: '6rem 1.5rem', textAlign: 'center' }}>
          <div style={{ maxWidth: '680px', margin: '0 auto' }}>
            <Divider />
            <h2 className="font-display" style={{ fontSize: 'clamp(2rem, 4.5vw, 3.2rem)', fontWeight: 900, color: 'var(--ink)', lineHeight: 1.2, margin: '1.5rem 0 1rem' }}>
              What If Care Didn't Have To Wait?
            </h2>
            <p style={{ color: 'var(--muted)', fontSize: '1.1rem', lineHeight: 1.8, maxWidth: '520px', margin: '0 auto 1.5rem' }}>
              You finish work. You pick up your kids. Maybe you just got through that tough class at school.
              But the clinic is closed.
            </p>
            <p className="font-display" style={{ fontSize: '1.7rem', fontWeight: 700, color: 'var(--green-mid)' }}>
              What if the clinic came to you?
            </p>
          </div>
        </section>

        {/* ── WHY MOBILE BUSES ── */}
        <section style={{ background: 'var(--green-tint)', padding: '5rem 1.5rem' }}>
          <div style={{ maxWidth: '960px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
              <SectionLabel>The Case for Mobile</SectionLabel>
              <h2 className="font-display" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)', fontWeight: 900, color: 'var(--green-deep)', lineHeight: 1.2, marginTop: '0.5rem', marginBottom: '1rem' }}>
                Why Mobile Buses?
              </h2>
              <p style={{ color: 'var(--muted)', maxWidth: '600px', margin: '0 auto', fontSize: '1.05rem', lineHeight: 1.75 }}>
                Because meeting people where they are is not just compassionate — it's dramatically more cost-effective.
              </p>
            </div>

            {/* Cost comparison cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem', marginBottom: '3rem' }}>
              <div style={{ background: 'var(--green-deep)', borderRadius: '1.25rem', padding: '2rem', textAlign: 'center', color: '#fff' }}>
                <div style={{ fontSize: '0.7rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#a8d5b5', fontWeight: 700, marginBottom: '0.75rem' }}>Mobile Clinic</div>
                <div className="font-display" style={{ fontSize: '2.8rem', fontWeight: 900, color: '#a8d5b5', lineHeight: 1 }}>$243</div>
                <div style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.85rem', marginTop: '0.5rem' }}>per patient, per year</div>
              </div>
              <div style={{ background: '#fff', border: '1.5px solid var(--rule)', borderRadius: '1.25rem', padding: '2rem', textAlign: 'center' }}>
                <div style={{ fontSize: '0.7rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#c0392b', fontWeight: 700, marginBottom: '0.75rem' }}>Fixed Health Center</div>
                <div className="font-display" style={{ fontSize: '2.8rem', fontWeight: 900, color: '#c0392b', lineHeight: 1 }}>$1,090–<br/>$1,159</div>
                <div style={{ color: 'var(--muted)', fontSize: '0.85rem', marginTop: '0.5rem' }}>per patient, per year</div>
              </div>
            </div>

            {/* Capital cost comparison */}
            <div style={{ background: '#fff', border: '1.5px solid var(--rule)', borderRadius: '1.25rem', padding: '2rem 2.5rem', marginBottom: '2rem' }}>
              <h4 className="font-display" style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--ink)', marginBottom: '1.25rem' }}>
                Capital &amp; Infrastructure Costs
              </h4>
              <div className="two-col" style={{ gap: '2rem' }}>
                <div>
                  <div style={{ fontSize: '0.7rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--green-mid)', fontWeight: 700, marginBottom: '0.75rem' }}>🚌 Mobile Unit</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                    {[
                      ['Mobile Clinic Van', '$100K – $230K'],
                      ['Counseling Unit', '$150K – $260K'],
                    ].map(([label, cost]) => (
                      <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.6rem 1rem', background: 'var(--green-pale)', borderRadius: '0.5rem' }}>
                        <span style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>{label}</span>
                        <strong style={{ color: 'var(--green-deep)', fontSize: '0.95rem' }}>{cost}</strong>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '0.7rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#c0392b', fontWeight: 700, marginBottom: '0.75rem' }}>🏢 Brick-and-Mortar Clinic (NYC)</div>
                  <div style={{ padding: '1rem', background: '#fff5f5', border: '1px solid #f5c6c6', borderRadius: '0.5rem' }}>
                    <p style={{ color: 'var(--muted)', fontSize: '0.9rem', lineHeight: 1.7, margin: 0 }}>
                      Millions in construction, leasing &amp; maintenance — plus{' '}
                      <strong style={{ color: '#c0392b' }}>long permitting timelines</strong> that delay care
                      by years before a single patient is seen.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Fiscal quote */}
            <div style={{ textAlign: 'center', padding: '2rem', background: 'var(--green-deep)', borderRadius: '1.25rem' }}>
              <p className="font-display" style={{ fontSize: 'clamp(1.1rem, 2.5vw, 1.5rem)', fontStyle: 'italic', color: '#a8d5b5', lineHeight: 1.6, margin: 0 }}>
                "It's cheaper for the city to provide a therapy bus now than to pay for emergency room visits or unemployment costs later."
              </p>
            </div>
          </div>
        </section>

        {/* ── HEALING HUB ── */}
        <section style={{ background: 'var(--green-tint)', padding: '5rem 1.5rem' }}>
          <div style={{ maxWidth: '960px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
              <SectionLabel>Our Proposal</SectionLabel>
              <h2 className="font-display" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 900, color: 'var(--green-deep)', lineHeight: 1.2, marginBottom: '1.25rem', marginTop: '0.5rem' }}>
                Introducing The Neighborhood Healing Hub
              </h2>
            </div>

            {/* Savings callout */}
            <div style={{ background: '#fff', border: '1.5px solid var(--rule)', borderRadius: '1.25rem', padding: '2rem', marginBottom: '2.5rem', display: 'flex', alignItems: 'center', gap: '2rem', flexWrap: 'wrap' }}>
              <div style={{ flex: '0 0 auto', textAlign: 'center' }}>
                <div className="big-number" style={{ fontSize: '3rem' }}>$561K</div>
                <p style={{ color: 'var(--muted)', fontSize: '0.85rem', marginTop: '0.25rem' }}>avg. annual savings per unit</p>
              </div>
              <p style={{ color: 'var(--muted)', fontSize: '1rem', lineHeight: 1.8, flex: 1, minWidth: '240px' }}>
                The Neighborhood Healing Hub isn't just a moral imperative — it's a fiscally responsible one.
                Research shows that mobile clinics save an average of{' '}
                <strong style={{ color: 'var(--green-deep)' }}>$561,220</strong> per year by preventing unnecessary
                Emergency Department visits (Yu et al., 2017). Current legislation like the MOBILE Health Care Act
                and the American Rescue Plan Act provides the federal funding pathways to make these buses a
                permanent fixture of NYC's healthcare infrastructure.
              </p>
            </div>

            <TileGrid />

            {/* ── HOW IT WORKS ── */}
            <div style={{ marginTop: '4rem' }}>
              <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                <SectionLabel>Operations</SectionLabel>
                <h3 className="font-display" style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', fontWeight: 700, color: 'var(--green-deep)', marginTop: '0.5rem' }}>
                  How It Works
                </h3>
              </div>

              <div className="two-col" style={{ marginBottom: '3rem' }}>
                {/* Left — logistics */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {[
                    { icon: '📍', label: 'Where', detail: 'Parked at public schools and community centers in high-need neighborhoods across all 5 boroughs.' },
                    { icon: '🕒', label: 'When', detail: 'Operating 3 PM – 8 PM daily — after school and after work, when traditional clinics are closed.' },
                    { icon: '🗣️', label: 'Language', detail: 'Community Liaisons from the neighborhood build trust. Video interpretation supports rare languages.' },
                  ].map(({ icon, label, detail }) => (
                    <div key={label} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', background: '#fff', border: '1.5px solid var(--rule)', borderRadius: '1rem', padding: '1.25rem 1.5rem' }}>
                      <div style={{ fontSize: '1.4rem', flexShrink: 0 }}>{icon}</div>
                      <div>
                        <div style={{ fontWeight: 700, color: 'var(--green-deep)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.25rem' }}>{label}</div>
                        <p style={{ color: 'var(--muted)', fontSize: '0.95rem', lineHeight: 1.65, margin: 0 }}>{detail}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Right — image placeholder */}
                <div style={{
                  borderRadius: '1.25rem',
                  border: '2px dashed #b2dfb2',
                  background: 'rgba(255,255,255,0.6)',
                  minHeight: '320px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.75rem',
                  padding: '0.5rem',
                  textAlign: 'center',
                }}>
                  
                  <img src='/hotspots.png' alt="Neighborhood Healing Hub bus" style={{ width: '100%', borderRadius: '1rem' }} />
                </div>
              </div>

              {/* ── LANGUAGE SUPPORT callout ── */}
              <div style={{ background: 'var(--green-deep)', borderRadius: '1.25rem', padding: '2.5rem', display: 'flex', gap: '2rem', flexWrap: 'wrap', alignItems: 'flex-start' }}>
                <div style={{ flex: '0 0 auto', fontSize: '2.5rem' }}>🌐</div>
                <div style={{ flex: 1, minWidth: '220px' }}>
                  <div style={{ fontSize: '0.7rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#a8d5b5', fontWeight: 700, marginBottom: '0.5rem' }}>
                    "What if people don't speak the language?"
                  </div>
                  <h4 className="font-display" style={{ fontSize: '1.4rem', fontWeight: 700, color: '#fff', marginBottom: '1rem' }}>
                    Language Support is Built In.
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                    {[
                      ['🤝', 'Community Liaisons', 'Local, trusted neighbors who already speak the language — literally and culturally.'],
                      ['📱', 'Video Interpretation', 'Real-time interpretation for every language, including rare dialects, available on-bus.'],
                    ].map(([icon, title, desc]) => (
                      <div key={title} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                        <span style={{ fontSize: '1.1rem' }}>{icon}</span>
                        <div>
                          <strong style={{ color: '#a8d5b5', fontSize: '0.9rem' }}>{title}</strong>
                          <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.85rem', margin: '0.1rem 0 0', lineHeight: 1.6 }}>{desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── PDF PAGES ── */}
        <section style={{ padding: '5rem 1.5rem' }}>
          <div style={{ maxWidth: '860px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
              <SectionLabel>Learn More</SectionLabel>
              <h2 className="font-display" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)', fontWeight: 900, color: 'var(--ink)', lineHeight: 1.2, marginBottom: '1rem', marginTop: '0.5rem' }}>
                Information On Mobile Mental Health Units
              </h2>
              <p style={{ color: 'var(--muted)', fontSize: '1rem', maxWidth: '500px', margin: '0 auto' }}>
                An affordable solution that increases access to care for everyone in the five boroughs.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {['/buspdf1.png', '/buspdf2.png', '/buspdf3.png', '/buspdf4.png'].map((src, i) => (
                <div key={i} style={{ borderRadius: '1rem', overflow: 'hidden', boxShadow: '0 8px 40px rgba(0,0,0,0.09)', border: '1.5px solid var(--rule)' }}>
                  <img src={src} alt={`Mobile Mental Health Unit — page ${i + 1}`} style={{ width: '100%', display: 'block' }} />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer style={{ background: 'var(--green-deep)', padding: '3.5rem 1.5rem', textAlign: 'center' }}>
          <p className="font-display" style={{ color: '#a8d5b5', fontSize: '1.3rem', fontStyle: 'italic', marginBottom: '1rem' }}>
            Every New Yorker deserves access to mental health care — wherever they are.
          </p>
          <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.8rem' }}>
            Data sources: NYC Health Department · NYC DOE · HRSA · NYS DOH · NYC Comptroller · NYC Mayor's Office
          </p>
        </footer>

      </div>
    </>
  );
}

export default App;
