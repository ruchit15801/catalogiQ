"use client";

import { motion } from "framer-motion";
import { useState } from "react";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};
const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

export default function Contact() {
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => setSent(false), 4000);
  };

  return (
    <div className="overflow-hidden bg-[#f8fafc]">
      {/* Hero */}
      <section className="bg-white border-b border-[#e2e8f0] py-16 md:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial="hidden" animate="visible" variants={fadeUp}>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#EDE9FE] text-[#5B21B6] font-bold text-xs uppercase tracking-wider rounded-full mb-6"><i className="ti ti-message-circle"></i>Contact Us</span>
            <h1 className="t-hero-main text-4xl md:text-5xl">Let&apos;s Talk About <span className="text-gradient">Your Business.</span></h1>
            <p className="t-hero-sub text-base md:text-lg">Whether you have a catalog of 10 products or 10,000 — we&apos;re here to help you save money on shipping, generate better content, and scale your marketplace presence. Reach out and our team will respond within 24 hours.</p>
          </motion.div>
        </div>
      </section>

      {/* Contact Grid */}
      <section className="py-12 md:py-20 bg-[#f8fafc]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial="hidden" animate="visible" variants={stagger} className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-8">
            {/* Left — Contact Info */}
            <motion.div variants={fadeUp} className="space-y-5">
              <div className="bg-white p-5 rounded-xl border border-[#e2e8f0] shadow-sm">
                <h3 className="text-lg font-bold text-[#0f172a] mb-4">Reach Us Directly</h3>
                <div className="space-y-4">
                  <a href="mailto:support@catalogiq.com" className="flex items-center gap-3 text-[#475569] hover:text-[#7C3AED] transition-colors group">
                    <div className="w-10 h-10 bg-[#EDE9FE] text-[#7C3AED] rounded-xl flex items-center justify-center text-lg group-hover:scale-110 transition-transform"><i className="ti ti-mail"></i></div>
                    <div><div className="text-xs font-bold text-[#64748b]">Email</div><div className="text-sm font-semibold">support@catalogiq.com</div></div>
                  </a>
                  <a href="https://wa.me/919876543210" className="flex items-center gap-3 text-[#475569] hover:text-[#10B981] transition-colors group">
                    <div className="w-10 h-10 bg-[#D1FAE5] text-[#10B981] rounded-xl flex items-center justify-center text-lg group-hover:scale-110 transition-transform"><i className="ti ti-brand-whatsapp"></i></div>
                    <div><div className="text-xs font-bold text-[#64748b]">WhatsApp</div><div className="text-sm font-semibold">+91 98765 43210</div></div>
                  </a>
                  <div className="flex items-start gap-3 text-[#475569]">
                    <div className="w-10 h-10 bg-[#f1f5f9] text-[#64748b] rounded-xl flex items-center justify-center text-lg shrink-0"><i className="ti ti-map-pin"></i></div>
                    <div><div className="text-xs font-bold text-[#64748b]">Office</div><div className="text-sm font-semibold">123 Tech Park, Sector 4<br/>HSR Layout, Bangalore 560102</div></div>
                  </div>
                </div>
              </div>

              <div className="bg-white p-5 rounded-xl border border-[#e2e8f0] shadow-sm">
                <h3 className="text-lg font-bold text-[#0f172a] mb-3">Business Hours</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-[#475569]">Mon – Fri</span><span className="font-semibold text-[#0f172a]">9:00 AM – 7:00 PM IST</span></div>
                  <div className="flex justify-between"><span className="text-[#475569]">Saturday</span><span className="font-semibold text-[#0f172a]">10:00 AM – 4:00 PM IST</span></div>
                  <div className="flex justify-between"><span className="text-[#475569]">Sunday</span><span className="font-semibold text-[#64748b]">Closed</span></div>
                </div>
              </div>

              <div className="bg-[#EDE9FE] p-5 rounded-xl border border-[#7C3AED]/20">
                <h3 className="text-base font-bold text-[#5B21B6] mb-2"><i className="ti ti-headset mr-1"></i>Enterprise Support</h3>
                <p className="text-sm text-[#475569] leading-relaxed">Processing 500+ products/day? Need custom API integration or white-label solutions? Our enterprise team offers dedicated onboarding, priority support, and custom rate negotiations.</p>
              </div>
            </motion.div>

            {/* Right — Form */}
            <motion.div variants={fadeUp} className="bg-white p-6 md:p-8 rounded-xl border border-[#e2e8f0] shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-[#7C3AED] opacity-5 rounded-full blur-[60px] pointer-events-none"></div>
              {sent ? (
                <div className="flex flex-col items-center justify-center py-16 text-center animate-fade-up">
                  <div className="w-16 h-16 bg-[#D1FAE5] text-[#10B981] rounded-full flex items-center justify-center text-3xl mb-4"><i className="ti ti-check"></i></div>
                  <h3 className="text-xl font-bold text-[#0f172a] mb-2">Message Sent!</h3>
                  <p className="text-sm text-[#475569]">We&apos;ll get back to you within 24 hours.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="relative z-10">
                  <h3 className="text-xl font-bold text-[#0f172a] mb-5">Send Us a Message</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="form-label text-sm">First Name</label>
                      <input type="text" className="input-control py-3" placeholder="Rahul" required />
                    </div>
                    <div>
                      <label className="form-label text-sm">Last Name</label>
                      <input type="text" className="input-control py-3" placeholder="Patel" />
                    </div>
                  </div>
                  <div className="mb-4">
                    <label className="form-label text-sm">Email Address</label>
                    <input type="email" className="input-control py-3" placeholder="rahul@business.com" required />
                  </div>
                  <div className="mb-4">
                    <label className="form-label text-sm">Phone (Optional)</label>
                    <input type="text" className="input-control py-3" placeholder="+91 98765 43210" />
                  </div>
                  <div className="mb-4">
                    <label className="form-label text-sm">Subject</label>
                    <select className="input-control py-3">
                      <option>General Inquiry</option>
                      <option>Shipping Optimizer</option>
                      <option>Enterprise / API Access</option>
                      <option>Billing & Plans</option>
                      <option>Bug Report</option>
                      <option>Partnership</option>
                    </select>
                  </div>
                  <div className="mb-5">
                    <label className="form-label text-sm">Your Message</label>
                    <textarea className="input-control py-3 min-h-[120px] resize-y" placeholder="Tell us about your catalog size, which marketplaces you sell on, and how we can help you save on shipping costs..." required></textarea>
                  </div>
                  <button type="submit" className="btn btn-primary w-full text-base py-3.5 rounded-xl shadow-lg shadow-[#7C3AED]/20">Send Message <i className="ti ti-send ml-1"></i></button>
                </form>
              )}
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
