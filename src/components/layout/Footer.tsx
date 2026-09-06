import Link from 'next/link';

export function Footer() {
  return (
    <footer className="relative mt-32 border-t border-cream-100/10 bg-earth-900/50">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-saffron-500/40 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <img src="/assets/logo.svg" alt="GauBharath" className="w-12 h-12" />
              <div>
                <div className="font-serif text-2xl text-cream-50">GauBharath</div>
                <div className="text-saffron-400 text-xs tracking-[0.3em] uppercase">ಗೋಭಾರತ್</div>
              </div>
            </div>
            <p className="text-cream-200/70 text-sm max-w-md leading-relaxed">
              A sacred endeavour in Gau Seva and Gau Preethi — rooted in tradition, offered with love.
              Every product carries the blessing of Go-Matha.
            </p>
          </div>

          <div>
            <h3 className="font-serif text-cream-50 text-sm tracking-wider uppercase mb-4">Explore</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/shop" className="text-cream-200/70 hover:text-saffron-400 transition-colors">Shop</Link></li>
              <li><Link href="/about" className="text-cream-200/70 hover:text-saffron-400 transition-colors">About</Link></li>
              <li><Link href="/thoughts" className="text-cream-200/70 hover:text-saffron-400 transition-colors">Thoughts</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-serif text-cream-50 text-sm tracking-wider uppercase mb-4">Visit Us</h3>
            <ul className="space-y-2 text-sm text-cream-200/70">
              <li>Maarigudi Road, Mangaluru</li>
              <li>575014, Karnataka, India</li>
              <li className="text-forest-300">Open 24 hours</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-cream-100/10 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-cream-200/50">
          <div>© {new Date().getFullYear()} GauBharath. All rights reserved.</div>
          <div className="flex items-center gap-2">
            <span className="text-saffron-400">ॐ</span>
            <span>Go-Matha Seva</span>
            <span className="text-saffron-400">ॐ</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
