"use client";

import Link from "next/link";

export default function TrustSignals() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-4">
          Why <span className="text-green-700">Trust Vyom Regency?</span>
        </h2>
        <p className="text-center text-gray-600 mb-12">100% transparent transactions since 2017</p>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Badge 1 */}
          <div className="text-center p-6 bg-green-50 rounded-xl">
            <div className="text-5xl mb-3">🏆</div>
            <h3 className="font-bold text-xl mb-2">50+ Families Served</h3>
            <p className="text-gray-600 text-sm">Successfully delivered land parcels</p>
          </div>
                    {/* Badge 2 */}
          <div className="text-center p-6 bg-green-50 rounded-xl">
            <div className="text-5xl mb-3">📝</div>
            <h3 className="font-bold text-xl mb-2">Registry Ready</h3>
            <p className="text-gray-600 text-sm">Clear title with complete documentation</p>
          </div>
          
          {/* Badge 3 */}
          <div className="text-center p-6 bg-green-50 rounded-xl">
            <div className="text-5xl mb-3">⭐</div>
            <h3 className="font-bold text-xl mb-2">100% Satisfaction</h3>
            <p className="text-gray-600 text-sm">No hidden charges, no brokerage</p>
          </div>
        </div>
        
        {/* Google Map */}
        <div className="mt-12">
          <h3 className="text-xl font-bold text-center mb-4">📍 Our Location</h3>
          <div className="rounded-xl overflow-hidden shadow-lg h-96">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d28032.77007992005!2d76.57804515684209!3d27.886629270054527!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3972a2c1618a72a9%3A0xc6bc4a9e3212e76!2sKishangarh%20Bas%2C%20Rajasthan%20301404!5e0!3m2!1sen!2sin!4v1683115640533!5m2!1sen!2sin" 
              className="w-full h-full"
              allowFullScreen
              loading="lazy"
              title="Vyom Regency Location"
            ></iframe>
          </div>
          <p className="text-center text-gray-500 text-sm mt-2">
            Kishangarh Bas, Khairthal-Tijara District, Rajasthan | 2 hours from Delhi NCR
          </p>
        </div>
      </div>
    </section>
  );
}