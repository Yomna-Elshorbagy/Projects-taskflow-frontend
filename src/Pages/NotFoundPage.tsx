import { Link } from "react-router-dom";
import { Compass } from "lucide-react";
import SEO from "../Shared/SEO/SEO";

const NotFoundPage = () => {
  return (
    <>
      <SEO title="Page Not Found | TaskFlow" />
      <div className="min-h-screen bg-[#f4f7f6] flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
        {/* Decorative ambient background elements */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#1a6b5a]/10 rounded-full blur-3xl mix-blend-multiply animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[28rem] h-[28rem] bg-emerald-500/10 rounded-full blur-3xl mix-blend-multiply animate-pulse delay-700" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] bg-teal-400/5 rounded-full blur-3xl mix-blend-multiply" />
        
        <div className="relative z-10 flex flex-col items-center max-w-lg mt-[-8vh]">
          {/* Animated 404 Text */}
          <div className="relative mb-6">
            <h1 
              className="text-[140px] md:text-[180px] font-black tracking-tighter leading-none"
              style={{
                color: "transparent",
                WebkitTextStroke: "4px #1a6b5a",
                textShadow: "0 20px 40px rgba(26, 107, 90, 0.15)"
              }}
            >
              404
            </h1>
            {/* Spinning Compass Background */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[#1a6b5a] animate-[spin_12s_linear_infinite] opacity-10 pointer-events-none">
              <Compass size={220} strokeWidth={1} />
            </div>
          </div>

          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 tracking-tight">
            Lost in the flow?
          </h2>
          <p className="text-base text-gray-600 mb-10 max-w-md leading-relaxed">
            The task or project you are looking for has been moved, deleted, or never existed in the first place.
          </p>

          <Link
            to="/"
            className="group relative inline-flex items-center justify-center px-8 py-3.5 text-sm font-bold text-white transition-all duration-300 bg-[#1a6b5a] rounded-full shadow-[0_8px_20px_rgba(26,107,90,0.3)] hover:bg-[#135244] hover:shadow-[0_12px_24px_rgba(26,107,90,0.4)] hover:-translate-y-1"
          >
            <span className="flex items-center gap-2">
              <Compass size={18} className="transition-transform duration-500 group-hover:rotate-180" />
              Return to Dashboard
            </span>
          </Link>
        </div>
      </div>
    </>
  );
};

export default NotFoundPage;
