"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";

interface RollingLinkProps {
    href: string;
    label: string;
    onClick?: () => void;
}

export default function RollingLink({ href, label, onClick }: RollingLinkProps) {
    const [isHovered, setIsHovered] = useState(false);

    const isExternal = href.startsWith("http") || href.startsWith("mailto") || href.startsWith("#");
    const Component = isExternal ? "a" : Link;
    const props = isExternal ? { href, onClick, target: href.startsWith("http") ? "_blank" : undefined, rel: href.startsWith("http") ? "noopener noreferrer" : undefined } : { href, onClick };

    // @ts-ignore - Dynamic component props typing is tricky here but valid
    return (
        <Component
            {...props}
            className="relative overflow-hidden h-[16px] flex flex-col items-center justify-start group"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Original Text (Pixel / Tech) */}
            <motion.span
                className="font-pixel text-[9px] tracking-[0.2em] uppercase text-ink-muted block"
                animate={{ y: isHovered ? "-100%" : "0%" }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
                {label}
            </motion.span>

            {/* Hover Text (Serif / Organic / Bloom) */}
            <motion.span
                className="font-display italic text-[11px] tracking-[0.1em] text-accent block absolute top-full left-0 right-0 text-center"
                animate={{ y: isHovered ? "-100%" : "0%" }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
                {label}
            </motion.span>
        </Component>
    );
}
