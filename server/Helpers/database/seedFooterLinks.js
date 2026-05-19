import FooterLink from "../../Models/FooterLink.js";

const DEFAULT_LINKS = [
    // 1. About Us
    {
        title: "About Us",
        category: "About Us",
        order: 0,
        content: `<div class="space-y-6">
    <div class="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 p-6 rounded-3xl border border-emerald-500/20 text-center">
      <div class="w-12 h-12 bg-emerald-500/20 text-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-3">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
      </div>
      <h3 class="text-xl font-bold text-foreground">Welcome to Dosro Bazar</h3>
      <p class="text-sm text-muted-foreground mt-2 leading-relaxed">
        Nepal's trusted community marketplace for buying, selling, and bidding on quality items. 
        We are building the future of local commerce by enabling individuals and businesses to connect seamlessly.
      </p>
    </div>

    <div class="grid grid-cols-3 gap-4">
      <div class="p-4 bg-card border rounded-2xl text-center hover:border-emerald-500/30 transition-all">
        <h4 class="text-2xl font-black text-emerald-500">50K+</h4>
        <p class="text-[10px] uppercase tracking-wider text-muted-foreground font-bold mt-1">Active Users</p>
      </div>
      <div class="p-4 bg-card border rounded-2xl text-center hover:border-emerald-500/30 transition-all">
        <h4 class="text-2xl font-black text-emerald-500">100K+</h4>
        <p class="text-[10px] uppercase tracking-wider text-muted-foreground font-bold mt-1">Listed Items</p>
      </div>
      <div class="p-4 bg-card border rounded-2xl text-center hover:border-emerald-500/30 transition-all">
        <h4 class="text-2xl font-black text-emerald-500">10K+</h4>
        <p class="text-[10px] uppercase tracking-wider text-muted-foreground font-bold mt-1">Closed Bids</p>
      </div>
    </div>

    <div class="space-y-3">
      <h4 class="text-sm font-bold text-foreground uppercase tracking-widest text-slate-400">Our Core Pillars</h4>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
        <div class="flex gap-3 items-start bg-slate-50 dark:bg-slate-900/40 p-3 rounded-2xl border">
          <svg class="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          <div>
            <span class="font-bold text-foreground block mb-0.5">Trust & Verification</span>
            Every user profile can request verification. We keep our community clean and secure.
          </div>
        </div>
        <div class="flex gap-3 items-start bg-slate-50 dark:bg-slate-900/40 p-3 rounded-2xl border">
          <svg class="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          <div>
            <span class="font-bold text-foreground block mb-0.5">Circular Sustainability</span>
            Giving second-hand products a second life reduces waste and benefits local economies.
          </div>
        </div>
      </div>
    </div>
</div>`
    },
    // 2. Careers
    {
        title: "Careers",
        category: "About Us",
        order: 1,
        content: `<div class="space-y-6">
    <div class="bg-gradient-to-r from-purple-500/10 to-indigo-500/10 p-6 rounded-3xl border border-purple-500/20 text-center">
      <div class="w-12 h-12 bg-purple-500/20 text-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-3">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
      </div>
      <h3 class="text-xl font-bold text-foreground">Build the Future with Us</h3>
      <p class="text-sm text-muted-foreground mt-2 leading-relaxed">
        Join our passionate team of builders, creators, and engineers who are reshaping the way peer-to-peer commerce works in Nepal.
      </p>
    </div>
    <div class="space-y-3">
      <h4 class="text-sm font-bold text-foreground uppercase tracking-widest text-slate-400">Current Openings</h4>
      <div class="space-y-2">
        <div class="p-4 bg-card border rounded-2xl flex justify-between items-center">
          <div>
            <span class="text-[10px] font-bold px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded-full text-muted-foreground uppercase">Engineering</span>
            <h5 class="text-sm font-bold mt-1">Senior Frontend Engineer (Next.js)</h5>
            <p class="text-xs text-muted-foreground">Kathmandu / Remote</p>
          </div>
          <span class="text-xs font-semibold px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full">Full-Time</span>
        </div>
      </div>
    </div>
</div>`
    },
    // 3. Press
    {
        title: "Press",
        category: "About Us",
        order: 2,
        content: `<div class="space-y-6">
    <div class="bg-gradient-to-r from-blue-500/10 to-indigo-500/10 p-6 rounded-3xl border border-blue-500/20 text-center">
      <div class="w-12 h-12 bg-blue-500/20 text-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-3">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"></path></svg>
      </div>
      <h3 class="text-xl font-bold text-foreground">Press & Media</h3>
      <p class="text-sm text-muted-foreground mt-2 leading-relaxed">
        Read our latest press releases, official corporate announcements, and media statements.
      </p>
    </div>
</div>`
    },
    // 4. Blog
    {
        title: "Blog",
        category: "About Us",
        order: 3,
        content: `<div class="space-y-6">
    <div class="bg-gradient-to-r from-pink-500/10 to-rose-500/10 p-6 rounded-3xl border border-pink-500/20 text-center">
      <div class="w-12 h-12 bg-pink-500/20 text-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-3">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.24 0 4.5.747m0-13.494C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.242.477-4.5.747"></path></svg>
      </div>
      <h3 class="text-xl font-bold text-foreground">Dosro Bazar Blog</h3>
      <p class="text-sm text-muted-foreground mt-2">
        Stay updated with marketplace insights, trading safety tutorials, and smart pricing guides.
      </p>
    </div>
</div>`
    },
    // 5. Help Center
    {
        title: "Help Center",
        category: "Help Center",
        order: 0,
        content: `<div class="space-y-6">
    <div class="bg-gradient-to-r from-cyan-500/10 to-teal-500/10 p-6 rounded-3xl border border-cyan-500/20 text-center">
      <div class="w-12 h-12 bg-cyan-500/20 text-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-3">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
      </div>
      <h3 class="text-xl font-bold text-foreground">How can we support you today?</h3>
      <p class="text-sm text-muted-foreground mt-2 leading-relaxed">
        Find guides, tutorials, or contact customer support.
      </p>
    </div>
</div>`
    },
    // 6. Safety Tips
    {
        title: "Safety Tips",
        category: "Help Center",
        order: 1,
        content: `<div class="space-y-6">
    <div class="bg-gradient-to-r from-orange-500/10 to-amber-500/10 p-6 rounded-3xl border border-orange-500/20 text-center">
      <div class="w-12 h-12 bg-orange-500/20 text-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-3">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
      </div>
      <h3 class="text-xl font-bold text-foreground">Safety & Fraud Prevention</h3>
      <p class="text-sm text-muted-foreground mt-2 leading-relaxed">
        Your safety is our top priority. Please review our safety guidelines to prevent fraud during physical handovers or payments.
      </p>
    </div>
</div>`
    },
    // 7. Contact Us
    {
        title: "Contact Us",
        category: "Help Center",
        order: 2,
        content: `contact_us_form` // Handled programmatically via Form in UI
    },
    // 8. FAQs
    {
        title: "FAQs",
        category: "Help Center",
        order: 3,
        content: `faqs_accordion` // Handled programmatically via Accordion in UI
    },
    // 9. Terms of Service
    {
        title: "Terms of Service",
        category: "Terms of Service",
        order: 0,
        content: `<div class="space-y-4 text-xs text-muted-foreground leading-relaxed">
    <h4 class="text-sm font-bold text-foreground">1. User Agreement</h4>
    <p>By registering, logging in, or using Dosro Bazar, you agree to comply with and be bound by these Terms of Service. If you do not accept these conditions, you must immediately terminate use of our marketplace platform.</p>
    <h4 class="text-sm font-bold text-foreground">2. Listing Regulations</h4>
    <p>Sellers must describe items accurately. Prohibited items include contraband, weapons, stolen objects, counterfeit products, and prescription drugs.</p>
</div>`
    },
    // 10. Privacy Policy
    {
        title: "Privacy Policy",
        category: "Terms of Service",
        order: 1,
        content: `<div class="space-y-4 text-xs text-muted-foreground leading-relaxed">
    <h4 class="text-sm font-bold text-foreground">1. Collection of Information</h4>
    <p>We collect personal identifiers such as name, email, phone number, address, and verification credentials. Transaction details and device info are tracked to keep services secure.</p>
</div>`
    },
    // 11. Cookie Policy
    {
        title: "Cookie Policy",
        category: "Terms of Service",
        order: 2,
        content: `<div class="space-y-4 text-xs text-muted-foreground leading-relaxed">
    <h4 class="text-sm font-bold text-foreground">What are Cookies?</h4>
    <p>Cookies are tiny files stored on devices when visiting websites. They remember sessions, language configurations, and analytics logs to keep services functioning smoothly.</p>
</div>`
    }
];

const seedFooterLinks = async () => {
    try {
        const count = await FooterLink.countDocuments();
        if (count === 0) {
            console.log("[Seed] No footer links found. Seeding default footer links...");
            await FooterLink.insertMany(DEFAULT_LINKS);
            console.log(`[Seed] Successfully seeded ${DEFAULT_LINKS.length} default footer links!`);
        } else {
            console.log(`[Seed] Footer links already exist (${count} items). Skipping seed.`);
        }
    } catch (error) {
        console.error("[Seed] Error seeding footer links:", error.message);
    }
};

export default seedFooterLinks;
