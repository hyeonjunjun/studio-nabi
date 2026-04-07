"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { useTheaterStore } from "@/store/useTheaterStore";
import Preloader from "@/components/Preloader";
import TheaterStage from "@/components/TheaterStage";

export default function ArchiveDetailFallback() {
  const params = useParams<{ slug: string }>();
  const { setSelectedSlug, expandDetail, setActiveTab } = useTheaterStore();

  useEffect(() => {
    if (params?.slug) {
      setActiveTab("archive");
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
