"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import Magnetic from "./Magnetic";

const navItems = [
    { name: "About", href: "#about" },
    { name: "Portfolio", href: "#projects" },
    { name: "Contact", href: "#contact" },
];

export default function Header() {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const menuVariants: import("framer-motion").Variants = {
        initial: { clipPath: "circle(0% at 100% 0%)" },
        animate: {
            clipPath: "circle(150% at 100% 0%)",
            transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] }
        },
        exit: {
            clipPath: "circle(0% at 100% 0%)",
            transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] }
        }
    };

    return (
        <>
            <motion.header
                className={`fixed top-0 left-0 right-0 z-[100] transition-colors duration-500 ${scrolled ? "py-4" : "py-8"
                    }`}
            >
                <nav className="container flex items-center justify-between">
                    <Magnetic strength={0.2}>
                        <a href="#" className="text-2xl font-bold tracking-tighter text-foreground font-heading">
                            HJ<span className="text-accent">/</span>01
                        </a>
                    </Magnetic>

                    <div className="flex items-center gap-8">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="group flex items-center gap-3 bg-transparent border-none cursor-pointer focus:outline-none"
                        >
                            <span className="text-xs font-bold uppercase tracking-[0.3em] text-foreground font-heading hidden md:block">
                                {isOpen ? "Close" : "Menu"}
                            </span>
                            <div className="relative w-12 h-12 rounded-full glass flex items-center justify-center overflow-hidden border border-soft-border group-hover:bg-foreground group-hover:text-background transition-colors duration-500">
                                <AnimatePresence mode="wait">
                                    {isOpen ? (
                                        <motion.div key="close" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }}>
                                            <X size={20} />
                                        </motion.div>
                                    ) : (
                                        <motion.div key="menu" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }}>
                                            <Menu size={20} />
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </button>
                    </div>
                </nav>
            </motion.header>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        variants={menuVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        className="fixed inset-0 z-[90] bg-foreground text-background flex items-center justify-center"
                    >
                        <div className="container grid md:grid-cols-2 gap-24 items-center">
                            <div className="flex flex-col space-y-8">
                                <span className="text-xs font-bold uppercase tracking-[0.5em] text-background/40 font-heading">Navigation</span>
                                {navItems.map((item, i) => (
                                    <motion.a
                                        key={item.name}
                                        href={item.href}
                                        onClick={() => setIsOpen(false)}
                                        initial={{ x: -100, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.4 + i * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                                        className="text-6xl md:text-9xl font-bold font-heading hover:italic hover:text-accent transition-all duration-300 block leading-[0.8]"
                                    >
                                        {item.name}
                                    </motion.a>
                                ))}
                            </div>

                            <div className="hidden md:flex flex-col space-y-12 border-l border-background/10 pl-24">
                                <div className="space-y-4">
                                    <span className="text-xs font-bold uppercase tracking-[0.5em] text-background/40 font-heading">Socials</span>
                                    <div className="flex flex-col space-y-2">
                                        <a href="#" className="text-2xl hover:text-accent transition-colors">Instagram</a>
                                        <a href="#" className="text-2xl hover:text-accent transition-colors">Twitter</a>
                                        <a href="#" className="text-2xl hover:text-accent transition-colors">Dribbble</a>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <span className="text-xs font-bold uppercase tracking-[0.5em] text-background/40 font-heading">Contact</span>
                                    <a href="mailto:hello@hyeonjun.space" className="text-2xl hover:text-accent transition-colors block">hello@hyeonjun.space</a>
                                </div>
                            </div>
                        </div>

                        {/* Decorative Background Text */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[30rem] font-bold text-background/[0.02] pointer-events-none font-heading whitespace-nowrap overflow-hidden italic leading-none">
                            HYEONJUN HYEONJUN HYEONJUN
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
