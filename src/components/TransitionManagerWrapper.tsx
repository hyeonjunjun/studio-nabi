"use client";
import dynamic from "next/dynamic";
const TransitionManager = dynamic(() => import("@/components/TransitionManager"), { ssr: false });
export default function TransitionManagerWrapper() { return <TransitionManager />; }
