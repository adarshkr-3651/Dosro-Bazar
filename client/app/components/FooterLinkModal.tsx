"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog";
import {
  Store,
  CheckCircle2,
  Briefcase,
  Sparkles,
  Newspaper,
  BookOpen,
  HelpCircle,
  ShoppingCart,
  ShieldCheck,
  ShieldAlert,
  Mail,
  Phone,
  MapPin,
  ChevronDown,
  Loader2,
} from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  pageKey: string | null;
  links?: { title: string; content: string }[];
}

// 1. About Us Content Component
const AboutUsContent = () => (
  <div className="space-y-6 animate-in fade-in duration-300">
    <div className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 p-6 rounded-3xl border border-emerald-500/20 text-center">
      <div className="w-12 h-12 bg-emerald-500/20 text-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-3">
        <Store className="w-6 h-6" />
      </div>
      <h3 className="text-xl font-bold text-foreground">Welcome to Dosro Bazar</h3>
      <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
        Nepal's trusted community marketplace for buying, selling, and bidding on quality items.
        We are building the future of local commerce by enabling individuals and businesses to connect seamlessly.
      </p>
    </div>

    <div className="grid grid-cols-3 gap-4">
      <div className="p-4 bg-card border rounded-2xl text-center hover:scale-105 hover:border-emerald-500/30 transition-all">
        <h4 className="text-2xl font-black text-emerald-500">50K+</h4>
        <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold mt-1">Active Users</p>
      </div>
      <div className="p-4 bg-card border rounded-2xl text-center hover:scale-105 hover:border-emerald-500/30 transition-all">
        <h4 className="text-2xl font-black text-emerald-500">100K+</h4>
        <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold mt-1">Listed Items</p>
      </div>
      <div className="p-4 bg-card border rounded-2xl text-center hover:scale-105 hover:border-emerald-500/30 transition-all">
        <h4 className="text-2xl font-black text-emerald-500">10K+</h4>
        <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold mt-1">Closed Bids</p>
      </div>
    </div>

    <div className="space-y-3">
      <h4 className="text-sm font-bold text-foreground uppercase tracking-widest text-slate-400">Our Core Pillars</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
        <div className="flex gap-3 items-start bg-slate-50 dark:bg-slate-900 p-3 rounded-2xl border">
          <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-foreground block mb-0.5">Trust & Verification</span>
            Every user profile can request verification. We keep our community clean and secure.
          </div>
        </div>
        <div className="flex gap-3 items-start bg-slate-50 dark:bg-slate-900 p-3 rounded-2xl border">
          <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-foreground block mb-0.5">Circular Sustainability</span>
            Giving second-hand products a second life reduces waste and benefits local economies.
          </div>
        </div>
        <div className="flex gap-3 items-start bg-slate-50 dark:bg-slate-900 p-3 rounded-2xl border">
          <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-foreground block mb-0.5">Transparent Auctions</span>
            Our custom bidding technology ensures a fair, market-driven price for every auction item.
          </div>
        </div>
        <div className="flex gap-3 items-start bg-slate-50 dark:bg-slate-900 p-3 rounded-2xl border">
          <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-foreground block mb-0.5">Community Commerce</span>
            Providing a zero-fee listing tier to give everyone in Nepal a voice in digital commerce.
          </div>
        </div>
      </div>
    </div>
  </div>
);

