"use client";

import { useState, useEffect, useRef } from "react";
import { 
  X, Upload, Calendar, CheckCircle2, 
  CreditCard, ChevronRight, ChevronLeft, 
  Loader2, BadgePercent, ShieldCheck,
  Building2, Mail, Phone, Info
} from "lucide-react";
import Image from "next/image";
import { initiateAdBookingAction, verifyKhaltiPaymentAction } from "@/app/lib/ad-actions";
import { toast } from "sonner";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const PLANS = [
  { id: 'Basic', name: 'Basic', price: 99, features: ['2/3 Section Carousel', 'Standard Visibility'] },
  { id: 'Standard', name: 'Standard', price: 199, features: ['Higher Priority', 'Detailed Analytics', 'Verified Badge'] },
  { id: 'Premium', name: 'Premium', price: 399, features: ['Top Priority', '24/7 Support', 'Premium Placement', 'Featured Listing'] },
];

export default function AdBookingModal({ isOpen, onClose }: Props) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  // Form State
  const [formData, setFormData] = useState({
    companyName: '',
    companyEmail: '',
    phone: '',
    plan: 'Basic',
    expiryDate: '',
    paymentMethod: 'esewa'
  });

  // Price Calculation State
  const [pricing, setPricing] = useState({
    days: 0,
    subtotal: 0,
    tax: 0,
    total: 0
  });

  // eSewa Form Ref
  const esewaFormRef = useRef<HTMLFormElement>(null);
  const [esewaParams, setEsewaParams] = useState<any>(null);

  useEffect(() => {
    if (!formData.expiryDate) return;
    
    const start = new Date();
    const end = new Date(formData.expiryDate);
    const diff = end.getTime() - start.getTime();
    const days = Math.max(1, Math.ceil(diff / (1000 * 3600 * 24)));
    
    const planPrice = PLANS.find(p => p.id === formData.plan)?.price || 99;
    const subtotal = planPrice * days;
    const tax = Math.round(subtotal * 0.13 * 100) / 100;
    const total = subtotal + tax;
    
    setPricing({ days, subtotal, tax, total });
  }, [formData.expiryDate, formData.plan]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleNext = () => {
    if (step === 1) {
      if (!formData.companyName || !formData.companyEmail || !formData.phone || !selectedFile) {
        toast.error("Please fill all business details and upload a banner image.");
        return;
      }
    }
    if (step === 2) {
      if (!formData.expiryDate) {
        toast.error("Please select an expiry date for your campaign.");
        return;
      }
    }
    setStep(prev => prev + 1);
  };
  const handleBack = () => setStep(prev => prev - 1);

  const handleSubmit = async () => {
    // Final Validation
    if (!formData.companyName || !formData.companyEmail || !formData.phone || !formData.expiryDate || !selectedFile) {
        toast.error("Please fill all mandatory fields before proceeding.");
        return;
    }

    setLoading(true);
    try {
      const data = new FormData();
      data.append("companyName", formData.companyName);
      data.append("companyEmail", formData.companyEmail);
      data.append("phone", formData.phone);
      data.append("plan", formData.plan);
      data.append("expiryDate", formData.expiryDate);
      data.append("paymentMethod", formData.paymentMethod);
      if (selectedFile) data.append("image", selectedFile);

      const res = await initiateAdBookingAction(data);

      if (res.success) {
        if (formData.paymentMethod === 'esewa') {
          setEsewaParams(res.parameters);
          // Wait for state update then submit
          setTimeout(() => esewaFormRef.current?.submit(), 100);
        } else if (formData.paymentMethod === 'khalti') {
            toast.info("Khalti integration is being initialized...");
            // Redirect to Khalti checkout if URL is provided by backend
            if (res.payment_url) {
                window.location.href = res.payment_url;
            } else {
                toast.error("Khalti payment URL not found.");
                setLoading(false);
            }
        }
      } else {
        toast.error(res.error || "Failed to initiate booking");
        setLoading(false);
      }
    } catch (error) {
      toast.error("Internal Server Error");
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
      
      {/* Hidden eSewa Form for Auto-Submission */}
      {esewaParams && (
        <form ref={esewaFormRef} action="https://rc-epay.esewa.com.np/api/epay/main/v2/form" method="POST" className="hidden">
          {Object.entries(esewaParams).map(([key, value]) => (
            <input key={key} type="hidden" name={key} value={value as string} />
          ))}
        </form>
      )}

      <div className="bg-white w-full max-w-4xl rounded-[2.5rem] shadow-2xl border border-slate-200 overflow-hidden flex flex-col md:flex-row h-[90vh] md:h-auto animate-in zoom-in-95 duration-500">
        
        {/* Left Side: Progress & Info */}
        <div className="w-full md:w-1/3 bg-slate-50 p-8 border-r border-slate-100 flex flex-col justify-between">
          <div className="space-y-8">
            <div className="space-y-2">
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Book Your Advertisement</h2>
              <p className="text-sm text-slate-500 font-medium">Grow your business by reaching thousands of local buyers instantly.</p>
            </div>

            {/* Stepper */}
            <div className="space-y-6">
              {[
                { s: 1, t: "Business Information", d: "Company details & logo" },
                { s: 2, t: "Plan & Duration", d: "Choose your exposure" },
                { s: 3, t: "Secure Payment", d: "eSewa or Khalti" }
              ].map((item) => (
                <div key={item.s} className={`flex gap-4 items-start transition-opacity ${step >= item.s ? 'opacity-100' : 'opacity-40'}`}>
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 border-2 font-bold transition-all ${
                    step === item.s ? 'bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 
                    step > item.s ? 'bg-emerald-100 border-emerald-100 text-emerald-600' : 'bg-white border-slate-200 text-slate-400'
                  }`}>
                    {step > item.s ? <CheckCircle2 className="w-5 h-5" /> : item.s}
                  </div>
                  <div>
                    <p className={`text-sm font-black ${step === item.s ? 'text-slate-900' : 'text-slate-500'}`}>{item.t}</p>
                    <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400">{item.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 bg-emerald-50 rounded-3xl border border-emerald-100">
            <div className="flex items-center gap-3 text-emerald-700 mb-2">
              <ShieldCheck className="w-5 h-5" />
              <span className="text-xs font-black uppercase tracking-widest">Verified Booking</span>
            </div>
            <p className="text-[10px] text-emerald-600/80 font-medium leading-relaxed">
              All transactions are secured with industry-standard encryption. Your ad goes live immediately after verification.
            </p>
          </div>
        </div>

        {/* Right Side: Form Content */}
        <div className="flex-1 flex flex-col relative bg-white">
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-900 transition-all z-10"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="flex-1 overflow-y-auto p-8 md:p-12">
            
            {/* Step 1: Business Info */}
            {step === 1 && (
              <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
                <div className="space-y-4">
                  <h3 className="text-xl font-black text-slate-900">Business Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-black uppercase tracking-tighter text-slate-400 flex items-center gap-2">
                        <Building2 className="w-3 h-3 text-emerald-500" /> Company Name
                      </label>
                      <input 
                        value={formData.companyName}
                        onChange={e => setFormData({ ...formData, companyName: e.target.value })}
                        className="w-full h-12 px-4 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all font-bold text-slate-900"
                        placeholder="e.g. Nepal Electronics"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-black uppercase tracking-tighter text-slate-400 flex items-center gap-2">
                        <Mail className="w-3 h-3 text-emerald-500" /> Business Email
                      </label>
                      <input 
                        type="email"
                        value={formData.companyEmail}
                        onChange={e => setFormData({ ...formData, companyEmail: e.target.value })}
                        className="w-full h-12 px-4 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all font-bold text-slate-900"
                        placeholder="contact@company.com"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-black uppercase tracking-tighter text-slate-400 flex items-center gap-2">
                      <Phone className="w-3 h-3 text-emerald-500" /> Contact Phone
                    </label>
                    <input 
                      type="tel"
                      value={formData.phone}
                      onChange={e => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full h-12 px-4 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all font-bold text-slate-900"
                      placeholder="98XXXXXXXX"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xl font-black text-slate-900">Advertisement Creative</h3>
                  <div 
                    onClick={() => document.getElementById('ad-image-upload')?.click()}
                    className="w-full h-48 border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center cursor-pointer hover:border-emerald-400 hover:bg-emerald-50 transition-all group overflow-hidden"
                  >
                    {imagePreview ? (
                      <div className="relative w-full h-full">
                        <Image src={imagePreview} alt="Preview" fill className="object-cover" />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <Upload className="w-10 h-10 text-white" />
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-4 text-slate-400 group-hover:scale-110 group-hover:text-emerald-500 transition-all">
                          <Upload className="w-8 h-8" />
                        </div>
                        <p className="text-sm font-bold text-slate-500">Tap to upload banner image</p>
                        <p className="text-[10px] uppercase font-black tracking-widest text-slate-300 mt-1">Recommended: 1200x600 px</p>
                      </>
                    )}
                    <input id="ad-image-upload" type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Plan & Date */}
            {step === 2 && (
              <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
                <div className="space-y-4">
                  <h3 className="text-xl font-black text-slate-900">Select Campaign Plan</h3>
                  <div className="grid grid-cols-1 gap-3">
                    {PLANS.map((plan) => (
                      <div 
                        key={plan.id}
                        onClick={() => setFormData({ ...formData, plan: plan.id })}
                        className={`p-6 rounded-[2rem] border-2 cursor-pointer transition-all ${
                          formData.plan === plan.id ? 'border-emerald-500 bg-emerald-50 shadow-lg shadow-emerald-500/10' : 'border-slate-100 hover:border-slate-200'
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-lg font-black text-slate-900">{plan.name}</p>
                            <div className="flex flex-wrap gap-2 mt-2">
                                {plan.features.map(f => (
                                    <span key={f} className="text-[9px] px-2 py-0.5 bg-white border border-slate-200 rounded-full font-black uppercase text-slate-400 tracking-tighter">{f}</span>
                                ))}
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-black text-emerald-600">Rs. {plan.price}</p>
                            <p className="text-[10px] font-black uppercase text-slate-400 tracking-tighter mt-1">Per Day</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xl font-black text-slate-900">Choose Expiry Date</h3>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-500" />
                    <input 
                      type="date"
                      min={new Date().toISOString().split('T')[0]}
                      value={formData.expiryDate}
                      onChange={e => setFormData({ ...formData, expiryDate: e.target.value })}
                      className="w-full h-14 pl-12 pr-4 rounded-2xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-emerald-500 font-bold text-slate-900"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Payment */}
            {step === 3 && (
              <div className="space-y-8 animate-in slide-in-from-right-4 duration-300 text-center">
                <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto text-emerald-500">
                    <BadgePercent className="w-10 h-10" />
                </div>
                <div className="space-y-2">
                    <h3 className="text-2xl font-black text-slate-900">Payment Summary</h3>
                    <p className="text-slate-500 font-medium">Review your order before proceeding to checkout</p>
                </div>

                <div className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-200 space-y-4">
                   <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-400 font-bold uppercase tracking-widest">Base Rate ({pricing.days} days)</span>
                      <span className="font-black text-slate-900">Rs. {pricing.subtotal}</span>
                   </div>
                   <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-400 font-bold uppercase tracking-widest">Government Tax (13% VAT)</span>
                      <span className="font-black text-emerald-600">+ Rs. {pricing.tax}</span>
                   </div>
                   <div className="h-px bg-slate-200 my-2" />
                   <div className="flex justify-between items-center">
                      <span className="text-lg font-black text-slate-900">Total Amount</span>
                      <span className="text-3xl font-black text-emerald-600">Rs. {pricing.total}</span>
                   </div>
                </div>

                <div className="space-y-4">
                   <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Select Gateway</p>
                   <div className="grid grid-cols-2 gap-4">
                      <button 
                        onClick={() => setFormData({ ...formData, paymentMethod: 'esewa' })}
                        className={`h-16 rounded-2xl border-2 flex items-center justify-center gap-3 transition-all ${
                            formData.paymentMethod === 'esewa' ? 'border-emerald-500 bg-emerald-50 shadow-md' : 'border-slate-100 hover:border-slate-200'
                        }`}
                      >
                         <span className="font-black text-emerald-700">eSewa</span>
                      </button>
                      <button 
                        onClick={() => setFormData({ ...formData, paymentMethod: 'khalti' })}
                        className={`h-16 rounded-2xl border-2 flex items-center justify-center gap-3 transition-all ${
                            formData.paymentMethod === 'khalti' ? 'border-purple-500 bg-purple-50 shadow-md' : 'border-slate-100 hover:border-slate-200'
                        }`}
                      >
                         <span className="font-black text-purple-700">Khalti</span>
                      </button>
                   </div>
                </div>
              </div>
            )}
            
          </div>

          {/* Footer Actions */}
          <div className="p-8 border-t border-slate-100 flex items-center justify-between gap-4">
            {step > 1 ? (
               <button 
                onClick={handleBack}
                className="h-14 px-8 rounded-2xl border-2 border-slate-100 font-black uppercase tracking-widest text-[10px] text-slate-400 hover:bg-slate-50 transition-all flex items-center gap-2"
               >
                 <ChevronLeft className="w-4 h-4" /> Back
               </button>
            ) : (
                <div />
            )}

            <button 
              disabled={loading || (step === 1 && (!formData.companyName || !imagePreview))}
              onClick={step === 3 ? handleSubmit : handleNext}
              className="h-14 px-10 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs flex items-center gap-2 transition-all shadow-xl shadow-emerald-500/20 active:scale-95 disabled:opacity-50 disabled:grayscale"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                <>
                  {step === 3 ? "Complete & Pay" : "Continue"} 
                  <ChevronRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
