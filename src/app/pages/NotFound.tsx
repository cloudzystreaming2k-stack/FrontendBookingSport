import { Link } from "react-router";
import { Zap, Home, Dribbble, Gamepad2 } from "lucide-react";
import { Button } from "../components/ui/button";

export function NotFound() {
  return (
    <div className="min-h-screen bg-[#e8f3f8] flex flex-col items-center justify-center relative overflow-hidden">
      {/* Grid Background Pattern */}
      <div 
        className="absolute inset-0 z-0 opacity-[0.15]"
        style={{
          backgroundImage: `linear-gradient(#4ba2c9 1px, transparent 1px), linear-gradient(90deg, #4ba2c9 1px, transparent 1px)`,
          backgroundSize: '80px 80px',
          backgroundPosition: 'center center'
        }}
      >
        {/* Glowing Gradient blob behind 404 */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-100/50 rounded-full blur-[100px] -z-10"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center w-full max-w-2xl px-4 py-8">
        
        {/* Logo Placeholder */}
        <div className="flex items-center gap-1.5 mb-16">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-[#e11d48] flex items-center justify-center -mr-2 relative z-10 shadow-sm border-[2px] border-[#e8f3f8]">
              <Dribbble className="w-4 h-4 text-white" />
            </div>
            <div className="w-8 h-8 rounded-full bg-[#111827] flex items-center justify-center relative z-0 shadow-sm border-[2px] border-[#e8f3f8]">
              <Gamepad2 className="w-4 h-4 text-white" />
            </div>
          </div>
          <span className="text-[26px] font-black text-[#e11d48] tracking-tight ml-2">
            Booking Sport
            {/* <span className="text-gray-900 font-medium">is</span> */}
          </span>
        </div>

        {/* 404 Text */}
        <div className="relative mb-6">
          <h1 
            className="text-[140px] md:text-[200px] font-black leading-none tracking-tighter text-[#2a8ebd]"
            style={{
              textShadow: '0 20px 40px rgba(42, 142, 189, 0.4)'
            }}
          >
            404
          </h1>
        </div>

        {/* Message */}
        <h2 className="text-[22px] md:text-[28px] font-extrabold text-[#111827] mb-4 flex items-center justify-center gap-2">
          <Zap className="w-5 h-5 md:w-6 md:h-6 text-[#2a8ebd] shrink-0" strokeWidth={2.5} />
          Oops! Page Not Found
          <Zap className="w-5 h-5 md:w-6 md:h-6 text-[#2a8ebd] shrink-0" strokeWidth={2.5} />
        </h2>
        
        <p className="text-[#3b8eb3] text-center font-medium mb-10 max-w-md leading-relaxed text-[15px]">
          The page you're looking for doesn't exist or has been moved to another location.
        </p>

        {/* Button */}
        <Link to="/">
          <Button className="bg-[#1a769d] hover:bg-[#156082] text-white px-8 h-12 rounded-[0.5rem] font-bold shadow-[0_8px_20px_rgb(26,118,157,0.3)] transition-all transform hover:-translate-y-1 hover:shadow-[0_12px_25px_rgb(26,118,157,0.4)]">
            <Home className="w-[18px] h-[18px] mr-2" />
            Go to Homepage
          </Button>
        </Link>

        {/* Footer links */}
        {/* <div className="flex gap-8 mt-24 text-[#4ba2c9] text-[13px] font-bold tracking-wide">
          <Link to="/" className="hover:text-[#1a769d] transition-colors">Player</Link>
          <Link to="/" className="hover:text-[#1a769d] transition-colors">Organization</Link>
          <Link to="/admin" className="hover:text-[#1a769d] transition-colors">Admin</Link>
        </div> */}
      </div>
    </div>
  );
}