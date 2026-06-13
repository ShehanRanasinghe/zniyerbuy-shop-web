import Link from 'next/link';
import Image from 'next/image';

export default function HomePage() {
  return (
    <div style={{ backgroundColor: '#F5F7FA', minHeight: '100vh' }}>

      {/* Navbar */}
      <nav className="flex items-center justify-between px-12 py-4 sticky top-0 z-50 shadow-sm"
        style={{ backgroundColor: '#FFFFFF', borderBottom: '1px solid #E8ECF0' }}>
        <div className="flex items-center gap-3">
          <Image src="/logo.png" alt="ZniyerBuy" width={45} height={45} />
          <h1 className="text-xl font-extrabold tracking-wide">
            <span style={{ color: '#E84E0F' }}>ZNIYER</span>
            <span style={{ color: '#2A7F8A' }}> BuY</span>
          </h1>
        </div>
        <div className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-sm font-medium hover:opacity-70" style={{ color: '#666666' }}>Features</a>
          <a href="#how-it-works" className="text-sm font-medium hover:opacity-70" style={{ color: '#666666' }}>How It Works</a>
          <a href="#contact" className="text-sm font-medium hover:opacity-70" style={{ color: '#666666' }}>Contact</a>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/auth/login"
            className="px-5 py-2 rounded-xl text-sm font-medium transition hover:opacity-80"
            style={{ color: '#E84E0F', border: '1px solid #E84E0F' }}>
            Login
          </Link>
          <Link href="/auth/register"
            className="px-5 py-2 rounded-xl text-sm font-medium text-white transition hover:opacity-90"
            style={{ backgroundColor: '#E84E0F' }}>
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex flex-col items-center text-center px-8 py-28"
        style={{ background: 'linear-gradient(180deg, #FFFFFF 0%, #F5F7FA 100%)' }}>
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold mb-6"
          style={{ backgroundColor: '#FEF0EB', color: '#E84E0F' }}>
          🚀 The #1 Shop Management Platform in Sri Lanka
        </div>
        <h1 className="text-5xl font-extrabold mb-6 leading-tight max-w-3xl" style={{ color: '#1A1A2E' }}>
          Manage Your Shop<br />
          <span style={{ color: '#E84E0F' }}>Smarter</span>,{' '}
          <span style={{ color: '#2A7F8A' }}>Faster</span> & Easier
        </h1>
        <p className="text-lg max-w-2xl mb-10 leading-relaxed" style={{ color: '#666666' }}>
          ZniyerBuy Shop Manager helps you manage products, deals, and your shop profile all in one beautiful dashboard. Built for Sri Lankan shop owners.
        </p>
        <div className="flex gap-4 flex-wrap justify-center">
          <Link href="/auth/register"
            className="px-8 py-4 rounded-xl text-base font-bold text-white transition hover:opacity-90 shadow-lg"
            style={{ backgroundColor: '#E84E0F' }}>
            Start Managing Free →
          </Link>
          <Link href="/auth/login"
            className="px-8 py-4 rounded-xl text-base font-bold transition hover:opacity-80"
            style={{ backgroundColor: '#FFFFFF', color: '#1A1A2E', border: '1px solid #E8ECF0' }}>
            Login to Dashboard
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-12 mt-20 max-w-2xl w-full">
          {[
            { value: '500+', label: 'Shop Owners', icon: '🏪' },
            { value: '10K+', label: 'Products Managed', icon: '📦' },
            { value: '2K+', label: 'Active Deals', icon: '🏷️' },
          ].map((stat, i) => (
            <div key={i} className="text-center p-6 rounded-2xl shadow-sm"
              style={{ backgroundColor: '#FFFFFF', border: '1px solid #E8ECF0' }}>
              <p className="text-3xl mb-2">{stat.icon}</p>
              <p className="text-3xl font-extrabold" style={{ color: '#E84E0F' }}>{stat.value}</p>
              <p className="text-sm mt-1" style={{ color: '#888888' }}>{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="px-12 py-20" style={{ backgroundColor: '#FFFFFF' }}>
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold mb-4"
            style={{ backgroundColor: '#E8F4F5', color: '#2A7F8A' }}>
            ✨ Powerful Features
          </div>
          <h2 className="text-3xl font-extrabold" style={{ color: '#1A1A2E' }}>
            Everything You Need to Run Your Shop
          </h2>
          <p className="text-base mt-3 max-w-xl mx-auto" style={{ color: '#666666' }}>
            Powerful features designed specifically for shop owners in Sri Lanka
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {[
            { icon: '📦', title: 'Product Management', desc: 'Add, edit, and delete products easily. Track stock levels and get low stock alerts instantly.', color: '#FEF0EB' },
            { icon: '🏷️', title: 'Deals & Promotions', desc: 'Create exciting deals and discounts for your customers. Set start and end dates automatically.', color: '#E8F4F5' },
            { icon: '🏪', title: 'Shop Profile', desc: 'Manage your shop details, opening hours, location and contact information all in one place.', color: '#FEF0EB' },
            { icon: '📊', title: 'Dashboard Analytics', desc: 'Get a clear overview of your products, deals, views and revenue at a glance.', color: '#E8F4F5' },
            { icon: '🔐', title: 'Secure Login', desc: 'Firebase-powered authentication keeps your shop data safe and secure at all times.', color: '#FEF0EB' },
            { icon: '📱', title: 'Mobile Friendly', desc: 'Access your shop dashboard from any device — desktop, tablet, or mobile.', color: '#E8F4F5' },
          ].map((feature, i) => (
            <div key={i} className="rounded-2xl p-6 shadow-sm hover:shadow-md transition group"
              style={{ backgroundColor: '#FFFFFF', border: '1px solid #E8ECF0' }}>
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl mb-4"
                style={{ backgroundColor: feature.color }}>
                {feature.icon}
              </div>
              <h3 className="text-base font-bold mb-2" style={{ color: '#1A1A2E' }}>{feature.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: '#666666' }}>{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="px-12 py-20" style={{ backgroundColor: '#F5F7FA' }}>
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold mb-4"
            style={{ backgroundColor: '#FEF0EB', color: '#E84E0F' }}>
            🎯 Simple Process
          </div>
          <h2 className="text-3xl font-extrabold" style={{ color: '#1A1A2E' }}>How It Works</h2>
          <p className="text-base mt-3" style={{ color: '#666666' }}>Get started in just 3 simple steps</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {[
            { step: '01', title: 'Create Account', desc: 'Register with your email and set up your shop owner profile in minutes.', icon: '✍️' },
            { step: '02', title: 'Setup Your Shop', desc: 'Add your shop details, upload products, and create your first deal easily.', icon: '🏪' },
            { step: '03', title: 'Manage & Grow', desc: 'Track your performance and manage everything from your beautiful dashboard.', icon: '📈' },
          ].map((item, i) => (
            <div key={i} className="rounded-2xl p-8 text-center shadow-sm hover:shadow-md transition"
              style={{ backgroundColor: '#FFFFFF', border: '1px solid #E8ECF0' }}>
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4"
                style={{ backgroundColor: '#FEF0EB' }}>{item.icon}</div>
              <div className="text-5xl font-extrabold mb-3" style={{ color: '#F0F0F0' }}>{item.step}</div>
              <h3 className="text-base font-bold mb-2" style={{ color: '#1A1A2E' }}>{item.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: '#666666' }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-12 py-20 text-center"
        style={{ backgroundColor: '#E84E0F' }}>
        <h2 className="text-3xl font-extrabold text-white mb-4">
          Ready to Grow Your Shop? 🚀
        </h2>
        <p className="text-base mb-8 text-white opacity-90 max-w-xl mx-auto">
          Join hundreds of shop owners already using ZniyerBuy Shop Manager to manage their business smarter.
        </p>
        <Link href="/auth/register"
          className="px-10 py-4 rounded-xl text-base font-bold transition hover:opacity-90 shadow-lg inline-block"
          style={{ backgroundColor: '#FFFFFF', color: '#E84E0F' }}>
          Get Started for Free →
        </Link>
      </section>

      {/* Contact Section */}
      <section id="contact" className="px-12 py-20" style={{ backgroundColor: '#FFFFFF' }}>
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold mb-4"
            style={{ backgroundColor: '#E8F4F5', color: '#2A7F8A' }}>
            📞 Get In Touch
          </div>
          <h2 className="text-3xl font-extrabold" style={{ color: '#1A1A2E' }}>Contact Us</h2>
          <p className="text-base mt-3" style={{ color: '#666666' }}>We're here to help you anytime</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {[
            { icon: '📞', title: 'Phone', value: '0719876542', sub: 'Mon-Fri, 8AM - 6PM', color: '#FEF0EB' },
            { icon: '📧', title: 'Email', value: 'zniyerbuy@gmail.com', sub: 'We reply within 24 hours', color: '#E8F4F5' },
            { icon: '📍', title: 'Location', value: 'No 21, Galle Fort', sub: 'Galle, Sri Lanka', color: '#FEF0EB' },
          ].map((contact, i) => (
            <div key={i} className="rounded-2xl p-8 text-center shadow-sm hover:shadow-md transition"
              style={{ backgroundColor: '#F5F7FA', border: '1px solid #E8ECF0' }}>
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4"
                style={{ backgroundColor: contact.color }}>
                {contact.icon}
              </div>
              <h3 className="text-base font-bold mb-2" style={{ color: '#1A1A2E' }}>{contact.title}</h3>
              <p className="text-base font-semibold" style={{ color: '#E84E0F' }}>{contact.value}</p>
              <p className="text-xs mt-1" style={{ color: '#888888' }}>{contact.sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer style={{ backgroundColor: '#1A1A2E' }}>
        <div className="px-12 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">

            {/* Brand */}
            <div className="col-span-1 md:col-span-2">
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
                    className="block text-sm hover:opacity-80 transition"
                    style={{ color: '#888888' }}>{link}</a>
                ))}
              </div>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="text-sm font-bold text-white mb-4">Contact</h3>
              <div className="space-y-2">
                <p className="text-sm" style={{ color: '#888888' }}>📞 0719876542</p>
                <p className="text-sm" style={{ color: '#888888' }}>📧 zniyerbuy@gmail.com</p>
                <p className="text-sm" style={{ color: '#888888' }}>📍 No 21, Galle Fort</p>
              </div>
            </div>

          </div>

          <div className="pt-8 flex items-center justify-between flex-wrap gap-4"
            style={{ borderTop: '1px solid #333333' }}>
            <p className="text-sm" style={{ color: '#888888' }}>
              © 2026 ZniyerBuy. All rights reserved.
            </p>
            <p className="text-sm" style={{ color: '#888888' }}>
              🛒 Bringing the cart to your doorstep
            </p>
          </div>
        </div>
      </footer>

    </div>
  );
}