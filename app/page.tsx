'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

const COLORS = {
  cream: '#FFFCF7',
  orange: '#E84E0F',
  orangeDeep: '#C73D0A',
  peach: '#FFE4D3',
  peachSoft: '#FFF1E7',
  teal: '#1F7A82',
  tealDeep: '#155A60',
  mint: '#DBF3EF',
  mintSoft: '#EEF9F7',
  gold: '#FFB020',
  ink: '#1C1B2E',
  muted: '#6C6B80',
  line: '#EFE7DD',
};

/* ---------- Reusable speed-line divider (signature motif from the logo) ---------- */
function SpeedLines() {
  return (
    <div className="flex justify-center gap-1.5 py-10">
      <span className="block h-1 rounded-full" style={{ width: 50, opacity: 0.35, background: `linear-gradient(90deg, ${COLORS.orange}, ${COLORS.gold})` }} />
      <span className="block h-1 rounded-full" style={{ width: 80, opacity: 0.65, background: `linear-gradient(90deg, ${COLORS.orange}, ${COLORS.gold})` }} />
      <span className="block h-1 rounded-full" style={{ width: 120, background: `linear-gradient(90deg, ${COLORS.orange}, ${COLORS.gold})` }} />
    </div>
  );
}

/* ---------- Small inline icon set (kept custom, not emoji) ---------- */
const Icon = {
  Box: (p: { color: string }) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M3 9l9-6 9 6v10a1 1 0 01-1 1h-5v-6H9v6H4a1 1 0 01-1-1V9z" stroke={p.color} strokeWidth="1.8" strokeLinejoin="round" /></svg>
  ),
  Tag: (p: { color: string }) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M4 4h2l2.4 12.2a2 2 0 002 1.8h7.2a2 2 0 002-1.7L20 8H6" stroke={p.color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /><circle cx="10" cy="20" r="1.4" fill={p.color} /><circle cx="17" cy="20" r="1.4" fill={p.color} /></svg>
  ),
  Chart: (p: { color: string }) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M3 17l4-6 4 3 5-8 5 11" stroke={p.color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
  ),
  Shield: (p: { color: string }) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><rect x="5" y="3" width="14" height="18" rx="2" stroke={p.color} strokeWidth="1.8" /><path d="M9 18h6" stroke={p.color} strokeWidth="1.8" strokeLinecap="round" /></svg>
  ),
  Phone: (p: { color: string }) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2z" stroke={p.color} strokeWidth="1.7" strokeLinejoin="round" /></svg>
  ),
  Mail: (p: { color: string }) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><rect x="3" y="5" width="18" height="14" rx="2" stroke={p.color} strokeWidth="1.7" /><path d="M4 7l8 6 8-6" stroke={p.color} strokeWidth="1.7" strokeLinecap="round" /></svg>
  ),
  Pin: (p: { color: string }) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 21s7-6.5 7-12a7 7 0 10-14 0c0 5.5 7 12 7 12z" stroke={p.color} strokeWidth="1.7" strokeLinejoin="round" /><circle cx="12" cy="9" r="2.4" stroke={p.color} strokeWidth="1.7" /></svg>
  ),
  Store: (p: { color: string }) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M3 9l9-6 9 6v10a1 1 0 01-1 1H4a1 1 0 01-1-1V9z" stroke={p.color} strokeWidth="1.8" strokeLinejoin="round" /></svg>
  ),
  Mobile: (p: { color: string }) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><rect x="4" y="4" width="16" height="16" rx="4" stroke={p.color} strokeWidth="1.8" /><path d="M9 12h6M9 16h3" stroke={p.color} strokeWidth="1.8" strokeLinecap="round" /></svg>
  ),
  Route: (p: { color: string }) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 3v14M12 3L7 8M12 3l5 5M5 17h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1v-2a1 1 0 011-1z" stroke={p.color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
  ),
};

