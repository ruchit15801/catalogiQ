"use client";

import { motion } from "framer-motion";

export default function PrivacyPolicy() {
  return (
    <div className="bg-[#f8fafc] min-h-screen">
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24"
      >
        <div className="bg-white p-8 md:p-16 rounded-[2rem] border border-[#e2e8f0] shadow-sm">
            <h1 className="text-3xl md:text-5xl font-black text-[#0f172a] mb-4">Privacy Policy</h1>
            <p className="text-[#64748b] font-medium mb-12 border-b border-[#f1f5f9] pb-8">Last updated: June 11, 2026</p>
            
            <div className="prose prose-slate max-w-none prose-p:text-[#475569] prose-p:text-base md:prose-p:text-lg prose-p:leading-relaxed prose-headings:text-[#0f172a]">
                <h2 className="text-2xl md:text-3xl font-bold mt-10 mb-6">1. Information We Collect</h2>
                <p>We collect information you provide directly to us when you create an account, upload images for optimization, request customer support, or otherwise communicate with us. The types of information we may collect include your name, email address, and uploaded catalog images.</p>

                <h2 className="text-2xl md:text-3xl font-bold mt-10 mb-6">2. How We Use Your Information</h2>
                <p>We use the information we collect to provide, maintain, and improve our services, particularly the AI image optimization engine. Your product images are temporarily processed by our AI partners (OpenAI, Gemini) strictly for the purpose of generating optimized variants and calculating shipping volumes. We do not use your proprietary images to train foundational models.</p>

                <h2 className="text-2xl md:text-3xl font-bold mt-10 mb-6">3. Data Retention & Deletion</h2>
                <p>We retain your uploaded images only as long as necessary to provide the service. Once an image is optimized and saved to your project, the raw processing data is discarded automatically after 24 hours. You may delete your account and all associated project data at any time from your dashboard settings, triggering a hard delete across our MongoDB clusters.</p>

                <h2 className="text-2xl md:text-3xl font-bold mt-10 mb-6">4. Third-Party Services</h2>
                <p>We employ third-party companies and individuals due to the following reasons: to facilitate our Service; to provide the Service on our behalf; to perform Service-related services; or to assist us in analyzing how our Service is used (e.g. Google Analytics). These third parties have access to your Personal Information only to perform these tasks on our behalf and are obligated not to disclose or use it for any other purpose.</p>

                <h2 className="text-2xl md:text-3xl font-bold mt-10 mb-6">5. Contact Us</h2>
                <p>If you have any questions or suggestions about our Privacy Policy, do not hesitate to contact us at <a href="mailto:support@catalogiq.com" className="text-[#7C3AED] font-bold hover:underline">support@catalogiq.com</a>.</p>
            </div>
        </div>
      </motion.div>
    </div>
  );
}
