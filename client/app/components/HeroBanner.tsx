"use client";


import { useState, useEffect } from "react";
import Image from "next/image";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useAuth } from "@/app/context/AuthContext";
import { submitAdEnquiryAction } from "@/app/lib/ad-actions";
import { CheckCircle2, Loader2, X, Send } from "lucide-react";

interface Ad {
  _id?: string;
  imageUrl: string;
  companyName?: string;
  isFallback?: boolean;
}

const HeroBanner = () => {
  const [ads, setAds] = useState<Ad[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const { user } = useAuth();

  // Inquiry States
  const [inquiryModalOpen, setInquiryModalOpen] = useState(false);
  const [selectedAdId, setSelectedAdId] = useState<string | null>(null);
  const [inquiryLoading, setInquiryLoading] = useState(false);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    const fetchAdvertisements = async () => {
      try {
        const { getAllAdsAction } = await import("@/app/lib/ad-actions");
        const data = await getAllAdsAction();

        if (data && data.success && data.ads && data.ads.length > 0) {
          const activeAds = data.ads.filter((ad: any) =>
            ad.status === 'running' && ad.placement === 'main_banner'
          );

          if (activeAds.length > 0) {
            setAds(activeAds);
          } else {
            setAds([
              { imageUrl: "/advertisement/1.jpg", isFallback: true },
              { imageUrl: "/advertisement/2.jpg", isFallback: true },
              { imageUrl: "/advertisement/3.png", isFallback: true }
            ]);
          }
        } else {
          setAds([
            { imageUrl: "/advertisement/1.jpg", isFallback: true },
            { imageUrl: "/advertisement/2.jpg", isFallback: true },
            { imageUrl: "/advertisement/3.png", isFallback: true }
          ]);
        }
      } catch (error) {
        console.error('Error fetching advertisements:', error);
        setAds([
          { imageUrl: "/advertisement/1.jpg", isFallback: true },
          { imageUrl: "/advertisement/2.jpg", isFallback: true },
          { imageUrl: "/advertisement/3.png", isFallback: true }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchAdvertisements();
    setMounted(true);
  }, []);

  useEffect(() => {
    if (ads.length === 0) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % ads.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [ads.length]);

  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleInquireClick = async (adId: string) => {
    if (user) {
      // User is logged in: Instant submission
      setInquiryLoading(true);
      const payload = {
        name: user.username,
        email: user.email,
        phone: user.phone,
        message: "Hello, I am interested in your product and would like more details. Please contact me back."
      };
      
      const res = await submitAdEnquiryAction(adId, payload);
      setInquiryLoading(false);

      if (res.success) {
        showNotification("Inquiry sent successfully to the vendor!", "success");
      } else {
        showNotification(res.error || "Failed to dispatch inquiry.", "error");
      }
    } else {
      // User is logged out: Open Modal
      setSelectedAdId(adId);
      setInquiryModalOpen(true);
    }
  };

  const submitGuestInquiry = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedAdId) return;

    setInquiryLoading(true);
    const formData = new FormData(e.currentTarget);
    const payload = {
      name: formData.get("name") as string,
      phone: formData.get("phone") as string,
      email: formData.get("email") as string,
      message: formData.get("message") as string || "Hello, I am interested in your product and would like more details. Please contact me back."
    };

    const res = await submitAdEnquiryAction(selectedAdId, payload);
    setInquiryLoading(false);

    if (res.success) {
      showNotification("Inquiry sent successfully to the vendor!", "success");
      setInquiryModalOpen(false);
    } else {
      showNotification(res.error || "Failed to dispatch inquiry.", "error");
    }
  };

  if (loading) {
    return (
      <div className="w-full py-6 md:py-0 flex justify-center items-center">
        <div className="w-full h-[220px] md:h-[350px] rounded-3xl overflow-hidden shadow-2xl bg-gray-200 animate-pulse" />
      </div>
    );
  }

  if (ads.length === 0) return null;

  return (
    <div className="w-full py-6 md:py-0 flex flex-col md:flex-row gap-4 justify-center items-stretch relative">
      
      {/* Floating Notification */}
      {notification && (
        <div className={`absolute top-4 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-full flex items-center gap-2 shadow-2xl animate-in fade-in slide-in-from-top-10
          ${notification.type === 'success' ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'}`}>
          <CheckCircle2 className="w-5 h-5" />
          <span className="font-bold text-sm tracking-widest uppercase">{notification.message}</span>
        </div>
      )}

      {/* Guest Inquiry Modal */}
      {inquiryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-zinc-950 w-full max-w-md rounded-[2.5rem] overflow-hidden shadow-2xl border border-zinc-200 dark:border-zinc-800 animate-in zoom-in-95">
            <div className="p-8 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-extrabold text-[#5D4037] dark:text-white">Product Inquiry</h3>
                  <p className="text-xs text-zinc-500 uppercase tracking-widest font-bold mt-1">Leave your details for the vendor</p>
                </div>
                <button 
                  onClick={() => setInquiryModalOpen(false)}
                  className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
                >
                  <X className="w-5 h-5 text-zinc-500" />
                </button>
              </div>

              <form onSubmit={submitGuestInquiry} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-widest text-[#5D4037] dark:text-zinc-400">Full Name</label>
                  <input required name="name" type="text" className="w-full h-12 px-4 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:border-sage dark:focus:border-emerald-500 transition-colors" placeholder="John Doe" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-widest text-[#5D4037] dark:text-zinc-400">Contact Number</label>
                  <input required name="phone" type="tel" className="w-full h-12 px-4 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:border-sage dark:focus:border-emerald-500 transition-colors" placeholder="+1 234 567 8900" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-widest text-[#5D4037] dark:text-zinc-400">Email Address <span className="text-zinc-400 font-medium normal-case tracking-normal">(Optional)</span></label>
                  <input name="email" type="email" className="w-full h-12 px-4 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:border-sage dark:focus:border-emerald-500 transition-colors" placeholder="johndoe@example.com" />
                </div>
                <button 
                  disabled={inquiryLoading}
                  type="submit" 
                  className="w-full h-14 mt-4 bg-sage hover:bg-[#8A9A5B]/90 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                >
                  {inquiryLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Send className="w-4 h-4" /> Send Inquiry</>}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* 2/3rd Section: Carousel */}
      <div className="relative w-full md:w-2/3 h-[220px] md:h-[400px] rounded-3xl overflow-hidden shadow-2xl group transition-all duration-300">
        {/* Images */}
        {ads.map((ad, index) => (
          <div
            key={ad._id || index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"
              }`}
          >
            <Image
              src={ad.imageUrl}
              alt={`Banner ${index + 1}`}
              fill
              className="object-cover"
              priority={index === 0}
            />
            {/* Subtle Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent pointer-events-none" />
            
            {/* Interactive Inquire Overlay */}
            {!ad.isFallback && ad._id && (
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center backdrop-blur-[2px]">
                <button 
                  onClick={() => handleInquireClick(ad._id!)}
                  disabled={inquiryLoading}
                  className="bg-white text-[#5D4037] hover:bg-sage hover:text-white px-8 py-3.5 rounded-full font-black uppercase tracking-widest text-sm shadow-2xl transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 flex items-center gap-2"
                >
                  {inquiryLoading && selectedAdId === ad._id ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                      <Send className="w-5 h-5" />
                  )}
                  {inquiryLoading && selectedAdId === ad._id ? 'Sending...' : 'Inquire Now'}
                </button>
              </div>
            )}
          </div>
        ))}

        {/* Navigation Dots */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-3 z-20">
          {ads.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${index === currentIndex
                ? "bg-sage dark:bg-emerald-500 w-8"
                : "bg-white/50 hover:bg-white/80"
                }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* 1/3rd Section: Fixed Advertisement */}
      <div className="relative w-full md:w-1/3 h-[300px] md:h-[400px] rounded-3xl overflow-hidden shadow-2xl transition-all duration-300">
        {!mounted ? (
          <div className="w-full h-full bg-gray-200 animate-pulse" />
        ) : resolvedTheme === "dark" ? (
          /* Dark Mode Banner */
          <div className="w-full h-full flex flex-col bg-espresso border border-[#3E2723] group transition-transform hover:scale-[1.01]">
            <div className="bg-[#3E2723] h-2/5 p-6 flex flex-col justify-center items-center text-white border-b border-[#5D4037]">
              <div className="bg-sage/10 p-4 rounded-2xl border border-sage/30 flex flex-col items-center">
                <span className="text-[10px] uppercase tracking-widest font-bold text-sage mb-1">Special Offer</span>
                <div className="flex items-baseline text-sage">
                  <span className="text-lg font-bold">Rs.</span>
                  <span className="text-5xl font-extrabold ml-1">99</span>
                </div>
                <span className="text-[10px] text-gray-400 mt-1">Daily Rate</span>
              </div>
            </div>
            <div className="h-3/5 p-8 flex flex-col justify-center relative bg-espresso">
              {/* Decorative circle */}
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-sage opacity-5 rounded-full"></div>

              <h2 className="text-2xl font-extrabold text-white leading-tight">
                Premium Ad Space.<br />
                <span className="text-sage italic">Visible. Effective.</span>
              </h2>
              <p className="mt-3 text-gray-400 text-sm">High-traffic zones available now. Boost your brand visibility today.</p>
              <div className="mt-6 flex items-center space-x-4">
                <button className="bg-sage text-white px-5 py-2 rounded-xl text-sm font-bold hover:brightness-110 transition-all shadow-[0_0_20px_rgba(138,154,91,0.3)]">
                  Get Started
                </button>
                <Link href="#" className="text-gray-300 hover:text-white text-xs font-medium underline underline-offset-4 decoration-sage">View Stats</Link>
              </div>
            </div>
          </div>
        ) : (
          /* Light Mode Banner */
          <div className="w-full h-full flex flex-col bg-white border border-gray-100 group transition-transform hover:scale-[1.01]">
            <div className="bg-sage h-2/5 p-6 flex flex-col justify-center items-center text-white relative">
              <div className="absolute top-0 right-0 p-3 opacity-20">
                <svg width="60" height="60" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L4.5 20.29L5.21 21L12 18L18.79 21L19.5 20.29L12 2Z" /></svg>
              </div>
              <span className="text-[10px] uppercase tracking-widest font-semibold mb-1">Starting from</span>
              <div className="flex items-baseline">
                <span className="text-lg font-bold">Rs.</span>
                <span className="text-5xl font-extrabold ml-1">99</span>
              </div>
              <span className="text-sm opacity-90 mt-1">per day</span>
            </div>
            <div className="h-3/5 p-8 flex flex-col justify-center bg-white organic-pattern">
              <h2 className="text-2xl font-extrabold text-[#5D4037] leading-tight">
                Grow Your Business.<br />
                <span className="text-sage">Place your ads here.</span>
              </h2>
              <p className="mt-3 text-gray-600 text-sm">Reach thousands of targeted customers instantly with our premium placement options.</p>
              <div className="mt-6">
                <button className="bg-[#5D4037] text-white px-6 py-2.5 rounded-full text-sm font-bold hover:bg-[#3E2723] transition-colors shadow-lg">
                  Book Now
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HeroBanner;