export default function HomePage() {
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems = ['Home', 'About Us', 'Features', 'How It Works', 'Contact Us'];

  return (
    <div style={{ backgroundColor: COLORS.cream, minHeight: '100vh', fontFamily: 'Inter, sans-serif', color: COLORS.ink, overflowX: 'hidden' }}>

      {/* Local keyframes for the cute animated bits */}
      <style jsx global>{`
        @keyframes drive {
          0%, 100% { transform: translateX(-36px) translateY(0); }
          50% { transform: translateX(36px) translateY(-4px); }
        }
        @keyframes bob {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        .drive-cart { animation: drive 3.2s ease-in-out infinite; }
        .float-chip { animation: bob 3.4s ease-in-out infinite; }
        .blob-shape { border-radius: 38% 62% 60% 40% / 45% 40% 60% 55%; }
      `}</style>

      {/* ---------- NAVBAR ---------- */}
      <nav
        className="flex items-center justify-between px-6 md:px-16 py-3 sticky top-0 z-50 backdrop-blur"
        style={{ backgroundColor: 'rgba(255,252,247,0.9)', borderBottom: `1px solid ${COLORS.line}` }}
      >
        <div className="flex items-center gap-3">
          <Image src="/logo.png" alt="ZniyerBuy" width={42} height={42} />
          <h1 className="text-xl font-extrabold tracking-wide">
            <span style={{ color: COLORS.orange }}>ZNIYER</span>
            <span style={{ color: COLORS.teal }}> BuY</span>
          </h1>
        </div>

        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <Link
              key={item}
              href={`#${item.toLowerCase().replace(/ /g, '-')}`}
              className="text-sm font-semibold transition hover:opacity-70"
              style={{ color: COLORS.ink, opacity: 0.75 }}
            >
              {item}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <Link href="/auth/login"
            className="px-5 py-2 rounded-2xl text-sm font-bold transition hover:opacity-80"
            style={{ color: COLORS.orange, border: `2px solid ${COLORS.orange}` }}>
            Login
          </Link>
          <Link href="/auth/register"
            className="px-5 py-2 rounded-2xl text-sm font-bold text-white transition hover:opacity-90"
            style={{ background: `linear-gradient(135deg, ${COLORS.orange}, ${COLORS.orangeDeep})`, boxShadow: `0 8px 20px -8px rgba(232,78,15,0.6)` }}>
            Get Started
          </Link>
        </div>

        <button className="md:hidden text-2xl" onClick={() => setMenuOpen(!menuOpen)}>☰</button>
      </nav>

      {menuOpen && (
        <div className="md:hidden px-8 py-4 space-y-3 shadow-md" style={{ backgroundColor: '#FFFFFF', borderBottom: `1px solid ${COLORS.line}` }}>
          {navItems.map((item) => (
            <a key={item} href={`#${item.toLowerCase().replace(/ /g, '-')}`}
              className="block text-sm font-semibold" style={{ color: COLORS.ink }}
              onClick={() => setMenuOpen(false)}>
              {item}
            </a>
          ))}
          <Link href="/auth/login" className="block text-sm font-bold" style={{ color: COLORS.orange }}>Login</Link>
          <Link href="/auth/register" className="block text-sm font-bold" style={{ color: COLORS.teal }}>Get Started</Link>
        </div>
      )}

      {/* ---------- HERO ---------- */}
      <section id="home" className="px-6 md:px-16 pt-16 pb-10"
        style={{ background: `radial-gradient(circle at 85% 10%, ${COLORS.mintSoft} 0%, transparent 45%), radial-gradient(circle at 5% 30%, ${COLORS.peachSoft} 0%, transparent 40%)` }}>
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-16">

          <div className="flex-1 text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold mb-6"
              style={{ backgroundColor: COLORS.peach, color: COLORS.orangeDeep }}>
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: COLORS.orange }} />
              Sri Lanka's freshest delivery network
            </div>
            <h1 className="text-5xl md:text-[52px] font-extrabold leading-[1.08] tracking-tight mb-6">
              Your cart,<br />
              <span style={{ color: COLORS.orange }}>delivered</span> before<br />
              the ice melts <span style={{ color: COLORS.teal }}>🍦</span>
            </h1>
            <p className="text-[17px] leading-relaxed mb-8 max-w-md" style={{ color: COLORS.muted }}>
              ZniyerBuy connects your favourite local shops to your doorstep — fresh groceries, everyday essentials, and great deals, all managed from one simple dashboard.
            </p>
            <div className="flex gap-4 flex-wrap mb-8">
              <Link href="/auth/register"
                className="px-7 py-4 rounded-2xl text-[15px] font-bold text-white transition hover:opacity-90"
                style={{ background: `linear-gradient(135deg, ${COLORS.orange}, ${COLORS.orangeDeep})`, boxShadow: `0 8px 20px -8px rgba(232,78,15,0.6)` }}>
                Start Shopping →
              </Link>
              <a href="#how-it-works"
                className="px-7 py-4 rounded-2xl text-[15px] font-bold transition hover:opacity-80"
                style={{ color: COLORS.orange, border: `2px solid ${COLORS.orange}` }}>
                See How It Works
              </a>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-sm tracking-widest" style={{ color: COLORS.gold }}>★★★★★</div>
              <span className="text-[13.5px] font-semibold" style={{ color: COLORS.muted }}>4.9 rating from 500+ shop owners</span>
            </div>
          </div>

          {/* Hero visual: real logo on a blob card + animated trail */}
          <div className="flex-1 flex justify-center">
            <div className="relative w-full max-w-[440px]">
              <div className="blob-shape relative bg-white text-center px-8 py-12"
                style={{ border: `1.5px solid ${COLORS.line}`, boxShadow: '0 30px 60px -30px rgba(28,27,46,0.25)' }}>
                <Image src="/logo.png" alt="ZniyerBuy" width={90} height={90} className="mx-auto" />
                <h2 className="text-xl font-extrabold mt-3">
                  <span style={{ color: COLORS.orange }}>ZNIYER</span>
                  <span style={{ color: COLORS.teal }}> BuY</span>
                </h2>
                <p className="text-[11px] tracking-widest mt-1" style={{ color: COLORS.muted }}>BRINGING THE CART TO YOUR DOORSTEP</p>

                {/* dashed road */}
                <div className="relative h-0.5 my-8 mx-auto w-4/5"
                  style={{ backgroundImage: `linear-gradient(90deg, ${COLORS.line} 50%, transparent 0%)`, backgroundSize: '16px 2px', backgroundRepeat: 'repeat-x' }} />

                {/* driving mini logo */}
                <div className="drive-cart w-14 mx-auto -mt-10">
                  <Image src="/logo.png" alt="" width={56} height={56} />
                </div>
              </div>

              {/* floating chips */}
              <div className="float-chip absolute -top-2 -left-6 bg-white rounded-2xl px-3.5 py-2 text-xs font-bold"
                style={{ border: `1px solid ${COLORS.line}`, boxShadow: '0 12px 24px -12px rgba(28,27,46,0.3)', color: COLORS.tealDeep }}>
                🥑 Fresh produce
              </div>
              <div className="float-chip absolute bottom-4 -right-8 bg-white rounded-2xl px-3.5 py-2 text-xs font-bold"
                style={{ border: `1px solid ${COLORS.line}`, boxShadow: '0 12px 24px -12px rgba(28,27,46,0.3)', color: COLORS.orangeDeep, animationDelay: '0.7s' }}>
                🏷️ 8 live deals
              </div>
              <div className="float-chip absolute top-1/2 -right-10 bg-white rounded-2xl px-3.5 py-2 text-xs font-bold"
                style={{ border: `1px solid ${COLORS.line}`, boxShadow: '0 12px 24px -12px rgba(28,27,46,0.3)', color: COLORS.gold, animationDelay: '1.4s' }}>
                ⚡ 20 min avg
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="max-w-4xl mx-auto grid grid-cols-3 gap-4 md:gap-6 mt-16">
          {[
            { value: '500+', label: 'Shop Owners' },
            { value: '10K+', label: 'Products Managed' },
            { value: '2K+', label: 'Active Deals' },
          ].map((stat, i) => (
            <div key={i} className="text-center p-5 md:p-6 rounded-2xl"
              style={{ backgroundColor: '#FFFFFF', border: `1px solid ${COLORS.line}` }}>
              <p className="text-2xl md:text-3xl font-extrabold" style={{ color: COLORS.orange }}>{stat.value}</p>
              <p className="text-xs md:text-sm mt-1 font-semibold" style={{ color: COLORS.muted }}>{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      <SpeedLines />

      {/* ---------- ABOUT ---------- */}
      <section id="about-us" className="px-6 md:px-16 pb-20">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-16">
          <div className="flex-1 grid grid-cols-2 gap-4">
            <div className="rounded-3xl p-6 flex flex-col gap-3" style={{ backgroundColor: COLORS.peachSoft }}>
              <Icon.Store color={COLORS.orangeDeep} />
              <p className="text-sm font-bold">Shop Management</p>
            </div>
            <div className="rounded-3xl p-6 flex flex-col gap-3 justify-center" style={{ backgroundColor: COLORS.ink, color: '#fff' }}>
              <Icon.Route color={COLORS.gold} />
              <p className="text-sm font-bold">Real-time Delivery Tracking</p>
            </div>
            <div className="rounded-3xl p-6 flex flex-col gap-3" style={{ backgroundColor: COLORS.mintSoft }}>
              <Icon.Tag color={COLORS.tealDeep} />
              <p className="text-sm font-bold">Deal Creation</p>
            </div>
            <div className="rounded-3xl p-6 flex flex-col gap-3" style={{ backgroundColor: COLORS.peachSoft }}>
              <Icon.Chart color={COLORS.orangeDeep} />
              <p className="text-sm font-bold">Live Analytics</p>
            </div>
          </div>

          <div className="flex-1">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold mb-4"
              style={{ backgroundColor: COLORS.mint, color: COLORS.tealDeep }}>
              🏢 About Us
            </div>
            <h2 className="text-4xl font-extrabold mb-6 tracking-tight">
              Built for the corner shops that keep Sri Lanka running
            </h2>
            <p className="text-base leading-relaxed mb-5" style={{ color: COLORS.muted }}>
              ZniyerBuy is a hyperlocal marketplace connecting shop owners with their neighbourhoods. We handle the tech — products, deals, orders, delivery — so shop owners can focus on what they do best.
            </p>
            <p className="text-base leading-relaxed mb-8" style={{ color: COLORS.muted }}>
              Our mission is simple: bring the cart to your doorstep, and give every small business the same digital edge as the big chains.
            </p>
            <Link href="/auth/register"
              className="inline-block px-8 py-3.5 rounded-2xl text-sm font-bold text-white transition hover:opacity-90"
              style={{ backgroundColor: COLORS.teal }}>
              Join Us Today →
            </Link>
          </div>
        </div>
      </section>

      {/* ---------- FEATURES (bento grid) ---------- */}
      <section id="features" className="px-6 md:px-16 py-20" style={{ backgroundColor: COLORS.mintSoft }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold mb-4"
              style={{ backgroundColor: COLORS.peach, color: COLORS.orangeDeep }}>
              ✨ Powerful Features
            </div>
            <h2 className="text-4xl font-extrabold tracking-tight mb-3">Everything a shop owner needs</h2>
            <p className="text-[15px]" style={{ color: COLORS.muted }}>One dashboard for products, deals, and growth — built specifically for Sri Lankan shops.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 auto-rows-[180px] gap-4">
            <div className="md:col-span-2 rounded-3xl p-6 flex flex-col justify-between text-white"
              style={{ background: `linear-gradient(150deg, ${COLORS.orange}, ${COLORS.orangeDeep})` }}>
              <div className="w-11 h-11 rounded-2xl flex items-center justify-center" style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}>
                <Icon.Box color="#fff" />
              </div>
              <div>
                <h3 className="text-base font-bold">Product Management</h3>
                <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.85)' }}>Add, edit, and track stock in seconds. Get low-stock alerts before you run out.</p>
              </div>
            </div>

            <div className="rounded-3xl p-6 flex flex-col justify-between bg-white" style={{ border: `1px solid ${COLORS.line}` }}>
              <div className="w-11 h-11 rounded-2xl flex items-center justify-center" style={{ backgroundColor: COLORS.mint }}>
                <Icon.Tag color={COLORS.tealDeep} />
              </div>
              <div>
                <h3 className="text-base font-bold">Deals &amp; Promos</h3>
                <p className="text-xs mt-1" style={{ color: COLORS.muted }}>Launch discounts and watch sales climb.</p>
              </div>
            </div>

            <div className="md:row-span-2 rounded-3xl p-6 flex flex-col justify-between text-white"
              style={{ background: `linear-gradient(150deg, ${COLORS.teal}, ${COLORS.tealDeep})` }}>
              <div className="w-11 h-11 rounded-2xl flex items-center justify-center" style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}>
                <Icon.Chart color="#fff" />
              </div>
              <div>
                <h3 className="text-base font-bold">Dashboard Analytics</h3>
                <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.85)' }}>Views, orders, and revenue — a clear picture of your shop's health, always up to date.</p>
              </div>
            </div>

            <div className="rounded-3xl p-6 flex flex-col justify-between" style={{ backgroundColor: COLORS.peachSoft }}>
              <div className="w-11 h-11 rounded-2xl flex items-center justify-center" style={{ backgroundColor: COLORS.peach }}>
                <Icon.Store color={COLORS.orangeDeep} />
              </div>
              <div>
                <h3 className="text-base font-bold">Shop Profile</h3>
                <p className="text-xs mt-1" style={{ color: COLORS.muted }}>Hours, location and contact info — always accurate.</p>
              </div>
            </div>

            <div className="rounded-3xl p-6 flex flex-col justify-between bg-white" style={{ border: `1px solid ${COLORS.line}` }}>
              <div className="w-11 h-11 rounded-2xl flex items-center justify-center" style={{ backgroundColor: COLORS.mint }}>
                <Icon.Shield color={COLORS.tealDeep} />
              </div>
              <div>
                <h3 className="text-base font-bold">Secure Login</h3>
                <p className="text-xs mt-1" style={{ color: COLORS.muted }}>Firebase-powered auth keeps shop data safe.</p>
              </div>
            </div>

            <div className="rounded-3xl p-6 flex flex-col justify-between bg-white" style={{ border: `1px solid ${COLORS.line}` }}>
              <div className="w-11 h-11 rounded-2xl flex items-center justify-center" style={{ backgroundColor: COLORS.peach }}>
                <Icon.Mobile color={COLORS.orangeDeep} />
              </div>
              <div>
                <h3 className="text-base font-bold">Mobile Friendly</h3>
                <p className="text-xs mt-1" style={{ color: COLORS.muted }}>Manage your shop from any device, anywhere.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- HOW IT WORKS ---------- */}
      <section id="how-it-works" className="px-6 md:px-16 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold mb-4"
              style={{ backgroundColor: COLORS.mint, color: COLORS.tealDeep }}>
              🎯 Simple Process
            </div>
            <h2 className="text-4xl font-extrabold tracking-tight">From sign-up to first sale</h2>
            <p className="text-[15px] mt-3" style={{ color: COLORS.muted }}>Three steps, no headaches.</p>
          </div>

          <div className="relative flex flex-col md:flex-row justify-between gap-10 md:gap-6">
            <div className="hidden md:block absolute top-11 left-[8%] right-[8%] h-0.5"
              style={{ backgroundImage: `linear-gradient(90deg, ${COLORS.peach} 40%, transparent 0%)`, backgroundSize: '14px 3px', backgroundRepeat: 'repeat-x' }} />

            {[
              { icon: '✍️', title: 'Create your account', desc: 'Register with your email and set up your shop owner profile in minutes.', bg: `linear-gradient(150deg, ${COLORS.orange}, ${COLORS.orangeDeep})` },
              { icon: '🏪', title: 'Set up your shop', desc: 'Add shop details, upload products, and launch your first deal.', bg: `linear-gradient(150deg, ${COLORS.gold}, #E89400)` },
              { icon: '📈', title: 'Manage & grow', desc: 'Track performance and manage everything from one dashboard.', bg: `linear-gradient(150deg, ${COLORS.teal}, ${COLORS.tealDeep})` },
            ].map((step, i) => (
              <div key={i} className="relative flex-1 z-10 text-left">
                <div className="w-[88px] h-[88px] rounded-3xl flex items-center justify-center text-3xl mb-5 text-white font-extrabold"
                  style={{ background: step.bg }}>
                  {step.icon}
                </div>
                <h3 className="text-lg font-bold mb-2">{step.title}</h3>
                <p className="text-sm leading-relaxed max-w-[240px]" style={{ color: COLORS.muted }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- CTA ---------- */}
      <section className="px-6 md:px-16 pb-20">
        <div className="max-w-6xl mx-auto relative overflow-hidden rounded-[36px] px-8 py-16 md:py-20 text-center"
          style={{ background: `linear-gradient(135deg, ${COLORS.orange} 0%, ${COLORS.orangeDeep} 60%, ${COLORS.tealDeep} 130%)` }}>
          <div className="absolute -top-28 -left-16 w-72 h-72 rounded-full" style={{ backgroundColor: 'rgba(255,255,255,0.08)' }} />
          <div className="absolute -bottom-24 -right-14 w-56 h-56 rounded-full" style={{ backgroundColor: 'rgba(255,255,255,0.08)' }} />
          <h2 className="relative text-3xl md:text-4xl font-extrabold text-white mb-4">Ready to grow your shop? 🚀</h2>
          <p className="relative text-[15px] mb-9 max-w-md mx-auto" style={{ color: 'rgba(255,255,255,0.88)' }}>
            Join hundreds of shop owners already using ZniyerBuy to manage their business smarter and faster.
          </p>
          <div className="relative flex gap-4 justify-center flex-wrap">
            <Link href="/auth/register"
              className="px-9 py-4 rounded-2xl text-[15px] font-bold transition hover:opacity-90"
              style={{ backgroundColor: '#FFFFFF', color: COLORS.orangeDeep }}>
              Get Started Free →
            </Link>
            <Link href="/auth/login"
              className="px-9 py-4 rounded-2xl text-[15px] font-bold text-white transition hover:opacity-80"
              style={{ border: '2px solid rgba(255,255,255,0.7)' }}>
              Login
            </Link>
          </div>
        </div>
      </section>

      {/* ---------- CONTACT ---------- */}
      <section id="contact-us" className="px-6 md:px-16 pb-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold mb-4"
              style={{ backgroundColor: COLORS.peach, color: COLORS.orangeDeep }}>
              📞 Get In Touch
            </div>
            <h2 className="text-4xl font-extrabold tracking-tight">We're here to help</h2>
            <p className="text-[15px] mt-3" style={{ color: COLORS.muted }}>Reach out anytime — we usually reply within a day.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { Icon: Icon.Phone, bg: COLORS.peach, iconColor: COLORS.orangeDeep, title: 'Phone', value: '071 987 6542', sub: 'Mon–Fri, 8AM – 6PM' },
              { Icon: Icon.Mail, bg: COLORS.mint, iconColor: COLORS.tealDeep, title: 'Email', value: 'zniyerbuy@gmail.com', sub: 'We reply within 24 hours' },
              { Icon: Icon.Pin, bg: COLORS.peach, iconColor: COLORS.orangeDeep, title: 'Location', value: 'No 21, Galle Fort', sub: 'Galle, Sri Lanka' },
            ].map((c, i) => (
              <div key={i} className="rounded-3xl p-7 bg-white flex flex-col items-start gap-3" style={{ border: `1px solid ${COLORS.line}` }}>
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ backgroundColor: c.bg }}>
                  <c.Icon color={c.iconColor} />
                </div>
                <h3 className="text-sm font-bold">{c.title}</h3>
                <p className="text-[15px] font-bold" style={{ color: COLORS.orangeDeep }}>{c.value}</p>
                <p className="text-xs" style={{ color: COLORS.muted }}>{c.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- FOOTER ---------- */}
      <footer style={{ backgroundColor: COLORS.ink }}>
        <div className="px-6 md:px-16 py-12 max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <Image src="/logo.png" alt="ZniyerBuy" width={40} height={40} />
                <h1 className="text-xl font-extrabold">
                  <span style={{ color: COLORS.orange }}>ZNIYER</span>
                  <span style={{ color: COLORS.teal }}> BuY</span>
                </h1>
              </div>
              <p className="text-sm leading-relaxed max-w-xs" style={{ color: '#9998AC' }}>
                Bringing the cart to your doorstep. The smartest way to manage your shop in Sri Lanka.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-bold text-white mb-4">Quick Links</h3>
              <div className="space-y-2">
                {navItems.map((link) => (
                  <a key={link} href={`#${link.toLowerCase().replace(/ /g, '-')}`}
                    className="block text-sm hover:opacity-80 transition" style={{ color: '#9998AC' }}>
                    {link}
                  </a>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-bold text-white mb-4">Contact</h3>
              <div className="space-y-3">
                <p className="text-sm" style={{ color: '#9998AC' }}>📞 071 987 6542</p>
                <p className="text-sm" style={{ color: '#9998AC' }}>📧 zniyerbuy@gmail.com</p>
                <p className="text-sm" style={{ color: '#9998AC' }}>📍 No 21, Galle Fort, Sri Lanka</p>
              </div>
            </div>
          </div>
          <div className="pt-8 flex items-center justify-between flex-wrap gap-4"
            style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}>
            <p className="text-xs" style={{ color: '#8382A0' }}>© 2026 ZniyerBuy. All rights reserved.</p>
            <p className="text-xs" style={{ color: '#8382A0' }}>🛒 Bringing the cart to your doorstep</p>
          </div>
        </div>
      </footer>

    </div>
  );
}