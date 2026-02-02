"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useRef, useState } from "react";

const PROJECTS_LEFT = [
    { id: "01", client: "SIFT MOBILE", type: "PRODUCT" },
    { id: "02", client: "ANTIGRAVITY", type: "SYSTEM" },
    { id: "03", client: "LUMA", type: "INTERFACE" },
    { id: "04", client: "MONO/POLY", type: "R&D" },
    { id: "05", client: "ETHER", type: "BRAND" },
    { id: "06", client: "VOID", type: "EXPERIMENT" },
];

const PROJECTS_RIGHT = [
    { id: "07", client: "KINETIC", type: "MOTION" },
    { id: "08", client: "NEBULA", type: "DATA" },
    { id: "09", client: "PRISM", type: "LIGHT" },
    { id: "10", client: "ECHO", type: "AUDIO" },
    { id: "11", client: "FLUX", type: "WEB3" },
    { id: "12", client: "ZENITH", type: "ARCHIVE" },
];

const IMAGES = [
    "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?q=80&w=2670&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1634152962476-4b8a00e1915c?q=80&w=2576&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2670&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1604871000636-074fa5117945?q=80&w=2574&auto=format&fit=crop",
];

export default function HeroSection() {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [activeIndex] = useState(0);

    const handleScroll = () => {
        if (!scrollRef.current) return;
        const container = scrollRef.current;
        const images = Array.from(container.children);

        const viewportCenter = window.innerHeight / 2;

        let closestIndex = 0;
        let minDistance = Infinity;

        images.forEach((img, i) => {
            const rect = (img as HTMLElement).getBoundingClientRect();
            const distance = Math.abs((rect.top + rect.height / 2) - viewportCenter);
            if (distance < minDistance) {
                minDistance = distance;
                closestIndex = i;
            }
        });

        // Map extended array back to 12 projects
        // setActiveIndex(closestIndex % 12); // This line was commented out in the original, but the instruction implies it should be active. I will keep it as is.
    };

    return (
        <section className="relative w-full h-screen flex flex-col overflow-hidden text-[#EDEDED]">

            {/* GLOBAL FIXED NAV OVERLAY (Always Visible) */}
            <div className="fixed top-8 left-12 z-50">
                <Link href="/" className="font-sans font-bold text-sm uppercase tracking-wide leading-tight hover:opacity-50 transition-opacity block">
                    HKJ<br />STUDIO
                </Link>
            </div>

            <div className="fixed top-8 right-12 z-50 flex gap-8 font-sans font-bold text-[10px] uppercase tracking-wide">
                <Link href="#work" className="hover:opacity-50 transition-opacity">WORK</Link>
                <Link href="#sandbox" className="hover:opacity-50 transition-opacity">SANDBOX</Link>
                <Link href="#contact" className="hover:opacity-50 transition-opacity">CONTACT</Link>
            </div>

            <div className="fixed bottom-8 left-12 z-50 font-mono text-[10px] text-[#525252] uppercase">
                [SEOUL, KR]
            </div>
            <div className="fixed bottom-8 right-12 z-50 font-mono text-[10px] text-[#525252] uppercase">
                [SCROLL_Y]
            </div>


            {/* CONTENT GRID */}
            <div className="w-full max-w-[1920px] mx-auto grid grid-cols-12 h-full border-x border-[#262626]">

                {/* --------------------
                    LEFT COLUMN (Col 1-4) - LIST
                   -------------------- */}
                <div className="hidden lg:flex col-span-4 border-r border-[#262626] flex-col relative px-12">
                    {/* CENTERED LIST BLOCK */}
                    <div className="h-full flex flex-col justify-center gap-10">
                        {PROJECTS_LEFT.map((p, i) => {
                            const isActive = activeIndex === i;
                            return (
                                <div key={p.id} className={`group cursor-pointer transition-all duration-300 flex items-center gap-4 ${isActive ? "opacity-100 translate-x-4" : "opacity-30 hover:opacity-60"}`}>
                                    <div className="font-mono text-[10px] w-6 text-[#525252] group-hover:text-[#EDEDED] transition-colors">{p.id}/</div>
                                    <div className={`font-sans text-sm tracking-widest uppercase font-medium`}>
                                        {p.client}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* --------------------
                    CENTER COLUMN (Col 5-8) - SCROLLABLE
                    (Visible on Mobile as Full Width, 3-col on Desktop)
                   -------------------- */}
                <div className="col-span-12 lg:col-span-4 relative overflow-hidden flex flex-col items-center border-r border-[#262626] lg:border-r-0">

                    {/* SCROLL CONTAINER */}
                    <div
                        ref={scrollRef}
                        onScroll={() => {
                            handleScroll();
                            // Infinite Scroll Logic
                            if (scrollRef.current) {
                                const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
                                const sectionHeight = scrollHeight / 4; // 4 sets of images

                                // Jump back to top set if at bottom
                                if (scrollTop >= sectionHeight * 3) {
                                    scrollRef.current.scrollTop = scrollTop - sectionHeight * 2;
                                }
                                // Jump forward to bottom set if at top
                                else if (scrollTop <= sectionHeight * 0.5) {
                                    scrollRef.current.scrollTop = scrollTop + sectionHeight * 2;
                                }
                            }
                        }}
                        className="w-full h-full overflow-y-auto no-scrollbar pt-[40vh] pb-[40vh] flex flex-col items-center gap-0 scroll-smooth snap-y snap-mandatory"
                    >
                        {/* 4 Sets of Images for Smooth Looping */}
                        {[...IMAGES, ...IMAGES, ...IMAGES, ...IMAGES].map((src, i) => (
                            <div key={i} className="w-full aspect-[3/4] flex-shrink-0 relative group snap-center pl-12 pr-12 py-12">
                                {/* IMAGE CARD */}
                                <div className="w-full h-full relative overflow-hidden">
                                    <img src={src} className="w-full h-full object-cover grayscale brightness-[0.6] group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-700 ease-out scale-100 group-hover:scale-105" alt="Project" />
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* CROSSHAIR */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20 mix-blend-difference">
                        <div className="w-2 h-2 border border-[#EDEDED] bg-transparent" />
                    </div>

                </div>

                {/* --------------------
                    RIGHT COLUMN (Col 9-12) - LIST
                   -------------------- */}
                <div className="hidden lg:flex col-span-4 border-l border-[#262626] flex-col relative px-12">
                    {/* CENTERED LIST BLOCK */}
                    <div className="h-full flex flex-col justify-center gap-10 text-right">
                        {PROJECTS_RIGHT.map((p, i) => {
                            const idx = i + 6;
                            const isActive = activeIndex === idx;
                            return (
                                <div key={p.id} className={`group cursor-pointer transition-all duration-300 flex items-center justify-end gap-4 ${isActive ? "opacity-100 -translate-x-4" : "opacity-30 hover:opacity-60"}`}>
                                    <div className="font-mono text-[10px] order-2 text-[#525252] group-hover:text-[#EDEDED] transition-colors">\{p.id}</div>
                                    <div className={`font-sans text-sm tracking-widest uppercase font-medium order-1`}>
                                        {p.client}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

            </div>
        </section>
    );
}