// 2. Careers Content Component
const CareersContent = () => (
  <div className="space-y-6 animate-in fade-in duration-300">
    <div className="bg-gradient-to-r from-purple-500/10 to-indigo-500/10 p-6 rounded-3xl border border-purple-500/20 text-center">
      <div className="w-12 h-12 bg-purple-500/20 text-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-3">
        <Briefcase className="w-6 h-6" />
      </div>
      <h3 className="text-xl font-bold text-foreground">Build the Future with Us</h3>
      <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
        Join our passionate team of builders, creators, and engineers who are reshaping the way peer-to-peer commerce works in Nepal.
      </p>
    </div>

    <div className="space-y-4">
      <h4 className="text-sm font-bold text-foreground uppercase tracking-widest text-slate-400 flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-purple-500" /> Current Openings
      </h4>
      <div className="space-y-3 max-h-[35vh] overflow-y-auto pr-1">
        {[
          { title: "Senior Frontend Engineer (Next.js)", type: "Full-Time", location: "Kathmandu / Remote", dept: "Engineering" },
          { title: "Product Manager (Auctions & Payments)", type: "Full-Time", location: "Kathmandu", dept: "Product" },
          { title: "Marketing & Community Lead", type: "Full-Time", location: "Kathmandu", dept: "Growth" },
          { title: "Customer Success Representative", type: "Part-Time", location: "Remote", dept: "Operations" },
        ].map((job) => (
          <div key={job.title} className="p-4 bg-card border rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-purple-500/40 hover:shadow-md transition-all group">
            <div>
              <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded-full text-muted-foreground uppercase tracking-wider">{job.dept}</span>
              <h5 className="text-sm font-bold text-foreground mt-1 group-hover:text-purple-500 transition-colors">{job.title}</h5>
              <p className="text-xs text-muted-foreground mt-1">{job.location}</p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <span className="text-xs font-semibold px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full">{job.type}</span>
              <button
                onClick={() => alert(`Applying for ${job.title}. In a production app, this will redirect to our careers portal!`)}
                className="text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-xl transition-all shadow-sm active:scale-95"
              >
                Apply
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// 3. Press Content Component
const PressContent = () => (
  <div className="space-y-6 animate-in fade-in duration-300">
    <div className="bg-gradient-to-r from-blue-500/10 to-indigo-500/10 p-6 rounded-3xl border border-blue-500/20 text-center">
      <div className="w-12 h-12 bg-blue-500/20 text-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-3">
        <Newspaper className="w-6 h-6" />
      </div>
      <h3 className="text-xl font-bold text-foreground">Press & Media</h3>
      <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
        Read our latest press releases, official corporate announcements, and media statements.
      </p>
    </div>

    <div className="space-y-4">
      <h4 className="text-sm font-bold text-foreground uppercase tracking-widest text-slate-400">Latest Press Releases</h4>
      <div className="space-y-3 max-h-[35vh] overflow-y-auto pr-1">
        {[
          { title: "Dosro Bazar Passes 100,000 Verified Listings Milestone", date: "May 15, 2026", desc: "Nepal's leading community marketplace announces massive listings milestone, highlighting a rapid growth in green, circular commerce among younger shoppers." },
          { title: "Strategic Integration of Secure Payment Verification Gateways", date: "April 02, 2026", desc: "Dosro Bazar launches new advance reservation and escrow-like payment validations via eSewa and Khalti to counter online transaction scams." },
          { title: "Partnering with Local Circular Initiatives for E-Waste Reduction", date: "February 18, 2026", desc: "A joint collaborative initiative aims to offer zero-cost hardware listings and verification clinics in Kathmandu to safely recycle old electronics." }
        ].map((press) => (
          <div key={press.title} className="p-4 bg-card border rounded-2xl space-y-2 hover:border-blue-500/30 transition-colors">
            <div className="flex justify-between items-center text-xs text-muted-foreground">
              <span className="font-bold text-blue-500">Corporate News</span>
              <span>{press.date}</span>
            </div>
            <h5 className="text-sm font-bold text-foreground hover:text-blue-500 cursor-pointer transition-colors leading-tight">{press.title}</h5>
            <p className="text-xs text-muted-foreground leading-relaxed">{press.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// 4. Blog Content Component
const BlogContent = () => (
  <div className="space-y-6 animate-in fade-in duration-300">
    <div className="bg-gradient-to-r from-pink-500/10 to-rose-500/10 p-6 rounded-3xl border border-pink-500/20 text-center">
      <div className="w-12 h-12 bg-pink-500/20 text-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-3">
        <BookOpen className="w-6 h-6" />
      </div>
      <h3 className="text-xl font-bold text-foreground">Dosro Bazar Blog</h3>
      <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
        Stay updated with marketplace insights, trading safety tutorials, and smart pricing guides.
      </p>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[35vh] overflow-y-auto pr-1">
      {[
        { title: "10 Tips to Sell Your Old Phone in 24 Hours", read: "5 min read", cat: "Seller Tips", date: "May 19, 2026", desc: "Taking clean photos from multiple angles, writing specs, and setting a reasonable auction starting bid can triple your response rate." },
        { title: "Winning Auction Bidding Strategies Revealed", read: "4 min read", cat: "Bidding Guides", date: "May 10, 2026", desc: "Understanding the bidding threshold, closing times, and maintaining a high bidding score rating on Dosro Bazar." },
        { title: "Circular Economy in Kathmandu: Why Second-hand is First Class", read: "6 min read", cat: "Green Trade", date: "May 01, 2026", desc: "How Gen-Z and millennials in urban Nepal are leading the wave of sustainable retail by selling pre-owned goods." },
        { title: "Meeting Sellers Safely: The Ultimate Handover Guide", read: "8 min read", cat: "Safety", date: "April 22, 2026", desc: "A checklist of exactly what to check during physical handovers: screen tests, serial number match, and digital wallet security." }
      ].map((post) => (
        <div key={post.title} className="p-4 bg-card border rounded-2xl flex flex-col justify-between hover:border-pink-500/30 hover:shadow-md transition-all group cursor-pointer">
          <div className="space-y-2">
            <div className="flex justify-between items-center text-[10px]">
              <span className="font-bold text-pink-600 dark:text-pink-400 uppercase tracking-widest">{post.cat}</span>
              <span className="text-muted-foreground">{post.read}</span>
            </div>
            <h5 className="text-sm font-bold text-foreground group-hover:text-pink-500 transition-colors leading-tight">{post.title}</h5>
            <p className="text-[11px] text-muted-foreground line-clamp-3 leading-relaxed">{post.desc}</p>
          </div>
          <div className="text-[10px] text-muted-foreground mt-3 font-semibold">{post.date}</div>
        </div>
      ))}
    </div>
  </div>
);

// 5. Help Center Content Component
const HelpCenterContent = () => (
  <div className="space-y-6 animate-in fade-in duration-300">
    <div className="bg-gradient-to-r from-cyan-500/10 to-teal-500/10 p-6 rounded-3xl border border-cyan-500/20 text-center">
      <div className="w-12 h-12 bg-cyan-500/20 text-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-3">
        <HelpCircle className="w-6 h-6" />
      </div>
      <h3 className="text-xl font-bold text-foreground">How can we support you today?</h3>
      <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
        Find self-service articles or contact our support team.
      </p>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {[
        { title: "Getting Started", icon: Sparkles, desc: "Account setup, phone verification, and completing your profile details." },
        { title: "Buying & Bidding Guides", icon: ShoppingCart, desc: "How to bids, chat with sellers, handle escrow, and finalize sales." },
        { title: "Selling & Boost Campaigns", icon: Store, desc: "Listing products, formatting details, and buying ad banner spots." },
        { title: "Security & Account Recovery", icon: ShieldCheck, desc: "Enabling 2FA OTP, reporting scam listings, and fixing lockouts." }
      ].map((cat) => {
        const Icon = cat.icon;
        return (
          <div key={cat.title} className="p-4 bg-card border rounded-2xl flex gap-3 hover:border-cyan-500/30 hover:shadow-md transition-all cursor-pointer">
            <div className="w-10 h-10 bg-cyan-500/15 text-cyan-500 rounded-xl flex items-center justify-center shrink-0">
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <h5 className="text-sm font-bold text-foreground leading-none">{cat.title}</h5>
              <p className="text-[11px] text-muted-foreground mt-1.5 leading-relaxed">{cat.desc}</p>
            </div>
          </div>
        );
      })}
    </div>
  </div>
);

// 6. Safety Tips Content Component
const SafetyTipsContent = () => (
  <div className="space-y-6 animate-in fade-in duration-300">
    <div className="bg-gradient-to-r from-orange-500/10 to-amber-500/10 p-6 rounded-3xl border border-orange-500/20 text-center">
      <div className="w-12 h-12 bg-orange-500/20 text-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-3">
        <ShieldAlert className="w-6 h-6" />
      </div>
      <h3 className="text-xl font-bold text-foreground">Safety & Fraud Prevention</h3>
      <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
        Your safety is our top priority. Please review these essential guidelines to stay secure on the platform.
      </p>
    </div>

    <div className="space-y-3 max-h-[35vh] overflow-y-auto pr-1">
      {[
        { title: "Meet in Highly Public Places", desc: "Always organize item drop-offs or handovers in crowded, well-lit spaces (e.g. coffee shops, shopping centers, or popular junctions). Never meet in secluded spots or private residences." },
        { title: "Verify Product Authenticity & Quality First", desc: "Always inspect physical items carefully before transferring funds. Switch on electrical items, test features, and ask for physical receipts or warranties where possible." },
        { title: "Do Not Prepay Unverified Sellers", desc: "Avoid sending advance bank or digital wallet payments to unverified sellers. If an advance is required, use Dosro Bazar's secure verified advance payment holds." },
        { title: "Guard Your Sensitive OTPs and Logins", desc: "Our administrators will never ask for your account password, email PIN, or transaction OTPs. Keep security info private and enable Two-Factor Authentication." }
      ].map((tip, idx) => (
        <div key={tip.title} className="p-4 bg-slate-50 dark:bg-slate-900 border rounded-2xl flex gap-3">
          <div className="w-6 h-6 bg-orange-500/15 text-orange-500 rounded-full flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
            {idx + 1}
          </div>
          <div>
            <h5 className="text-sm font-bold text-foreground leading-tight">{tip.title}</h5>
            <p className="text-[11px] text-muted-foreground mt-1 leading-relaxed">{tip.desc}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// 7. Contact Us Content Component (Interactive)
const ContactUsContent = () => {
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "success">("idle");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    setStatus("sending");
    setTimeout(() => {
      setStatus("success");
      setFormData({ name: "", email: "", subject: "", message: "" });
    }, 1200);
  };

  if (status === "success") {
    return (
      <div className="py-12 flex flex-col items-center justify-center text-center space-y-4 animate-in zoom-in-95 duration-300">
        <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center animate-bounce">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h4 className="text-xl font-bold text-foreground">Message Sent Successfully!</h4>
        <p className="text-sm text-muted-foreground max-w-sm">
          Thank you for reaching out. A customer support agent will review your query and respond via email within 24 hours.
        </p>
        <button
          onClick={() => setStatus("idle")}
          className="text-xs font-bold bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2.5 rounded-xl transition-all shadow-md shadow-emerald-500/10 active:scale-95"
        >
          Send Another Inquiry
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-6 animate-in fade-in duration-300">
      <div className="md:col-span-2 space-y-5 p-5 bg-slate-50 dark:bg-slate-900 rounded-3xl border flex flex-col justify-between">
        <div className="space-y-3">
          <h4 className="text-sm font-bold text-foreground uppercase tracking-widest text-slate-400">Direct Support</h4>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Have questions about bidding, verification, or ad booking? Write to us, or reach out directly.
          </p>
        </div>
        <div className="space-y-4 text-xs">
          <div className="flex items-center gap-3">
            <Mail className="w-4 h-4 text-emerald-500 shrink-0" />
            <div>
              <p className="font-bold">Email Support</p>
              <p className="text-muted-foreground">support@dosrobazar.com</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Phone className="w-4 h-4 text-emerald-500 shrink-0" />
            <div>
              <p className="font-bold">Hotline</p>
              <p className="text-muted-foreground">+977 1 4423456</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <MapPin className="w-4 h-4 text-emerald-500 shrink-0" />
            <div>
              <p className="font-bold">Head Office</p>
              <p className="text-muted-foreground">Putalisadak, Kathmandu, Nepal</p>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="md:col-span-3 space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Full Name</label>
            <input
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full text-xs p-2.5 rounded-xl bg-card border focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-all text-foreground"
              placeholder="e.g. Ram Shrestha"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Email Address</label>
            <input
              required
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full text-xs p-2.5 rounded-xl bg-card border focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-all text-foreground"
              placeholder="ram@email.com"
            />
          </div>
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Subject</label>
          <input
            value={formData.subject}
            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
            className="w-full text-xs p-2.5 rounded-xl bg-card border focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-all text-foreground"
            placeholder="Topic of discussion"
          />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Message</label>
          <textarea
            required
            rows={4}
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            className="w-full text-xs p-2.5 rounded-xl bg-card border focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-all resize-none text-foreground"
            placeholder="Write details..."
          />
        </div>
        <button
          type="submit"
          disabled={status === "sending"}
          className="w-full text-xs font-bold text-white bg-emerald-500 hover:bg-emerald-600 h-11 rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50 active:scale-95"
        >
          {status === "sending" ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Submitting...
            </>
          ) : (
            "Send Message"
          )}
        </button>
      </form>
    </div>
  );
};

// 8. FAQs Content Component (Accordion)
const FAQsContent = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    { q: "How do I become a verified seller?", a: "Go to your Profile settings, upload a government-issued ID card/citizenship/passport photograph, and click verify. Admin reviews submissions daily." },
    { q: "What happens if I win an auction bid but default?", a: "Auction bids are a committed contract. Failing to pay for a won bid decreases your buyer score and can trigger temporary or permanent account restrictions." },
    { q: "Is listing products 100% free?", a: "Yes, standard listing is free of charge! We only charge fees if you decide to buy premium Boost campaigns (Basic, Standard, Premium) to expand reach." },
    { q: "How does the advance payment hold feature work?", a: "When buying high-value items, you can deposit an advance payment hold via eSewa or Khalti. This confirms your booking commitment, and the funds are held securely until delivery validation." },
    { q: "How can I report suspicious behavior or ads?", a: "Simply open the suspicious listing, and click the 'Report' flag icon. Explain the issue, and our moderation team will investigate within a few hours." }
  ];

  return (
    <div className="space-y-3 max-h-[45vh] overflow-y-auto pr-1 animate-in fade-in duration-300">
      {faqs.map((faq, idx) => {
        const isOpen = openIndex === idx;
        return (
          <div key={idx} className="border rounded-2xl overflow-hidden bg-card transition-all">
            <button
              onClick={() => setOpenIndex(isOpen ? null : idx)}
              className="w-full p-4 flex justify-between items-center text-left font-bold text-sm text-foreground hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
            >
              <span>{faq.q}</span>
              <ChevronDown className={`w-4 h-4 text-muted-foreground shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180 text-emerald-500' : ''}`} />
            </button>
            {isOpen && (
              <div className="p-4 pt-0 border-t text-xs text-muted-foreground leading-relaxed animate-in slide-in-from-top-1 duration-200 bg-slate-50/40 dark:bg-slate-900/30">
                {faq.a}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

// 9. Terms of Service Component
const TermsOfServiceContent = () => (
  <div className="space-y-4 text-xs text-muted-foreground leading-relaxed max-h-[45vh] overflow-y-auto pr-2 animate-in fade-in duration-300">
    <h4 className="text-sm font-bold text-foreground">1. User Agreement</h4>
    <p>
      By registering, logging in, or using Dosro Bazar (the "Service"), you agree to comply with and be bound by these Terms of Service. If you do not accept these conditions, you must immediately terminate use of our marketplace platform.
    </p>
    <h4 className="text-sm font-bold text-foreground">2. Account Information & Verification</h4>
    <p>
      To place bids, book ads, or message sellers, users must register. You represent that all uploaded ID proofs and verification credentials are authentic. You remain responsible for maintaining the privacy of credentials.
    </p>
    <h4 className="text-sm font-bold text-foreground">3. Listing Regulations</h4>
    <p>
      Sellers must describe items accurately. Prohibited items include contraband, hazardous weapons, stolen objects, counterfeit products, and prescription drugs. The platform administrators hold full discretion to flag, block, or delete any listing that violates guidelines.
    </p>
    <h4 className="text-sm font-bold text-foreground">4. Bids and Auctions</h4>
    <p>
      Bids represent binding purchase offers. Winning bidders are expected to finalize payment within 48 hours of auction end. Account suspensions are implemented for non-complying users.
    </p>
  </div>
);

// 10. Privacy Policy Component
const PrivacyPolicyContent = () => (
  <div className="space-y-4 text-xs text-muted-foreground leading-relaxed max-h-[45vh] overflow-y-auto pr-2 animate-in fade-in duration-300">
    <h4 className="text-sm font-bold text-foreground">1. Collection of Information</h4>
    <p>
      We collect personal identifiers such as name, email, phone number, address, and verification credentials. Transaction details and device information are collected to support services and maintain security protocols.
    </p>
    <h4 className="text-sm font-bold text-foreground">2. Usage of Information</h4>
    <p>
      We utilize details to establish profiles, process payments, enable communication logs, customize recommended feeds, and execute verification algorithms.
    </p>
    <h4 className="text-sm font-bold text-foreground">3. Third-party Disclosures</h4>
    <p>
      We do not sell personal details. We share credentials with essential payment APIs (eSewa, Khalti) to process active invoice amounts. We comply with official government disclosure requests when backed by valid legal warrants.
    </p>
  </div>
);

// 11. Cookie Policy Component
const CookiePolicyContent = () => (
  <div className="space-y-4 text-xs text-muted-foreground leading-relaxed max-h-[45vh] overflow-y-auto pr-2 animate-in fade-in duration-300">
    <h4 className="text-sm font-bold text-foreground">What are Cookies?</h4>
    <p>
      Cookies are tiny files stored on devices when visiting websites. They remember sessions, language configurations, and analytics logs to keep services functioning smoothly.
    </p>
    <table className="w-full text-left border-collapse border rounded-xl overflow-hidden mt-2">
      <thead>
        <tr className="bg-slate-50 dark:bg-slate-900 border-b">
          <th className="p-2.5 font-bold">Category</th>
          <th className="p-2.5 font-bold">Purpose</th>
        </tr>
      </thead>
      <tbody>
        <tr className="border-b">
          <td className="p-2.5 font-semibold">Strictly Essential</td>
          <td className="p-2.5">Ensures authentication state, guards endpoints, and enables cart/bidding logs.</td>
        </tr>
        <tr className="border-b">
          <td className="p-2.5 font-semibold">Preferences</td>
          <td className="p-2.5">Stores chosen interface settings such as preferred language and light/dark theme.</td>
        </tr>
        <tr>
          <td className="p-2.5 font-semibold">Performance Logs</td>
          <td className="p-2.5">Feeds anonymous usage metrics to track speed and spot crashes.</td>
        </tr>
      </tbody>
    </table>
    <h4 className="text-sm font-bold text-foreground">Disabling Cookies</h4>
    <p>
      You can configure browsers to decline cookies. Note that doing so disables critical functionalities, including active user logins.
    </p>
  </div>
);

export default function FooterLinkModal({ isOpen, onClose, pageKey, links = [] }: Props) {
  if (!isOpen || !pageKey) return null;

  // Find database content
  const dbLink = links.find(l => l.title === pageKey);
  const dbContent = dbLink ? dbLink.content : null;

  // Render the appropriate section content
  const renderContent = () => {
    if (dbContent) {
      if (dbContent === "contact_us_form") {
        return <ContactUsContent />;
      }
      if (dbContent === "faqs_accordion") {
        return <FAQsContent />;
      }
      return (
        <div
          className="space-y-4 text-xs text-muted-foreground leading-relaxed max-h-[50vh] overflow-y-auto pr-2 animate-in fade-in duration-300 styled-html-content"
          dangerouslySetInnerHTML={{ __html: dbContent }}
        />
      );
    }

    switch (pageKey) {
      case "About Us":
        return <AboutUsContent />;
      case "Careers":
        return <CareersContent />;
      case "Press":
        return <PressContent />;
      case "Blog":
        return <BlogContent />;
      case "Help Center":
        return <HelpCenterContent />;
      case "Safety Tips":
        return <SafetyTipsContent />;
      case "Contact Us":
        return <ContactUsContent />;
      case "FAQs":
        return <FAQsContent />;
      case "Terms of Service":
        return <TermsOfServiceContent />;
      case "Privacy Policy":
        return <PrivacyPolicyContent />;
      case "Cookie Policy":
        return <CookiePolicyContent />;
      default:
        return <div className="text-sm text-red-500">Page not found.</div>;
    }
  };

  // Set sizing classes based on layout complexity
  const getDialogSizeClass = () => {
    switch (pageKey) {
      case "Contact Us":
      case "Careers":
      case "Blog":
      case "About Us":
        return "max-w-3xl";
      default:
        return "max-w-lg";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className={`${getDialogSizeClass()} bg-background border rounded-3xl p-6 shadow-2xl overflow-hidden focus:outline-none`}>
        <DialogHeader className="border-b pb-4 mb-4">
          <DialogTitle className="text-2xl font-black tracking-tight text-foreground flex items-center gap-2">
            {pageKey}
          </DialogTitle>
        </DialogHeader>
        <div className="mt-2 text-foreground">
          {renderContent()}
        </div>
      </DialogContent>
    </Dialog>
  );
}
