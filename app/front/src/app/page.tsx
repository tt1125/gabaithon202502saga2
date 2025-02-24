"use client";

import { useGoogleMapContext } from "@/context/GoogleMapContext";
import { useEffect } from "react";

export default function Page() {
  const { setActive } = useGoogleMapContext();
  useEffect(() => {
    setActive(true);
  }, []);
  return <></>;
}
