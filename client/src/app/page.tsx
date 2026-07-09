"use client";

import Navbar from "@/components/ui/navbar";

export default function Home() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#0c1f1b]">
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source 
          src="https://res.cloudinary.com/dartdvch1/video/upload/v1783622374/3135924-hd_1920_1080_30fps_lcbt1v.mp4" 
          type="video/mp4" 
        />
        Your browser does not support the video tag.
      </video>
      
      {/* Dynamic gradient overlay to blend navbar and darken screen edges */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/30 to-black/70 z-10" />
      
      {/* Content Wrapper */}
      <div className="relative z-20 flex flex-col min-h-screen">
        <Navbar />
      </div>
    </div>
  );
}

