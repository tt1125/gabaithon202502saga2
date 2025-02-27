"use client";

import Loading from "@/components/Loading";
import Start from "@/components/Start";
import { useGoogleMapContext } from "@/context/GoogleMapContext";
import { useEffect, useState } from "react";

export default function Page() {
  const [progress, storedProgress] = useState(0);
  const [suggestedRoutes, setSuggestedRoutes] = useState<SuggestedRoutes>();
  const { setActive } = useGoogleMapContext();

  const getSuggestedRoute = async () => {
    const routes = await DUMMY_DATA;
    setSuggestedRoutes(routes);
    storedProgress(2);
  };

  useEffect(() => {
    if (progress === 1) {
      const routes = getSuggestedRoute();
    }
  }, [progress]);

  switch (progress) {
    case 0:
      return <Start progress={progress} setProgress={storedProgress} />;
    case 1:
      return <Loading message="現在地からルートを生成しています" />;
    case 2:
      return <div>Unknown state</div>;
  }
}
