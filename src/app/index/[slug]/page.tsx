"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { useTheaterStore } from "@/store/useTheaterStore";
import Preloader from "@/components/Preloader";
import TheaterStage from "@/components/TheaterStage";

export default function ProjectDetailFallback() {
  const params = useParams<{ slug: string }>();
  const { setSelectedSlug, expandDetail, setActiveTab } = useTheaterStore();

  useEffect(() => {
    if (params?.slug) {
      setActiveTab("index");
      setSelectedSlug(params.slug);
      expandDetail();
    }
  }, [params?.slug, setSelectedSlug, expandDetail, setActiveTab]);

  return (
    <>
      <Preloader />
      <TheaterStage />
    </>
  );
}
