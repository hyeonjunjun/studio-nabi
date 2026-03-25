"use client";
import dynamic from "next/dynamic";
const Preloader = dynamic(() => import("@/components/Preloader"), { ssr: false });
export default function PreloaderWrapper() { return <Preloader />; }
