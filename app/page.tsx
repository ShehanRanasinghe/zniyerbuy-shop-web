'use client';

import Link from 'next/link';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faRocket, faStore, faBox, faTags, faChartLine, faLock, faMobileAlt,
  faPen, faChartBar, faPhone, faEnvelope, faMapMarkerAlt, faShoppingCart,
  faBars, faTimes, faCheckCircle, faFire
} from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';

export default function HomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div style={{ backgroundColor: '#F5F7FA', minHeight: '100vh' }}>

      {/* Navbar */}
      <nav className="flex items-center justify-between px-4 sm:px-8 lg:px-12 py-4 sticky top-0 z-50 shadow-sm backdrop-blur-sm"
        style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', borderBottom: '1px solid #E8ECF0' }}>
        <div className="flex items-center gap-3">
          <Image src="/logo.png" alt="ZniyerBuy" width={45} height={45} className="w-10 h-10 sm:w-11 sm:h-11" />
          <h1 className="text-lg sm:text-xl font-extrabold tracking-wide">
            <span style={{ color: '#E84E0F' }}>ZNIYER</span>
            <span style={{ color: '#2A7F8A' }}> BuY</span>
          </h1>
        </div>
        <div className="hidden lg:flex items-center gap-8">
          <a href="#features" className="text-sm font-medium hover:text-[#E84E0F] transition" style={{ color: '#666666' }}>Features</a>
          <a href="#how-it-works" className="text-sm font-medium hover:text-[#E84E0F] transition" style={{ color: '#666666' }}>How It Works</a>
          <a href="#contact" className="text-sm font-medium hover:text-[#E84E0F] transition" style={{ color: '#666666' }}>Contact</a>
        </div>
        <div className="hidden sm:flex items-center gap-3">
          <Link href="/auth/login"
            className="px-4 lg:px-5 py-2 rounded-xl text-sm font-medium transition hover:bg-[#FEF0EB]"
            style={{ color: '#E84E0F', border: '1px solid #E84E0F' }}>
            Login
          </Link>
          <Link href="/auth/register"
            className="px-4 lg:px-5 py-2 rounded-xl text-sm font-medium text-white transition hover:opacity-90 shadow-md"
            style={{ backgroundColor: '#E84E0F' }}>
            Get Started
          </Link>
        </div>
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden text-2xl"
          style={{ color: '#E84E0F' }}>
          <FontAwesomeIcon icon={mobileMenuOpen ? faTimes : faBars} />
        </button>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-white" style={{ top: '73px' }}>
          <div className="flex flex-col p-6 space-y-4">
            <a href="#features" onClick={() => setMobileMenuOpen(false)} className="text-base font-medium py-3 border-b" style={{ color: '#666666' }}>Features</a>
            <a href="#how-it-works" onClick={() => setMobileMenuOpen(false)} className="text-base font-medium py-3 border-b" style={{ color: '#666666' }}>How It Works</a>
            <a href="#contact" onClick={() => setMobileMenuOpen(false)} className="text-base font-medium py-3 border-b" style={{ color: '#666666' }}>Contact</a>
            <Link href="/auth/login" className="px-5 py-3 rounded-xl text-center font-medium" style={{ color: '#E84E0F', border: '1px solid #E84E0F' }}>
              Login
            </Link>
            <Link href="/auth/register" className="px-5 py-3 rounded-xl text-center font-medium text-white" style={{ backgroundColor: '#E84E0F' }}>
              Get Started
            </Link>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="flex flex-col items-center text-center px-4 sm:px-8 py-16 sm:py-24 lg:py-28"
        style={{ background: 'linear-gradient(180deg, #FFFFFF 0%, #F5F7FA 100%)' }}>
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold mb-6 animate-pulse"
          style={{ backgroundColor: '#FEF0EB', color: '#E84E0F' }}>
          <FontAwesomeIcon icon={faRocket} className="text-sm" />
          <span>The #1 Shop Management Platform in Sri Lanka</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-6 leading-tight max-w-3xl" style={{ color: '#1A1A2E' }}>
          Manage Your Shop<br />
          <span style={{ color: '#E84E0F' }}>Smarter</span>,{' '}
          <span style={{ color: '#2A7F8A' }}>Faster</span> & Easier
        </h1>
        <p className="text-base sm:text-lg max-w-2xl mb-10 leading-relaxed px-4" style={{ color: '#666666' }}>
          ZniyerBuy Shop Manager helps you manage products, deals, and your shop profile all in one beautiful dashboard. Built for Sri Lankan shop owners.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto px-4">
          <Link href="/auth/register"
            className="px-8 py-4 rounded-xl text-base font-bold text-white transition hover:opacity-90 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            style={{ backgroundColor: '#E84E0F' }}>
            Start Managing Free
            <FontAwesomeIcon icon={faCheckCircle} className="ml-2" />
          </Link>
          <Link href="/auth/login"
            className="px-8 py-4 rounded-xl text-base font-bold transition hover:shadow-md"
            style={{ backgroundColor: '#FFFFFF', color: '#1A1A2E', border: '1px solid #E8ECF0' }}>
            Login to Dashboard
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 lg:gap-12 mt-16 sm:mt-20 max-w-2xl w-full px-4">
          {[
            { value: '500+', label: 'Shop Owners', icon: faStore },
            { value: '10K+', label: 'Products Managed', icon: faBox },
            { value: '2K+', label: 'Active Deals', icon: faFire },
          ].map((stat, i) => (
            <div key={i} className="text-center p-6 rounded-2xl shadow-sm hover:shadow-md transition transform hover:-translate-y-1"
              style={{ backgroundColor: '#FFFFFF', border: '1px solid #E8ECF0' }}>
              <FontAwesomeIcon icon={stat.icon} className="text-4xl mb-3" style={{ color: '#E84E0F' }} />
              <p className="text-3xl font-extrabold" style={{ color: '#E84E0F' }}>{stat.value}</p>
              <p className="text-sm mt-1" style={{ color: '#888888' }}>{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="px-4 sm:px-8 lg:px-12 py-16 sm:py-20" style={{ backgroundColor: '#FFFFFF' }}>
        <div className="text-center mb-12 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold mb-4"
            style={{ backgroundColor: '#E8F4F5', color: '#2A7F8A' }}>
            <FontAwesomeIcon icon={faChartLine} />
            <span>Powerful Features</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold px-4" style={{ color: '#1A1A2E' }}>
            Everything You Need to Run Your Shop
          </h2>
          <p className="text-sm sm:text-base mt-3 max-w-xl mx-auto px-4" style={{ color: '#666666' }}>
            Powerful features designed specifically for shop owners in Sri Lanka
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
          {[
            { icon: faBox, title: 'Product Management', desc: 'Add, edit, and delete products easily. Track stock levels and get low stock alerts instantly.', color: '#FEF0EB', iconColor: '#E84E0F' },
            { icon: faTags, title: 'Deals & Promotions', desc: 'Create exciting deals and discounts for your customers. Set start and end dates automatically.', color: '#E8F4F5', iconColor: '#2A7F8A' },
            { icon: faStore, title: 'Shop Profile', desc: 'Manage your shop details, opening hours, location and contact information all in one place.', color: '#FEF0EB', iconColor: '#E84E0F' },
            { icon: faChartBar, title: 'Dashboard Analytics', desc: 'Get a clear overview of your products, deals, views and revenue at a glance.', color: '#E8F4F5', iconColor: '#2A7F8A' },
            { icon: faLock, title: 'Secure Login', desc: 'Firebase-powered authentication keeps your shop data safe and secure at all times.', color: '#FEF0EB', iconColor: '#E84E0F' },
            { icon: faMobileAlt, title: 'Mobile Friendly', desc: 'Access your shop dashboard from any device — desktop, tablet, or mobile.', color: '#E8F4F5', iconColor: '#2A7F8A' },
          ].map((feature, i) => (
            <div key={i} className="rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 group transform hover:-translate-y-1"
              style={{ backgroundColor: '#FFFFFF', border: '1px solid #E8ECF0' }}>
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110"
                style={{ backgroundColor: feature.color }}>
                <FontAwesomeIcon icon={feature.icon} className="text-2xl" style={{ color: feature.iconColor }} />
              </div>
              <h3 className="text-base font-bold mb-2" style={{ color: '#1A1A2E' }}>{feature.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: '#666666' }}>{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="px-4 sm:px-8 lg:px-12 py-16 sm:py-20" style={{ backgroundColor: '#F5F7FA' }}>
        <div className="text-center mb-12 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold mb-4"
            style={{ backgroundColor: '#FEF0EB', color: '#E84E0F' }}>
            <FontAwesomeIcon icon={faCheckCircle} />
            <span>Simple Process</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold px-4" style={{ color: '#1A1A2E' }}>How It Works</h2>
          <p className="text-sm sm:text-base mt-3 px-4" style={{ color: '#666666' }}>Get started in just 3 simple steps</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-5xl mx-auto">
          {[
            { step: '01', title: 'Create Account', desc: 'Register with your email and set up your shop owner profile in minutes.', icon: faPen },
            { step: '02', title: 'Setup Your Shop', desc: 'Add your shop details, upload products, and create your first deal easily.', icon: faStore },
            { step: '03', title: 'Manage & Grow', desc: 'Track your performance and manage everything from your beautiful dashboard.', icon: faChartLine },
          ].map((item, i) => (
            <div key={i} className="rounded-2xl p-8 text-center shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
              style={{ backgroundColor: '#FFFFFF', border: '1px solid #E8ECF0' }}>
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 transition-transform hover:scale-110"
                style={{ backgroundColor: '#FEF0EB' }}>
                <FontAwesomeIcon icon={item.icon} className="text-3xl" style={{ color: '#E84E0F' }} />
              </div>
              <div className="text-5xl font-extrabold mb-3" style={{ color: '#F0F0F0' }}>{item.step}</div>
              <h3 className="text-base font-bold mb-2" style={{ color: '#1A1A2E' }}>{item.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: '#666666' }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 sm:px-8 lg:px-12 py-16 sm:py-20 text-center"
        style={{ backgroundColor: '#E84E0F' }}>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-4 px-4">
          Ready to Grow Your Shop?
          <FontAwesomeIcon icon={faRocket} className="ml-2" />
        </h2>
        <p className="text-sm sm:text-base mb-8 text-white opacity-90 max-w-xl mx-auto px-4">
          Join hundreds of shop owners already using ZniyerBuy Shop Manager to manage their business smarter.
        </p>
        <Link href="/auth/register"
          className="px-8 sm:px-10 py-4 rounded-xl text-base font-bold transition hover:opacity-90 shadow-lg inline-block hover:shadow-xl transform hover:-translate-y-0.5"
          style={{ backgroundColor: '#FFFFFF', color: '#E84E0F' }}>
          Get Started for Free
          <FontAwesomeIcon icon={faCheckCircle} className="ml-2" />
        </Link>
      </section>

      {/* Contact Section */}
      <section id="contact" className="px-4 sm:px-8 lg:px-12 py-16 sm:py-20" style={{ backgroundColor: '#FFFFFF' }}>
        <div className="text-center mb-12 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold mb-4"
            style={{ backgroundColor: '#E8F4F5', color: '#2A7F8A' }}>
            <FontAwesomeIcon icon={faPhone} />
            <span>Get In Touch</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold px-4" style={{ color: '#1A1A2E' }}>Contact Us</h2>
          <p className="text-sm sm:text-base mt-3 px-4" style={{ color: '#666666' }}>We&apos;re here to help you anytime</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-5xl mx-auto">
          {[
            { icon: faPhone, title: 'Phone', value: '0719876542', sub: 'Mon-Fri, 8AM - 6PM', color: '#FEF0EB', iconColor: '#E84E0F' },
            { icon: faEnvelope, title: 'Email', value: 'zniyerbuy@gmail.com', sub: 'We reply within 24 hours', color: '#E8F4F5', iconColor: '#2A7F8A' },
            { icon: faMapMarkerAlt, title: 'Location', value: 'No 21, Galle Fort', sub: 'Galle, Sri Lanka', color: '#FEF0EB', iconColor: '#E84E0F' },
          ].map((contact, i) => (
            <div key={i} className="rounded-2xl p-8 text-center shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
              style={{ backgroundColor: '#F5F7FA', border: '1px solid #E8ECF0' }}>
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 transition-transform hover:scale-110"
                style={{ backgroundColor: contact.color }}>
                <FontAwesomeIcon icon={contact.icon} className="text-2xl" style={{ color: contact.iconColor }} />
              </div>
              <h3 className="text-base font-bold mb-2" style={{ color: '#1A1A2E' }}>{contact.title}</h3>
              <p className="text-base font-semibold break-words" style={{ color: '#E84E0F' }}>{contact.value}</p>
              <p className="text-xs mt-1" style={{ color: '#888888' }}>{contact.sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer style={{ backgroundColor: '#1A1A2E' }}>
        <div className="px-4 sm:px-8 lg:px-12 py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">

            {/* Brand */}
            <div className="col-span-1 sm:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <Image src="/logo.png" alt="ZniyerBuy" width={40} height={40} />
                <h1 className="text-xl font-extrabold">
                  <span style={{ color: '#E84E0F' }}>ZNIYER</span>
                  <span style={{ color: '#2A7F8A' }}> BuY</span>
                </h1>
              </div>
              <p className="text-sm leading-relaxed max-w-xs" style={{ color: '#888888' }}>
                Bringing the cart to your doorstep. The smartest way to manage your shop in Sri Lanka.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-sm font-bold text-white mb-4">Quick Links</h3>
              <div className="space-y-2">
                {['Features', 'How It Works', 'Contact'].map((link) => (
                  <a key={link} href={`#${link.toLowerCase().replace(' ', '-')}`}
                    className="block text-sm hover:text-[#E84E0F] transition"
                    style={{ color: '#888888' }}>{link}</a>
                ))}
              </div>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="text-sm font-bold text-white mb-4">Contact</h3>
              <div className="space-y-2">
                <p className="text-sm flex items-center gap-2" style={{ color: '#888888' }}>
                  <FontAwesomeIcon icon={faPhone} style={{ color: '#2A7F8A' }} />
                  0719876542
                </p>
                <p className="text-sm flex items-center gap-2 break-all" style={{ color: '#888888' }}>
                  <FontAwesomeIcon icon={faEnvelope} style={{ color: '#2A7F8A' }} />
                  zniyerbuy@gmail.com
                </p>
                <p className="text-sm flex items-center gap-2" style={{ color: '#888888' }}>
                  <FontAwesomeIcon icon={faMapMarkerAlt} style={{ color: '#2A7F8A' }} />
                  No 21, Galle Fort
                </p>
              </div>
            </div>

          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4"
            style={{ borderTop: '1px solid #333333' }}>
            <p className="text-sm text-center sm:text-left" style={{ color: '#888888' }}>
              © 2026 ZniyerBuy. All rights reserved.
            </p>
            <p className="text-sm flex items-center gap-2" style={{ color: '#888888' }}>
              <FontAwesomeIcon icon={faShoppingCart} style={{ color: '#E84E0F' }} />
              Bringing the cart to your doorstep
            </p>
          </div>
        </div>
      </footer>

    </div>
  );
}
