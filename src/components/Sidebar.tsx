"use client";

import { motion } from "framer-motion";
import { Github, Linkedin, Twitter, Mail } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

const navItems = [
    { name: "01. Essence", href: "#about" },
    { name: "02. Works", href: "#projects" },
    { name: "03. Contact", href: "#contact" },
];

export default function Sidebar() {
    return (
        <aside className="fixed top-0 left-0 w-full md:w-[350px] h-auto md:h-screen bg-background border-b md:border-b-0 md:border-r border-foreground z-50 flex flex-col justify-between p-6 md:p-12">
            {/* Header / Logo */}
            <div className="flex justify-between items-start md:block">
                <div>
                    <h1 className="text-2xl font-bold uppercase tracking-tighter leading-none font-heading text-foreground">
                        Hyeonjun<br />Jun
                    </h1>
                    <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.2em] text-foreground/60">
                        Creative Developer
                    </p>
                </div>

                {/* Mobile Menu Toggle could go here if needed, keeping it simple for now */}
            </div>

            {/* Navigation - Desktop (Center) */}
            <nav className="hidden md:flex flex-col gap-6">
                {navItems.map((item) => (
                    <Link
                        key={item.name}
                        href={item.href}
                        className="text-sm font-bold uppercase tracking-[0.1em] text-foreground hover:text-accent transition-colors font-heading group flex items-center gap-4"
                    >
                        <span className="w-2 h-2 bg-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                        {item.name}
                    </Link>
                ))}
            </nav>

            {/* Footer / Socials - Desktop (Bottom) */}
            <div className="hidden md:flex flex-col gap-6">
                <div className="flex gap-4">
                    <a href="#" className="text-foreground hover:text-accent transition-colors"><Github size={18} /></a>
                    <a href="#" className="text-foreground hover:text-accent transition-colors"><Linkedin size={18} /></a>
                    <a href="#" className="text-foreground hover:text-accent transition-colors"><Twitter size={18} /></a>
                </div>
                <div className="text-[10px] font-mono text-foreground/40 uppercase tracking-widest">
                    Est. 2026
                </div>
            </div>
        </aside>
    );
}
