"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Heart, Sparkles, User, Calendar, Flame } from "lucide-react";
import Button from "../ui/Button";

export default function Navbar() {
  const pathname = usePathname();

  const navLinks = [
    { href: "/sessions", label: "Sessions Live", icon: Calendar },
    { href: "/matches", label: "Mes Matchs", icon: Heart },
    { href: "/profile", label: "Mon Profil", icon: User },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 md:px-8 py-4 mix-blend-normal">
      <nav className="max-w-7xl mx-auto bg-white/85 backdrop-blur-2xl border border-rose-900/10 rounded-full px-6 py-3 flex items-center justify-between shadow-[0_10px_35px_-10px_rgba(225,29,72,0.1)]">
        
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-rose-600 to-purple-600 flex items-center justify-center shadow-[0_4px_20px_rgba(225,29,72,0.3)] group-hover:scale-105 transition-transform">
            <Flame className="w-5 h-5 text-white" />
          </div>
          <span className="font-outfit font-black text-xl tracking-tighter uppercase text-[#1c1917] group-hover:text-rose-600 transition-colors">
            OWEKE<span className="text-rose-600">.</span>
          </span>
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-1 bg-rose-50/80 border border-rose-200/60 rounded-full p-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative px-4 py-2 rounded-full text-xs font-mono tracking-wider uppercase transition-colors flex items-center gap-2 ${
                  isActive ? "text-rose-950 font-bold" : "text-stone-600 hover:text-stone-900"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeNavTab"
                    className="absolute inset-0 bg-white border border-rose-200 shadow-sm rounded-full"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <Icon className={`w-3.5 h-3.5 relative z-10 ${isActive ? "text-rose-600" : ""}`} />
                <span className="relative z-10">{link.label}</span>
              </Link>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <Link href="/login" className="hidden sm:inline-block">
            <Button variant="ghost" size="sm">Se Connecter</Button>
          </Link>
          <Link href="/sessions">
            <Button variant="primary" size="sm" rightIcon={<Sparkles className="w-4 h-4" />}>
              Rejoindre
            </Button>
          </Link>
        </div>
      </nav>
    </header>
  );
}
