'use client';

import { Sparkles, Wrench } from 'lucide-react';
import { Header } from "@/components/header";
import { Footer } from '@/components/footer';

export default function VirtualTryOn() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <div className="pt-32 pb-24 flex items-center justify-center">
        <div className="text-center max-w-lg mx-auto px-6">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 mb-6">
            <Wrench className="w-10 h-10 text-purple-600" />
          </div>
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-100 to-pink-100 px-4 py-2 rounded-full mb-4">
            <Sparkles className="w-4 h-4 text-purple-600" />
            <span className="text-sm font-medium text-purple-900">Coming Soon</span>
          </div>
          <h1 className="font-serif text-4xl md:text-5xl text-gray-900 font-light mb-4">
            Virtual Try-On
          </h1>
          <p className="text-gray-600 text-lg mb-2">
            We're improving our AI engine for a better experience.
          </p>
          <p className="text-gray-500 text-sm">
            This feature will be back shortly. Thank you for your patience.
          </p>
        </div>
      </div>
      <Footer />
    </main>
  );
}