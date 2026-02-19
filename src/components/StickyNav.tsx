"use client";

import { motion, useScroll, useTransform, useMotionValueEvent } from "framer-motion";
import Link from "next/link";
import { useState } from "react";

export default function StickyNav() {
    const { scrollY } = useScroll();
    const [hidden, setHidden] = useState(true);

    useMotionValueEvent(scrollY, "change", (latest) => {
        const previous = scrollY.getPrevious() || 0;
        // Show after 90vh (past hero)
        if (latest > window.innerHeight * 0.9) {
            setHidden(false);
        } else {
            setHidden(true);
        }
    });

    return (
        <motion.nav
            className="fixed top-0 left-0 right-0 z-40 bg-canvas/80 backdrop-blur-md border-b border-ink/[0.06] py-4 px-6 sm:px-12 lg:px-20 flex items-center justify-between pointer-events-none data-[visible=true]:pointer-events-auto"
            data-visible={!hidden}
            initial={{ y: -100, opacity: 0 }}
            animate={hidden ? { y: -100, opacity: 0 } : { y: 0, opacity: 1 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
            <Link
                href="/"
                className="font-pixel text-[10px] tracking-[0.25em] uppercase text-ink hover:text-accent transition-colors duration-300"
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            >
                Studio Nabi
            </Link>

            <div className="flex gap-6 sm:gap-8">
                {[
                    { label: "Work", href: "#work" },
                    { label: "About", href: "#about" },
                    { label: "Contact", href: "mailto:stuuudionabi@gmail.com" },
                ].map(({ label, href }) => (
                    <Link
                        key={label}
                        href={href}
                        className="font-pixel text-[9px] tracking-[0.2em] uppercase text-ink-muted hover:text-ink transition-colors duration-300"
                    >
                        {label}
                    </Link>
                ))}
            </div>
        </motion.nav>
    );
}
