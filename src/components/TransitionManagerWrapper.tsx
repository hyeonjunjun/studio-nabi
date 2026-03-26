"use client";
import dynamic from "next/dynamic";
const TransitionManager = dynamic(() => import("@/components/TransitionManager"), {
  ssr: false,
  loading: () => null,
});
export default function TransitionManagerWrapper() { return <TransitionManager />; }
